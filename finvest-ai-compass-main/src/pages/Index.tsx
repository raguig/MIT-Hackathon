import AmbientGlow from "@/components/AmbientGlow";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QAChat } from "@/components/dashboard/QAChat";
import ForecastChart from "@/components/dashboard/ForecastChart";
import RecommendationBadge from "@/components/dashboard/RecommendationBadge";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  TrendingUp,
  BrainCircuit,
  BarChart3,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logoImage from "@/assets/findocgpt-logo.png";
import { Award, Calendar } from "lucide-react";
import TrendsGrid from "@/components/TrendsGrid";
import EventsGrid from "@/components/EventsGrid";
import SuccessStories from "@/components/SuccessStories";

const Index = () => {
  const [trendSlope, setTrendSlope] = useState(0);
  const [lastClose, setLastClose] = useState<number | null>(null);
  const [currentTicker, setCurrentTicker] = useState("AAPL");
  const [marketAnalysis, setMarketAnalysis] = useState(null);
  const username = localStorage.getItem("username") || "User";

  const handleMarketAnalysis = (analysis: any) => {
    setMarketAnalysis(analysis);
    setTrendSlope(analysis.ma_trends.ma_20_trend);
    setLastClose(analysis.last_close);
  };

  return (
    <div className="min-h-screen">
      <AmbientGlow />

      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-3">
                <img src={logoImage} alt="FinDocGPT" className="h-8" />
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  FinDocGPT
                </h1>
              </div>
              <Badge
                variant="outline"
                className="hidden sm:flex items-center gap-2"
              >
                <BrainCircuit className="h-3 w-3" /> AI Powered
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground">Welcome,</span>
              <span className="font-medium">{username}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* First Grid - Analysis and Charts */}
        <div className="grid lg:grid-cols-12 gap-6 mb-12">
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="p-4 md:p-6 shadow-soft">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-4">
                <Button className="w-full" variant="default">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
                <Button variant="outline" className="w-full">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Market Analysis
                </Button>
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Current Stock</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{currentTicker}</span>
                    <span className="text-sm text-muted-foreground">
                      ${lastClose?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <RecommendationBadge
              trendSlope={trendSlope}
              sentiment={marketAnalysis?.sentiment}
              marketData={marketAnalysis}
            />
          </div>

          {/* Middle Column - Chat and Analysis */}
          <div className="lg:col-span-6">
            <QAChat />
          </div>

          {/* Right Column - Market Data */}
          <div className="lg:col-span-3">
            <Card className="p-4 md:p-6 shadow-soft">
              <h2 className="text-xl font-semibold mb-4">Market Analysis</h2>
              {marketAnalysis ? (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">RSI</span>
                      <span className="font-medium">
                        {marketAnalysis.analysis?.rsi?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Trend
                      </span>
                      <span className="font-medium">
                        {(
                          marketAnalysis.analysis?.ma_trends?.ma_20_trend * 100
                        ).toFixed(2)}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Signal
                      </span>
                      <span
                        className={`font-medium ${
                          marketAnalysis.analysis?.signals?.predicted_move ===
                          "UP"
                            ? "text-green-500"
                            : marketAnalysis.analysis?.signals
                                ?.predicted_move === "DOWN"
                            ? "text-red-500"
                            : ""
                        }`}
                      >
                        {marketAnalysis.analysis?.signals?.predicted_move}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Select a stock to view analysis
                </p>
              )}
            </Card>
          </div>
        </div>

        {/* Chart Section */}
        <section className="mt-6 mb-12">
          <ForecastChart
            onMetrics={(m) => {
              setTrendSlope(m.trendSlope);
              setLastClose(m.lastClose);
            }}
            symbolDefault={currentTicker}
          />
        </section>

        {/* Second Grid - Trends and Events */}
        <div className="grid lg:grid-cols-12 gap-8 mb-12">
          {/* Financial Trends */}
          <div
            className="lg:col-span-6 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="mb-6">
              <h3 className="text-subheading mb-2 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Latest Financial Trends
              </h3>
            </div>
            <TrendsGrid />
          </div>

          {/* Financial Events */}
          <div
            className="lg:col-span-6 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="mb-6">
              <h3 className="text-subheading mb-2 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                Latest Events
              </h3>
            </div>
            <EventsGrid />
          </div>
        </div>

        {/* Success Stories */}
        <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="mb-6">
            <h3 className="text-subheading mb-2 flex items-center gap-2">
              <Award className="h-5 w-5 text-accent" />
              Success Stories
            </h3>
          </div>
          <SuccessStories />
        </div>

        {/* Updated Footer */}
        <footer className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Badge
                variant="secondary"
                className="bg-success/10 text-success border-success/20"
              >
                Secure SSL
              </Badge>
              <span className="text-sm text-muted-foreground">
                AI Model: FinDocGPT v1.0
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/privacy"
                className="text-sm text-muted-foreground hover:text-accent"
              >
                Privacy Policy
              </Link>
              <Link
                to="/audit"
                className="text-sm text-muted-foreground hover:text-accent"
              >
                Audit Log
              </Link>
              <Link
                to="/dashboard"
                className="text-sm text-muted-foreground hover:text-accent"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
