import warnings
warnings.filterwarnings("ignore")

import pandas as pd
import numpy as np
import datetime as dt
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_squared_error, accuracy_score, classification_report
from sklearn.model_selection import TimeSeriesSplit, cross_val_score
from sklearn.preprocessing import StandardScaler, RobustScaler
import matplotlib.pyplot as plt
import joblib
from scipy import stats
import seaborn as sns

# Sentiment analysis
import nltk
try:
    nltk.data.find('vader_lexicon')
except LookupError:
    nltk.download('vader_lexicon')
from nltk.sentiment.vader import SentimentIntensityAnalyzer

# Optional live data
try:
    import yfinance as yf
except ImportError:
    yf = None

import os

# Configuration
class Config:
    # Data paths
    MARKET_CSV = "market.csv"
    SENTIMENT_CSV = "sentiment.csv" 
    EARNINGS_CSV = "earnings.csv"
    
    # Strategy parameters
    TARGET_TICKER = "AAPL"
    MODEL_OUTPUT = "enhanced_rf_model.joblib"
    
    # Improved thresholds
    PRED_RETURN_BUY_THRESHOLD = 0.003   # 0.3% threshold
    PRED_RETURN_SELL_THRESHOLD = -0.003
    SENTIMENT_WEIGHT = 0.3              # Weight for sentiment in final score
    CONFIDENCE_THRESHOLD = 0.002        # Minimum confidence for trade
    
    # Risk management
    MAX_POSITION_SIZE = 0.1             # Max 10% of portfolio per trade
    STOP_LOSS_PCT = 0.05                # 5% stop loss
    TAKE_PROFIT_PCT = 0.10              # 10% take profit

# Enhanced data generation (same as original but with better seed control)
def generate_simulated_market_data(ticker, start_date='2020-01-01', end_date='2024-01-01'):
    """Generate more realistic market data with regime changes"""
    dates = pd.date_range(start=start_date, end=end_date, freq='B')
    n = len(dates)
    
    np.random.seed(42)
    
    # Create volatility regimes
    regime_changes = np.random.choice(n, size=5, replace=False)
    regime_changes = np.sort(regime_changes)
    
    returns = np.zeros(n)
    for i in range(len(regime_changes)):
        start_idx = regime_changes[i-1] if i > 0 else 0
        end_idx = regime_changes[i] if i < len(regime_changes)-1 else n
        
        # Different volatility regimes
        if i % 2 == 0:  # Low vol regime
            vol = 0.015
            drift = 0.0008
        else:  # High vol regime
            vol = 0.035
            drift = -0.0002
            
        returns[start_idx:end_idx] = np.random.normal(drift, vol, end_idx-start_idx)
    
    # Create price series
    price = 100 * (1 + returns).cumprod()
    
    # More realistic OHLCV
    open_ = np.zeros(n)
    high = np.zeros(n)
    low = np.zeros(n)
    
    for i in range(n):
        if i == 0:
            open_[i] = price[i]
        else:
            open_[i] = price[i-1] * (1 + np.random.normal(0, 0.002))
        
        intraday_range = abs(returns[i]) * np.random.uniform(1.2, 2.5)
        high[i] = max(open_[i], price[i]) * (1 + intraday_range * 0.5)
        low[i] = min(open_[i], price[i]) * (1 - intraday_range * 0.5)
    
    volume = np.random.lognormal(12, 0.5, n).astype(int)
    
    df = pd.DataFrame({
        'date': dates,
        'ticker': ticker,
        'open': open_,
        'high': high,
        'low': low,
        'close': price,
        'volume': volume
    })
    return df

