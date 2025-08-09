import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";

const TOP_SYMBOLS = [
  { symbol: "MSFT", name: "Microsoft" },
  { symbol: "GOOGL", name: "Alphabet" },
  { symbol: "AMZN", name: "Amazon" },
  { symbol: "TSLA", name: "Tesla" },
  { symbol: "NFLX", name: "Netflix" },
  { symbol: "META", name: "Meta" },
  { symbol: "NVDA", name: "NVIDIA" },
  { symbol: "DIS", name: "Disney" },
  { symbol: "BA", name: "Boeing" },
];

interface Props {
  onMetrics?: (m: {
    trendSlope: number;
    lastClose: number | null;
    anomalies: number;
  }) => void;
  symbolDefault?: string;
}

export const ForecastChart = ({ onMetrics, symbolDefault = "IBM" }: Props) => {
  const [symbol, setSymbol] = useState(symbolDefault);
  const [loading, setLoading] = useState(false);
  const [series, setSeries] = useState<any[]>([]);
  const [lastClose, setLastClose] = useState<number | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null); // NEW
  const { toast } = useToast();

  const fetchSeries = async (sym: string) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/price-series", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: sym, days: 120 }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setSeries(data.series);
        setLastClose(data.lastClose);
        setRecommendation(data.recommendation); // NEW
        onMetrics?.({
          trendSlope: 0,
          lastClose: data.lastClose,
          anomalies: 0,
        });
      } else {
        setSeries([]);
        setLastClose(null);
        setRecommendation(null); // NEW
        toast({
          title: "No data",
          description: data.message || "No data found for this symbol.",
          variant: "destructive",
        });
      }
    } catch (e) {
      setSeries([]);
      setLastClose(null);
      setRecommendation(null); // NEW
      toast({
        title: "Error",
        description: "Failed to fetch data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries(symbol);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  return (
    <Card className="p-4 md:p-6 shadow-soft">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold">Forecast & Trends</h2>
          <p className="text-sm text-muted-foreground">
            Daily prices with 20-day MA
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3 mb-2">
        {TOP_SYMBOLS.map((s) => (
          <Button
            key={s.symbol}
            size="sm"
            variant={symbol === s.symbol ? "default" : "outline"}
            onClick={() => setSymbol(s.symbol)}
          >
            {s.symbol}
          </Button>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        <Input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="Ticker e.g. AAPL"
          className="sm:w-40"
        />
        <Button onClick={() => fetchSeries(symbol)} disabled={loading}>
          {loading ? "Loading..." : "Fetch"}
        </Button>
      </div>

      <div className="text-sm text-muted-foreground mb-2">
        Last close:{" "}
        <span className="font-medium text-foreground">
          {lastClose !== null ? `$${lastClose.toFixed(2)}` : "--"}
        </span>
      </div>

      {/* Recommendation Display */}
      {recommendation && (
        <div className="mb-2">
          <span className="font-semibold">Recommendation: </span>
          <span
            className={
              recommendation === "BUY"
                ? "text-green-600 font-bold"
                : recommendation === "SELL"
                ? "text-red-600 font-bold"
                : "text-yellow-600 font-bold"
            }
          >
            {recommendation}
          </span>
        </div>
      )}

      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={series}
            margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8884d8" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip
              formatter={(v) =>
                typeof v === "number" ? `$${v.toFixed(2)}` : v
              }
              labelFormatter={(d) => new Date(d).toLocaleDateString()}
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke="#8884d8"
              fill="url(#priceFill)"
              strokeWidth={1}
            />
            <Line
              type="monotone"
              dataKey="ma20"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="sentiment"
              stroke="#f59e42"
              strokeWidth={2}
              dot={false}
              yAxisId={1}
            />
            <YAxis yAxisId={1} orientation="right" hide domain={[-1, 1]} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ForecastChart;
