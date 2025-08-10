import requests

def fetch_alpha_vantage(symbol, api_key):
    url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={api_key}"
    response = requests.get(url)
    data = response.json()
    return data["Time Series (Daily)"]

import matplotlib.pyplot as plt
import pandas as pd

def plot_prices(data):
    df = pd.DataFrame.from_dict(data, orient='index')
    df = df.astype(float)
    df['MA20'] = df['4. close'].rolling(window=20).mean()
    df[['4. close', 'MA20']].plot(title="Price + MA20")
    plt.show()

from prophet import Prophet

def forecast_prices(data):
    df = pd.DataFrame([
        {"ds": date, "y": float(values["4. close"])}
        for date, values in data.items()
    ])
    df = df.sort_values("ds")
    model = Prophet()
    model.fit(df)
    future = model.make_future_dataframe(periods=30)
    forecast = model.predict(future)
    model.plot(forecast)
    plt.show()

def generate_recommendation(data):
    closes = [float(v["4. close"]) for v in list(data.values())[:5]]
    if closes[0] > closes[-1]:
        return "Buy"
    elif closes[0] < closes[-1]:
        return "Sell"
    else:
        return "Hold"

symbol = "MSFT"
api_key = "93899VRXQ8L3EM1Q"
data = fetch_alpha_vantage(symbol, api_key)
plot_prices(data)
forecast_prices(data)
generate_recommendation(data)

rec = generate_recommendation(data)
print("Recommendation:", rec)
