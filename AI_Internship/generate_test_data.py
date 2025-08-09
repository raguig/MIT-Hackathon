import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Generate sample stock data
def generate_stock_data(days=252):  # 1 year of trading days
    np.random.seed(42)  # For reproducibility
    
    # Start date (1 year ago)
    start_date = datetime.now() - timedelta(days=days)
    dates = [start_date + timedelta(days=x) for x in range(days)]
    
    # Initial price
    price = 100
    prices = [price]
    
    # Generate prices with random walk
    for _ in range(days-1):
        change_percent = np.random.normal(0.0001, 0.02)  # Mean slightly positive
        price = price * (1 + change_percent)
        prices.append(price)
    
    # Generate other columns
    df = pd.DataFrame({
        'Date': dates,
        'Close': prices,
        'Open': [p * (1 + np.random.normal(0, 0.005)) for p in prices],
        'High': [p * (1 + abs(np.random.normal(0, 0.01))) for p in prices],
        'Low': [p * (1 - abs(np.random.normal(0, 0.01))) for p in prices],
        'Volume': [int(np.random.normal(1000000, 200000)) for _ in range(days)]
    })
    
    # Clean up dates and sort
    df['Date'] = pd.to_datetime(df['Date']).dt.strftime('%Y-%m-%d')
    df = df.sort_values('Date')
    
    return df

# Generate and save the data
df = generate_stock_data()
csv_path = 'sample_stock_data.csv'
df.to_csv(csv_path, index=False)
print(f"Generated sample stock data and saved to {csv_path}")
print(f"First few rows:")
print(df.head())