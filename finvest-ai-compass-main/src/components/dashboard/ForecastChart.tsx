import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { AlphaVantage, detectAnomalies, movingAverage, slope, TimePoint } from "@/utils/alphaVantage";
import { fmtCurrency, tokenColor } from "@/utils/format";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart, Scatter, ScatterChart } from "recharts";

interface Props {
  onMetrics?: (m: { trendSlope: number; lastClose: number | null; anomalies: number }) => void;
  symbolDefault?: string;
}

export const ForecastChart = ({ onMetrics, symbolDefault = "IBM" }: Props) => {
  const [symbol, setSymbol] = useState(symbolDefault);
  const [loading, setLoading] = useState(false);
  const [series, setSeries] = useState<TimePoint[]>([]);
  const [lastClose, setLastClose] = useState<number | null>(null);
  const [apiKey, setApiKey] = useState(AlphaVantage.getKey() || "");
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const r = await AlphaVantage.fetchDaily(symbol);
      setSeries(r.series.slice(-120));
      setLastClose(r.lastClose);
      const anomalies = detectAnomalies(r.series);
      const s = slope(r.series);
      onMetrics?.({ trendSlope: s, lastClose: r.lastClose, anomalies: anomalies.length });
      if (!r.series.length) toast({ title: "No data", description: "Try another symbol or add your API key." });
    } catch (e) {
      console.error(e);
      toast({ title: "Market data error", description: "Check symbol or API key.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ma20 = useMemo(() => movingAverage(series, 20), [series]);
  const chartData = useMemo(() => series.map((p, i) => ({ ...p, ma20: ma20[i] })), [series, ma20]);

  const priceColor = tokenColor("--foreground");
  const maColor = tokenColor("--primary");

  return (
    <Card className="p-4 md:p-6 shadow-soft">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold">Forecast & Trends</h2>
          <p className="text-sm text-muted-foreground">Daily prices with 20-day MA</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} placeholder="Ticker e.g. AAPL" className="sm:w-40" />
          <Button onClick={load} disabled={loading}>{loading ? "Loading..." : "Fetch"}</Button>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-sm text-muted-foreground">Last close: <span className="font-medium text-foreground">{fmtCurrency(lastClose)}</span></div>
      </div>

      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={maColor} stopOpacity={0.25} />
                <stop offset="100%" stopColor={maColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip formatter={(v) => (typeof v === "number" ? fmtCurrency(v) : v)} labelFormatter={(d) => new Date(d).toLocaleDateString()} />
            <Area type="monotone" dataKey="close" stroke={priceColor} fill="url(#priceFill)" strokeWidth={1} />
            <Line type="monotone" dataKey="ma20" stroke={maColor} strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="text-sm">
          <div className="text-muted-foreground">Alpha Vantage API key</div>
          <div className="flex gap-2 mt-1">
            <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Optional – save to query any symbol" />
            <Button onClick={() => { AlphaVantage.saveKey(apiKey); toast({ title: "Saved", description: "API key stored locally" }); }}>Save</Button>
          </div>
          <div className="text-xs text-muted-foreground mt-1">Using demo key if empty (IBM only)</div>
        </div>
      </div>
    </Card>
  );
};

export default ForecastChart;