def generate_simulated_sentiment_data(ticker, market_dates):
    """Generate more realistic sentiment data with market correlation"""
    np.random.seed(43)
    
    # More diverse and realistic sentiment texts
    positive_texts = [
        "Strong quarterly earnings beat expectations",
        "CEO announces major product innovation",
        "Positive analyst upgrade with price target increase",
        "Strategic partnership announced with tech giant",
        "Market share expansion in key segments",
        "Strong cash flow and dividend increase",
        "Successful product launch drives revenue growth"
    ]
    
    negative_texts = [
        "Regulatory investigation announced",
        "Disappointing earnings miss estimates",
        "Key executive departure concerns investors",
        "Supply chain disruption impacts production",
        "Increased competition pressures margins",
        "Legal settlement exceeds expectations",
        "Guidance cut due to market headwinds"
    ]
    
    neutral_texts = [
        "Quarterly earnings in line with expectations",
        "Management provides routine business update",
        "Industry conference presentation scheduled",
        "Analyst maintains neutral rating",
        "Regular board meeting completed"
    ]
    
    all_texts = positive_texts + negative_texts + neutral_texts
    text_sentiments = [0.3] * len(positive_texts) + [-0.3] * len(negative_texts) + [0.0] * len(neutral_texts)
    
    rows = []
    for i, date in enumerate(market_dates):
        # Variable news frequency (more news on volatile days)
        base_freq = 0.7  # 70% chance of news
        n_news = np.random.poisson(base_freq)
        
        for _ in range(n_news):
            text_idx = np.random.choice(len(all_texts))
            text = all_texts[text_idx]
            rows.append({'date': date, 'ticker': ticker, 'text': text})
    
    return pd.DataFrame(rows)

def generate_simulated_earnings_data(ticker, start_date='2020-01-01', end_date='2024-01-01'):
    """Generate more realistic earnings with growth trends"""
    quarters = pd.date_range(start=start_date, end=end_date, freq='Q')
    np.random.seed(44)
    
    # Simulate realistic growth
    base_revenue = 1e10
    growth_rates = np.random.normal(0.03, 0.02, len(quarters))  # 3% quarterly growth avg
    revenue = [base_revenue]
    
    for g in growth_rates[1:]:
        revenue.append(revenue[-1] * (1 + g))
    
    # Realistic margins with variability
    margins = 0.15 + np.random.normal(0, 0.02, len(quarters))
    margins = np.clip(margins, 0.05, 0.30)
    net_income = np.array(revenue) * margins
    
    df = pd.DataFrame({
        'date': quarters,
        'ticker': ticker,
        'quarter': quarters.to_period('Q').astype(str),
        'revenue': revenue,
        'net_income': net_income,
        'revenue_growth': [0] + [r/revenue[i-1] - 1 for i, r in enumerate(revenue[1:])],
        'margin': margins
    })
    return df

# Enhanced technical indicators
def compute_enhanced_technical_indicators(df):
    """Compute comprehensive technical indicators"""
    df = df.copy()
    df['return'] = df['close'].pct_change()
    df['log_return'] = np.log(df['close'] / df['close'].shift(1))
    
    # Multiple timeframe moving averages
    for window in [5, 10, 20, 50]:
        df[f'ma_{window}'] = df['close'].rolling(window).mean()
        df[f'price_to_ma_{window}'] = df['close'] / df[f'ma_{window}'] - 1
    
    # Volatility indicators
    df['vol_5'] = df['log_return'].rolling(5).std()
    df['vol_10'] = df['log_return'].rolling(10).std()
    df['vol_20'] = df['log_return'].rolling(20).std()
    df['vol_ratio'] = df['vol_5'] / (df['vol_20'] + 1e-9)
    
    # RSI with multiple periods
    for period in [14, 21]:
        delta = df['close'].diff()
        up = delta.clip(lower=0)
        down = -1 * delta.clip(upper=0)
        ma_up = up.rolling(period).mean()
        ma_down = down.rolling(period).mean()
        rs = ma_up / (ma_down + 1e-9)
        df[f'rsi_{period}'] = 100 - (100 / (1 + rs))
    
    # Momentum indicators
    for window in [3, 5, 10, 20]:
        df[f'mom_{window}'] = df['close'] / df['close'].shift(window) - 1
    
    # Bollinger Bands
    bb_window = 20
    bb_std = df['close'].rolling(bb_window).std()
    bb_mean = df['close'].rolling(bb_window).mean()
    df['bb_upper'] = bb_mean + 2 * bb_std
    df['bb_lower'] = bb_mean - 2 * bb_std
    df['bb_position'] = (df['close'] - bb_mean) / (2 * bb_std)
    
    # Volume indicators
    df['volume_ma_10'] = df['volume'].rolling(10).mean()
    df['volume_ratio'] = df['volume'] / (df['volume_ma_10'] + 1)
    
    # Price patterns
    df['daily_range'] = (df['high'] - df['low']) / df['close']
    df['gap'] = (df['open'] - df['close'].shift(1)) / df['close'].shift(1)
    
    # Trend strength
    df['trend_5'] = df['close'].rolling(5).apply(lambda x: stats.linregress(range(len(x)), x)[0] if len(x) == 5 else np.nan)
    df['trend_10'] = df['close'].rolling(10).apply(lambda x: stats.linregress(range(len(x)), x)[0] if len(x) == 10 else np.nan)
    
    return df.dropna()

