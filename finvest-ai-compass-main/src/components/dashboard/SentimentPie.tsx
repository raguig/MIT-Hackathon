import { Card } from "@/components/ui/card";
import { tokenColor } from "@/utils/format";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export interface SentimentScores {
  positive: number;
  neutral: number;
  negative: number;
}

const POSITIVE_WORDS = ["growth", "beat", "record", "increase", "strong", "optimistic", "improve", "profit", "surge", "upbeat"];
const NEGATIVE_WORDS = ["decline", "drop", "miss", "risk", "loss", "decrease", "weak", "headwind", "uncertain", "downturn"];

export const simpleSentiment = (text: string): SentimentScores => {
  const words = text.toLowerCase().split(/[^a-z]+/g);
  let pos = 0, neg = 0;
  for (const w of words) {
    if (POSITIVE_WORDS.includes(w)) pos++;
    if (NEGATIVE_WORDS.includes(w)) neg++;
  }
  const total = Math.max(1, pos + neg);
  const neutral = Math.max(0, total * 0.2); // simple prior
  return { positive: pos, neutral, negative: neg };
};

interface Props {
  text: string;
}

export const SentimentPie = ({ text }: Props) => {
  const scores = simpleSentiment(text);
  const data = [
    { name: "Positive", value: scores.positive },
    { name: "Neutral", value: scores.neutral },
    { name: "Negative", value: scores.negative },
  ];

  const colors = [tokenColor("--primary"), tokenColor("--muted-foreground"), tokenColor("--destructive")];

  return (
    <Card className="p-4 md:p-6 shadow-soft">
      <h2 className="text-xl font-semibold">Market Sentiment</h2>
      <p className="text-sm text-muted-foreground mb-4">Estimated from ingested text</p>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} paddingAngle={4}>
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default SentimentPie;
