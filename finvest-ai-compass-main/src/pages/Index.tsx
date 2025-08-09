import AmbientGlow from "@/components/AmbientGlow";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QAChat } from "@/components/dashboard/QAChat";
import SentimentPie, {
  simpleSentiment,
  SentimentScores,
} from "@/components/dashboard/SentimentPie";
import ForecastChart from "@/components/dashboard/ForecastChart";
import RecommendationBadge from "@/components/dashboard/RecommendationBadge";
import { BarChart3, BrainCircuit } from "lucide-react";
import { useMemo, useState } from "react";

const Index = () => {
  const [trendSlope, setTrendSlope] = useState(0);
  const [lastClose, setLastClose] = useState<number | null>(null);
  const sentiment = null; // Or implement sentiment analysis differently if needed

  return (
    <div className="min-h-screen">
      {/* SEO main H1 */}
      <h1 className="sr-only">
        FinDocGPT – AI Financial Document Analysis & Strategy
      </h1>
      <AmbientGlow />

      {/* Hero */}
      <header className="py-10 md:py-14">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs text-muted-foreground">
              <BrainCircuit className="opacity-80" /> Stage 1–3 MVP Preview
            </div>
            <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">
              FinDocGPT
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Ingest filings and news, analyze sentiment, spot anomalies, and
              visualize trends to drive Buy / Hold / Sell decisions.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button variant="hero" size="lg">
                Get Started
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#forecast" className="">
                  {" "}
                  <BarChart3 className="mr-2" /> View Demo Chart
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard grid */}
      <main className="container pb-16">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <QAChat />
          </div>
          <div className="lg:col-span-1">
            <Card className="p-4 md:p-6 shadow-soft">
              <h2 className="text-xl font-semibold">Anomaly Detection</h2>
              <p className="text-sm text-muted-foreground">
                Flags &gt;10% daily drops (from price data)
              </p>
              <div className="mt-4 text-sm text-muted-foreground">
                Shown below in the Forecast chart.
              </div>
            </Card>
          </div>
        </section>

        <section
          id="forecast"
          className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2">
            <ForecastChart
              onMetrics={(m) => {
                setTrendSlope(m.trendSlope);
                setLastClose(m.lastClose);
              }}
            />
          </div>
          <div className="lg:col-span-1">
            <RecommendationBadge
              trendSlope={trendSlope}
              sentiment={sentiment}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