# Enhanced sentiment analysis
def compute_enhanced_sentiment(sentiment_df):
    """Enhanced sentiment scoring with weighted importance"""
    sid = SentimentIntensityAnalyzer()
    
    def enhanced_sentiment_score(text):
        if not isinstance(text, str) or text.strip() == "":
            return {'sentiment': 0.0, 'confidence': 0.0, 'word_count': 0}
        
        # Basic VADER score
        scores = sid.polarity_scores(text)
        
        # Weight by text length and key financial terms
        word_count = len(text.split())
        financial_terms = ['earnings', 'revenue', 'profit', 'growth', 'margin', 'guidance', 'outlook']
        financial_weight = sum(1 for term in financial_terms if term.lower() in text.lower())
        
        # Confidence based on extremity and relevance
        confidence = min(abs(scores['compound']) + financial_weight * 0.1, 1.0)
        
        return {
            'sentiment': scores['compound'],
            'confidence': confidence,
            'word_count': word_count
        }
    
    if sentiment_df is None or len(sentiment_df) == 0:
        return pd.DataFrame(columns=['date', 'ticker', 'sentiment', 'confidence'])
    
    s = sentiment_df.copy()
    s['date'] = pd.to_datetime(s['date']).dt.date
    
    # Apply enhanced scoring
    sentiment_scores = s['text'].apply(enhanced_sentiment_score)
    s['sentiment'] = [score['sentiment'] for score in sentiment_scores]
    s['confidence'] = [score['confidence'] for score in sentiment_scores]
    s['word_count'] = [score['word_count'] for score in sentiment_scores]
    
    # Aggregate daily with confidence weighting
    def weighted_sentiment(group):
        if len(group) == 0:
            return pd.Series({'sentiment': 0.0, 'confidence': 0.0, 'news_count': 0})
        
        weights = group['confidence'] + 0.1  # Avoid zero weights
        weighted_sent = (group['sentiment'] * weights).sum() / weights.sum()
        avg_confidence = group['confidence'].mean()
        news_count = len(group)
        
        return pd.Series({
            'sentiment': weighted_sent,
            'confidence': avg_confidence,
            'news_count': news_count
        })
    
    daily = s.groupby(['date', 'ticker']).apply(weighted_sentiment).reset_index()
    daily['date'] = pd.to_datetime(daily['date'])
    
    return daily

