import { Card } from "@/components/ui/card";

interface Props {
  trendSlope: number;
  sentiment: { positive: number; neutral: number; negative: number } | null;
}

const RecommendationBadge = ({ trendSlope, sentiment }: Props) => {
  const pos = sentiment?.positive ?? 0;
  const neg = sentiment?.negative ?? 0;
  const total = Math.max(1, pos + neg);
  const sentimentScore = (pos - neg) / total; // -1..1

  let label: "Buy" | "Hold" | "Sell" = "Hold";
  if (trendSlope > 0 && sentimentScore > 0.15) label = "Buy";
  if (trendSlope < 0 && sentimentScore < -0.15) label = "Sell";

  const subtitle =
    label === "Buy"
      ? "Uptrend with supportive sentiment"
      : label === "Sell"
      ? "Downtrend with negative tone"
      : "Mixed signals – wait for confirmation";

  const badgeClass =
    label === "Buy"
      ? "bg-primary text-primary-foreground"
      : label === "Sell"
      ? "bg-destructive text-destructive-foreground"
      : "bg-secondary text-secondary-foreground";

  return (
    <Card className="p-4 md:p-6 shadow-soft">
      <h2 className="text-xl font-semibold">Recommendation</h2>
      <p className="text-sm text-muted-foreground">Rule-based preview (MVP)</p>
      <div className={`inline-flex mt-4 px-4 py-2 rounded-md font-semibold ${badgeClass}`}>{label}</div>
      <p className="text-sm mt-2 text-muted-foreground">{subtitle}</p>
    </Card>
  );
};

export default RecommendationBadge;
