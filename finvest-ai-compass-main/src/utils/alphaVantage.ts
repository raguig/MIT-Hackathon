export interface TimePoint {
  date: string; // ISO
  close: number;
}

export interface SeriesResult {
  series: TimePoint[];
  lastClose: number | null;
}

const API_KEY_STORAGE = "av_api_key";

export const AlphaVantage = {
  saveKey(key: string) {
    localStorage.setItem(API_KEY_STORAGE, key);
  },
  getKey(): string | null {
    return localStorage.getItem(API_KEY_STORAGE);
  },
  async fetchDaily(symbol: string): Promise<SeriesResult> {
    const key = this.getKey() || "demo"; // demo supports IBM
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(
      symbol
    )}&apikey=${key}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Alpha Vantage error: ${res.status}`);
    const data = await res.json();

    const seriesRaw = data["Time Series (Daily)"];
    if (!seriesRaw) {
      return { series: [], lastClose: null };
    }

    const series: TimePoint[] = Object.entries<any>(seriesRaw)
      .map(([date, o]) => ({ date, close: parseFloat(o["4. close"]) }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return { series, lastClose: series.length ? series[series.length - 1].close : null };
  },
};

export function movingAverage(series: TimePoint[], windowSize = 20): number[] {
  const out: number[] = [];
  let sum = 0;
  for (let i = 0; i < series.length; i++) {
    sum += series[i].close;
    if (i >= windowSize) sum -= series[i - windowSize].close;
    out.push(i >= windowSize - 1 ? sum / windowSize : NaN);
  }
  return out;
}

export function slope(series: TimePoint[], lastN = 10): number {
  const n = Math.min(lastN, series.length);
  if (n < 2) return 0;
  const sub = series.slice(-n);
  // Simple linear regression slope on index vs price
  const xMean = (n - 1) / 2;
  const yMean = sub.reduce((a, p, i) => a + p.close, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (i - xMean) * (sub[i].close - yMean);
    den += (i - xMean) * (i - xMean);
  }
  return num / den;
}

export function detectAnomalies(series: TimePoint[]): number[] {
  const idx: number[] = [];
  for (let i = 1; i < series.length; i++) {
    const prev = series[i - 1].close;
    const curr = series[i].close;
    if (prev > 0 && (prev - curr) / prev > 0.1) idx.push(i);
  }
  return idx;
}