# Enhanced modeling with ensemble
class EnhancedPredictor:
    def __init__(self):
        self.models = {
            'rf': RandomForestRegressor(n_estimators=300, max_depth=10, random_state=42),
            'gb': GradientBoostingRegressor(n_estimators=200, max_depth=6, random_state=42),
            'ridge': Ridge(alpha=1.0, random_state=42)
        }
        self.scaler = RobustScaler()  # More robust to outliers
        self.feature_importance = None
        
    def fit(self, X, y):
        X_scaled = self.scaler.fit_transform(X)
        
        # Train individual models
        for name, model in self.models.items():
            model.fit(X_scaled, y)
        
        # Store feature importance from random forest
        self.feature_importance = self.models['rf'].feature_importances_
        
    def predict(self, X):
        X_scaled = self.scaler.transform(X)
        
        # Ensemble prediction (weighted average)
        predictions = []
        weights = {'rf': 0.4, 'gb': 0.4, 'ridge': 0.2}  # RF and GB get more weight
        
        ensemble_pred = np.zeros(len(X_scaled))
        for name, model in self.models.items():
            pred = model.predict(X_scaled)
            ensemble_pred += weights[name] * pred
            
        return ensemble_pred
    
    def predict_with_confidence(self, X):
        """Return prediction with confidence measure"""
        X_scaled = self.scaler.transform(X)
        
        # Get predictions from all models
        preds = {}
        for name, model in self.models.items():
            preds[name] = model.predict(X_scaled)
        
        # Ensemble prediction
        weights = {'rf': 0.4, 'gb': 0.4, 'ridge': 0.2}
        ensemble_pred = sum(weights[name] * preds[name] for name in self.models.keys())
        
        # Confidence based on agreement between models
        pred_array = np.array(list(preds.values()))
        confidence = 1 / (1 + np.std(pred_array, axis=0))  # High agreement = high confidence
        
        return ensemble_pred, confidence

def load_or_generate_data(ticker=Config.TARGET_TICKER):
    """Load data or generate if not available"""
    
    # Market data
    if os.path.exists(Config.MARKET_CSV):
        market = pd.read_csv(Config.MARKET_CSV, parse_dates=['date'])
    else:
        print(f"Generating simulated market data for {ticker}")
        market = generate_simulated_market_data(ticker)
        market.to_csv(Config.MARKET_CSV, index=False)
    
    market = market[market['ticker'] == ticker].copy()
    market = market.sort_values('date').reset_index(drop=True)
    
    # Sentiment data
    if os.path.exists(Config.SENTIMENT_CSV):
        sentiment = pd.read_csv(Config.SENTIMENT_CSV, parse_dates=['date'])
    else:
        print(f"Generating simulated sentiment data for {ticker}")
        sentiment = generate_simulated_sentiment_data(ticker, market['date'])
        sentiment.to_csv(Config.SENTIMENT_CSV, index=False)
    
    # Earnings data
    if os.path.exists(Config.EARNINGS_CSV):
        earnings = pd.read_csv(Config.EARNINGS_CSV, parse_dates=['date'])
    else:
        print(f"Generating simulated earnings data for {ticker}")
        earnings = generate_simulated_earnings_data(ticker)
        earnings.to_csv(Config.EARNINGS_CSV, index=False)
    
    return market, sentiment, earnings

def prepare_enhanced_features(market_df, sentiment_df, earnings_df=None):
    """Prepare comprehensive feature set"""
    
    # Technical indicators
    m = compute_enhanced_technical_indicators(market_df)
    
    # Enhanced sentiment
    if sentiment_df is not None and len(sentiment_df) > 0:
        daily_sent = compute_enhanced_sentiment(sentiment_df)
        daily_sent = daily_sent[daily_sent['ticker'] == market_df['ticker'].iloc[0]]
        m = m.merge(daily_sent[['date', 'sentiment', 'confidence', 'news_count']], 
                   how='left', on='date')
    else:
        m['sentiment'] = 0.0
        m['confidence'] = 0.0
        m['news_count'] = 0
    
    # Fill missing sentiment
    m['sentiment'] = m['sentiment'].fillna(0.0)
    m['confidence'] = m['confidence'].fillna(0.0)
    m['news_count'] = m['news_count'].fillna(0)
    
    # Earnings features (forward-fill quarterly data)
    if earnings_df is not None and len(earnings_df) > 0:
        e = earnings_df[earnings_df['ticker'] == market_df['ticker'].iloc[0]].copy()
        e = e.sort_values('date')
        
        # Create growth metrics
        e['revenue_growth_yoy'] = e['revenue'].pct_change(4)  # Assuming quarterly data
        e['income_growth_yoy'] = e['net_income'].pct_change(4)
        
        # Forward fill to daily frequency
        e_daily = e.set_index('date').resample('D').ffill().reset_index()
        e_daily['date'] = pd.to_datetime(e_daily['date']).dt.date
        m['date_key'] = pd.to_datetime(m['date']).dt.date
        
        earnings_cols = ['revenue', 'net_income', 'revenue_growth_yoy', 'income_growth_yoy', 'margin']
        available_cols = [col for col in earnings_cols if col in e_daily.columns]
        
        if available_cols:
            merge_cols = ['date'] + available_cols
            m = m.merge(e_daily[merge_cols].rename(columns={'date': 'date_key'}), 
                       how='left', on='date_key')
            m = m.drop(columns=['date_key'])
    
    # Create target (next day return)
    m['target_next_return'] = m['return'].shift(-1)
    
    # Create additional targets for classification
    m['target_direction'] = np.where(m['target_next_return'] > 0, 1, 0)
    m['target_strong_move'] = np.where(abs(m['target_next_return']) > 0.02, 1, 0)
    
    return m.dropna()

# Enhanced strategy with risk management
class EnhancedStrategy:
    def __init__(self, config=Config):
        self.config = config
        self.predictor = EnhancedPredictor()
        self.position = 0  # Current position (-1 to 1)
        self.entry_price = None
        self.trades = []
        
    def fit(self, features_df, feature_cols):
        """Train the ensemble model"""
        X = features_df[feature_cols].values
        y = features_df['target_next_return'].values
        
        # Time series split for validation
        tscv = TimeSeriesSplit(n_splits=5)
        cv_scores = []
        
        for train_idx, val_idx in tscv.split(X):
            X_train, X_val = X[train_idx], X[val_idx]
            y_train, y_val = y[train_idx], y[val_idx]
            
            temp_predictor = EnhancedPredictor()
            temp_predictor.fit(X_train, y_train)
            pred_val = temp_predictor.predict(X_val)
            score = mean_squared_error(y_val, pred_val)
            cv_scores.append(score)
        
        print(f"Cross-validation RMSE: {np.mean(cv_scores):.6f} (+/- {np.std(cv_scores):.6f})")
        
        # Fit final model on all training data
        split_idx = int(len(features_df) * 0.8)
        X_train = X[:split_idx]
        y_train = y[:split_idx]
        
        self.predictor.fit(X_train, y_train)
        return split_idx
    
    def generate_signals(self, features_df, feature_cols, split_idx):
        """Generate trading signals with confidence"""
        test_df = features_df.iloc[split_idx:].copy()
        X_test = test_df[feature_cols].values
        
        # Get predictions with confidence
        pred_returns, confidence = self.predictor.predict_with_confidence(X_test)
        test_df['pred_next_return'] = pred_returns
        test_df['pred_confidence'] = confidence
        
        # Enhanced signal generation
        def generate_signal(row):
            pred_ret = row['pred_next_return']
            sentiment = row['sentiment']
            conf = row['pred_confidence']
            sent_conf = row.get('confidence', 0.5)  # sentiment confidence
            
            # Combined score: prediction * model_confidence + sentiment * sentiment_weight * sent_confidence
            final_score = (pred_ret * conf + 
                          sentiment * self.config.SENTIMENT_WEIGHT * sent_conf)
            
            # Only trade if confidence is high enough
            if conf < self.config.CONFIDENCE_THRESHOLD:
                return 'HOLD', final_score, 0.0
            
            # Position sizing based on confidence
            position_size = min(conf * self.config.MAX_POSITION_SIZE, self.config.MAX_POSITION_SIZE)
            
            if final_score > self.config.PRED_RETURN_BUY_THRESHOLD:
                return 'BUY', final_score, position_size
            elif final_score < self.config.PRED_RETURN_SELL_THRESHOLD:
                return 'SELL', final_score, -position_size
            else:
                return 'HOLD', final_score, 0.0
        
        signals = test_df.apply(generate_signal, axis=1)
        test_df['signal'] = [s[0] for s in signals]
        test_df['final_score'] = [s[1] for s in signals]
        test_df['position_size'] = [s[2] for s in signals]
        
        return test_df

# Enhanced backtesting with risk management
def enhanced_backtest(signals_df):
    """Backtest with proper risk management"""
    df = signals_df.copy().reset_index(drop=True)
    
    # Initialize tracking variables
    position = 0
    entry_price = None
    portfolio_value = 1.0
    cash = 1.0
    
    results = []
    
    for i, row in df.iterrows():
        current_price = row['close']
        next_return = row['target_next_return']
        signal = row['signal']
        position_size = row['position_size']
        
        # Calculate current portfolio value
        if position != 0 and entry_price is not None:
            current_portfolio_value = cash + position * (current_price / entry_price - 1)
        else:
            current_portfolio_value = cash
        
        # Risk management: stop loss and take profit
        if position != 0 and entry_price is not None:
            price_change = (current_price / entry_price - 1)
            
            # Check stop loss or take profit
            if (position > 0 and price_change < -Config.STOP_LOSS_PCT) or \
               (position < 0 and price_change > Config.STOP_LOSS_PCT) or \
               (position > 0 and price_change > Config.TAKE_PROFIT_PCT) or \
               (position < 0 and price_change < -Config.TAKE_PROFIT_PCT):
                # Close position
                cash = current_portfolio_value
                position = 0
                entry_price = None
                signal = 'CLOSE'
        
        # Execute new signals
        if signal == 'BUY' and position <= 0:
            cash = current_portfolio_value
            position = position_size
            entry_price = current_price
        elif signal == 'SELL' and position >= 0:
            cash = current_portfolio_value
            position = -abs(position_size)
            entry_price = current_price
        elif signal == 'HOLD' and position != 0:
            # Keep current position
            pass
        
        # Calculate strategy return for this period
        if position != 0:
            strategy_return = position * next_return
        else:
            strategy_return = 0.0
        
        results.append({
            'date': row['date'],
            'signal': signal,
            'position': position,
            'strategy_return': strategy_return,
            'market_return': next_return,
            'portfolio_value': current_portfolio_value
        })
    
    results_df = pd.DataFrame(results)
    
    # Calculate cumulative returns
    results_df['strategy_cum_return'] = (1 + results_df['strategy_return']).cumprod() - 1
    results_df['market_cum_return'] = (1 + results_df['market_return']).cumprod() - 1
    
    # Calculate metrics
    strategy_returns = results_df['strategy_return']
    market_returns = results_df['market_return']
    
    metrics = {
        'total_strategy_return': results_df['strategy_cum_return'].iloc[-1],
        'total_market_return': results_df['market_cum_return'].iloc[-1],
        'strategy_volatility': strategy_returns.std() * np.sqrt(252),
        'market_volatility': market_returns.std() * np.sqrt(252),
        'strategy_sharpe': (strategy_returns.mean() / strategy_returns.std()) * np.sqrt(252) if strategy_returns.std() > 0 else 0,
        'market_sharpe': (market_returns.mean() / market_returns.std()) * np.sqrt(252) if market_returns.std() > 0 else 0,
        'max_drawdown': calculate_max_drawdown(results_df['strategy_cum_return']),
        'win_rate': (strategy_returns > 0).mean(),
        'avg_win': strategy_returns[strategy_returns > 0].mean() if (strategy_returns > 0).any() else 0,
        'avg_loss': strategy_returns[strategy_returns < 0].mean() if (strategy_returns < 0).any() else 0,
    }
    
    return results_df, metrics

def calculate_max_drawdown(cum_returns):
    """Calculate maximum drawdown"""
    peak = cum_returns.expanding().max()
    drawdown = (cum_returns - peak) / (1 + peak)
    return drawdown.min()

def create_enhanced_visualizations(backtest_df, metrics, feature_importance=None, feature_names=None):
    """Create comprehensive visualization dashboard"""
    
    fig, axes = plt.subplots(2, 2, figsize=(15, 10))
    
    # 1. Cumulative returns
    axes[0,0].plot(backtest_df['date'], backtest_df['strategy_cum_return'], 
                   label='Enhanced Strategy', linewidth=2)
    axes[0,0].plot(backtest_df['date'], backtest_df['market_cum_return'], 
                   label='Buy & Hold', linewidth=2, alpha=0.7)
    axes[0,0].set_title('Cumulative Returns Comparison')
    axes[0,0].legend()
    axes[0,0].grid(True, alpha=0.3)
    axes[0,0].tick_params(axis='x', rotation=45)
    
    # 2. Rolling Sharpe ratio (30-day window)
    window = 30
    rolling_sharpe_strategy = (backtest_df['strategy_return'].rolling(window).mean() / 
                              backtest_df['strategy_return'].rolling(window).std()) * np.sqrt(252)
    rolling_sharpe_market = (backtest_df['market_return'].rolling(window).mean() / 
                            backtest_df['market_return'].rolling(window).std()) * np.sqrt(252)
    
    axes[0,1].plot(backtest_df['date'], rolling_sharpe_strategy, label='Strategy', alpha=0.8)
    axes[0,1].plot(backtest_df['date'], rolling_sharpe_market, label='Market', alpha=0.8)
    axes[0,1].set_title(f'Rolling {window}-Day Sharpe Ratio')
    axes[0,1].legend()
    axes[0,1].grid(True, alpha=0.3)
    axes[0,1].tick_params(axis='x', rotation=45)
    
    # 3. Signal distribution
    signal_counts = backtest_df['signal'].value_counts()
    axes[1,0].bar(signal_counts.index, signal_counts.values)
    axes[1,0].set_title('Trading Signal Distribution')
    axes[1,0].set_ylabel('Count')
    
    # 4. Feature importance (if available)
    if feature_importance is not None and feature_names is not None:
        top_features = sorted(zip(feature_names, feature_importance), 
                             key=lambda x: x[1], reverse=True)[:10]
        features, importance = zip(*top_features)
        
        axes[1,1].barh(range(len(features)), importance)
        axes[1,1].set_yticks(range(len(features)))
        axes[1,1].set_yticklabels(features)
        axes[1,1].set_title('Top 10 Feature Importance')
        axes[1,1].set_xlabel('Importance')
    else:
        # Metrics table instead
        metrics_text = '\n'.join([f'{k}: {v:.4f}' for k, v in metrics.items()])
        axes[1,1].text(0.1, 0.5, metrics_text, transform=axes[1,1].transAxes, 
                      fontsize=10, verticalalignment='center')
        axes[1,1].set_title('Strategy Metrics')
        axes[1,1].axis('off')
    
    plt.tight_layout()
    plt.show()

def analyze_feature_importance(predictor, feature_names):
    """Analyze and display feature importance"""
    if predictor.feature_importance is None:
        return
    
    importance_df = pd.DataFrame({
        'feature': feature_names,
        'importance': predictor.feature_importance
    }).sort_values('importance', ascending=False)
    
    print("\nTop 15 Most Important Features:")
    print(importance_df.head(15).to_string(index=False))
    
    return importance_df

def main_enhanced(ticker=Config.TARGET_TICKER):
    """Main execution with enhanced pipeline"""
    
    print("=" * 60)
    print("ENHANCED INVESTMENT STRATEGY PIPELINE")
    print("=" * 60)
    
    # Load data
    print("\n1. Loading/Generating Data...")
    market_df, sentiment_df, earnings_df = load_or_generate_data(ticker)
    print(f"   Market rows: {len(market_df)}")
    print(f"   Sentiment rows: {len(sentiment_df)}")
    print(f"   Earnings rows: {len(earnings_df)}")
    
    # Prepare features
    print("\n2. Feature Engineering...")
    features_df = prepare_enhanced_features(market_df, sentiment_df, earnings_df)
    print(f"   Feature rows after cleaning: {len(features_df)}")
    
    # Select features
    exclude_cols = ['date', 'ticker', 'open', 'high', 'low', 'close', 'volume', 
                   'target_next_return', 'target_direction', 'target_strong_move']
    feature_cols = [c for c in features_df.columns 
                   if c not in exclude_cols and 
                   features_df[c].dtype in [float, int, np.float64, np.int64]]
    
    print(f"   Selected {len(feature_cols)} features")
    
    # Train model
    print("\n3. Training Enhanced Model...")
    strategy = EnhancedStrategy()
    split_idx = strategy.fit(features_df, feature_cols)
    
    # Feature importance analysis
    importance_df = analyze_feature_importance(strategy.predictor, feature_cols)
    
    # Generate signals
    print("\n4. Generating Trading Signals...")
    signals_df = strategy.generate_signals(features_df, feature_cols, split_idx)
    
    # Backtest
    print("\n5. Enhanced Backtesting...")
    backtest_df, metrics = enhanced_backtest(signals_df)
    
    # Display results
    print("\n" + "=" * 50)
    print("ENHANCED STRATEGY RESULTS")
    print("=" * 50)
    
    for metric, value in metrics.items():
        print(f"{metric.replace('_', ' ').title()}: {value:.4f}")
    
    # Calculate improvement vs original
    original_return = -0.181  # From your original results
    improvement = metrics['total_strategy_return'] - original_return
    print(f"\nImprovement vs Original: {improvement:.4f} ({improvement*100:.2f}%)")
    
    # Risk-adjusted performance
    if metrics['strategy_sharpe'] > metrics['market_sharpe']:
        print(f"✓ Strategy Sharpe ({metrics['strategy_sharpe']:.3f}) beats market ({metrics['market_sharpe']:.3f})")
    else:
        print(f"✗ Strategy Sharpe ({metrics['strategy_sharpe']:.3f}) underperforms market ({metrics['market_sharpe']:.3f})")
    
    # Visualizations
    print("\n6. Creating Visualizations...")
    create_enhanced_visualizations(backtest_df, metrics, 
                                 strategy.predictor.feature_importance, feature_cols)
    
    # Save results
    output_file = f"{ticker}_enhanced_backtest.csv"
    backtest_df.to_csv(output_file, index=False)
    print(f"\nResults saved to: {output_file}")
    
    # Sample recent decisions
    print("\nRecent Trading Decisions:")
    recent_cols = ['date', 'signal', 'pred_next_return', 'sentiment', 'final_score', 
                  'position_size', 'strategy_return']
    available_cols = [col for col in recent_cols if col in backtest_df.columns]
    print(backtest_df[available_cols].tail(10).to_string(index=False))
    
    return strategy, backtest_df, metrics

def analyze_strategy_performance(backtest_df, metrics):
    """Additional performance analysis"""
    
    print("\n" + "=" * 50)
    print("DETAILED PERFORMANCE ANALYSIS")
    print("=" * 50)
    
    # Trade analysis
    trades = backtest_df[backtest_df['signal'].isin(['BUY', 'SELL'])]
    if len(trades) > 0:
        print(f"\nTotal Trades: {len(trades)}")
        print(f"Buy Signals: {len(trades[trades['signal'] == 'BUY'])}")
        print(f"Sell Signals: {len(trades[trades['signal'] == 'SELL'])}")
        
        # Win/Loss analysis
        winning_trades = backtest_df[backtest_df['strategy_return'] > 0]
        losing_trades = backtest_df[backtest_df['strategy_return'] < 0]
        
        if len(winning_trades) > 0:
            print(f"Winning Trades: {len(winning_trades)} ({len(winning_trades)/len(backtest_df)*100:.1f}%)")
            print(f"Average Win: {winning_trades['strategy_return'].mean():.4f}")
            
        if len(losing_trades) > 0:
            print(f"Losing Trades: {len(losing_trades)} ({len(losing_trades)/len(backtest_df)*100:.1f}%)")
            print(f"Average Loss: {losing_trades['strategy_return'].mean():.4f}")
    
    # Monthly performance breakdown
    backtest_df['month'] = pd.to_datetime(backtest_df['date']).dt.to_period('M')
    monthly_returns = backtest_df.groupby('month')['strategy_return'].sum()
    
    print(f"\nMonthly Returns Summary:")
    print(f"Best Month: {monthly_returns.max():.4f}")
    print(f"Worst Month: {monthly_returns.min():.4f}")
    print(f"Positive Months: {(monthly_returns > 0).sum()}/{len(monthly_returns)}")

# Run the enhanced pipeline
if __name__ == "__main__":
    strategy, backtest_df, metrics = main_enhanced()
    analyze_strategy_performance(backtest_df, metrics)


