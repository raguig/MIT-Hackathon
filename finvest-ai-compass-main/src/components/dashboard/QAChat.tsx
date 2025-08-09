import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Send, Upload, Link as LinkIcon } from "lucide-react";
import { marked } from "marked";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface DocData {
  name: string;
  type: string;
  content?: string;
  source: "upload" | "url";
}

const API_URL = "http://localhost:5000/api";

// Add a helper function to parse markdown and preserve breaks
const parseMarkdown = (content: string) => {
  marked.setOptions({
    breaks: true,
    gfm: true,
  });
  return marked(content);
};

// Add a MessageContent component to handle formatted text
const MessageContent = ({ content }: { content: string }) => {
  return (
    <span
      className="text-sm leading-relaxed"
      dangerouslySetInnerHTML={{
        __html: parseMarkdown(content),
      }}
    />
  );
};

export const QAChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your financial expert advisor. You can ask me about any financial topic, market analysis, or investment strategy. If you have specific documents to analyze, feel free to upload them for more targeted insights.",
    },
  ]);
  const [input, setInput] = useState("");
  const [url, setUrl] = useState("");
  const [docs, setDocs] = useState<DocData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTicker, setCurrentTicker] = useState<string>("");
  const [sentiment, setSentiment] = useState<null | {
    symbol: string;
    average_sentiment: number;
    latest_sentiment: number;
    details: any[];
  }>(null);
  const { toast } = useToast();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const stripHtml = (html: string) =>
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ");

  const processDocument = async (text: string) => {
    try {
      setIsProcessing(true);
      const response = await fetch(`${API_URL}/process-document`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("Failed to process document");
      setIsProcessing(false);
    } catch (error) {
      console.error("Error processing document:", error);
      toast({
        title: "Error",
        description: "Failed to process document",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const addDoc = async (doc: DocData) => {
    const next = [doc, ...docs].slice(0, 6);
    setDocs(next);
    if (doc.content) {
      await processDocument(doc.content);
    }
  };

  const onFiles = async (files: FileList | null) => {
    if (!files) return;
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "txt" || ext === "html" || ext === "htm" || ext === "pdf") {
        try {
          let content = "";
          if (ext === "pdf") {
            const formData = new FormData();
            formData.append("file", file);
            const response = await fetch(`${API_URL}/process-pdf`, {
              method: "POST",
              body: formData,
            });
            const data = await response.json();
            content = data.text;
          } else {
            content = await file.text();
            if (ext === "html" || ext === "htm") {
              content = stripHtml(content);
            }
          }
          await addDoc({
            name: file.name,
            type: file.type || "text/plain",
            content: content,
            source: "upload",
          });
        } catch (error) {
          console.error("Error processing file:", error);
          toast({
            title: "Error",
            description: `Failed to process ${file.name}`,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Unsupported",
          description: `${file.name} not supported yet.`,
          variant: "destructive",
        });
      }
    }
  };

  const fetchFromUrl = async () => {
    if (!url) return;
    try {
      const res = await fetch(url, { mode: "cors" });
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("html") || ct.includes("text")) {
        const text = await res.text();
        await addDoc({
          name: url,
          type: ct,
          content: stripHtml(text),
          source: "url",
        });
        setUrl("");
        toast({ title: "Fetched", description: "Content ingested" });
      } else {
        toast({
          title: "Unsupported",
          description: `Content-Type ${ct}`,
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Fetch failed",
        description: "CORS or network error",
        variant: "destructive",
      });
    }
  };

  const answer = async (q: string) => {
    try {
      setIsProcessing(true);
      const response = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          ticker: currentTicker, // Include current ticker if available
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get answer");
      }

      // Ensure proper markdown formatting for lists and sections
      let formattedAnswer = data.answer
        .replace(/^\s*[-*]\s+/gm, "* ") // Standardize list markers
        .replace(/(\*\*[^*]+\*\*):/g, "$1:\n"); // Add newline after section headers

      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: formattedAnswer,
        },
      ]);
      setIsProcessing(false);
    } catch (error) {
      console.error("Error getting answer:", error);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `Error: ${
            error instanceof Error ? error.message : "Unknown error occurred"
          }`,
        },
      ]);
      setIsProcessing(false);
    }
  };

  const onSend = () => {
    const q = input.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    if (docs.length === 0) {
      toast({
        title: "No documents",
        description: "Upload or fetch a document for better answers.",
      });
    }
    answer(q);
  };

  const fetchSentiment = async (symbol: string) => {
    const res = await fetch("http://localhost:5000/api/sentiment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol }),
    });
    const data = await res.json();
    if (data.status === "success") {
      setSentiment(data);
    } else {
      setSentiment(null);
    }
  };

  const renderSuggestions = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      {[
        "What's your view on current market conditions?",
        "How to evaluate a company's financial health?",
        "Explain risk management strategies",
        "What are key economic indicators to watch?",
      ].map((suggestion, i) => (
        <Button
          key={i}
          variant="outline"
          size="sm"
          onClick={() => {
            setInput(suggestion);
            answer(suggestion);
          }}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );

  // Add ticker input
  const renderTickerInput = () => (
    <div className="flex gap-2 mb-4">
      <Input
        placeholder="Enter ticker (e.g., AAPL)"
        value={currentTicker}
        onChange={(e) => setCurrentTicker(e.target.value.toUpperCase())}
        className="w-32"
      />
      <Button
        variant="outline"
        onClick={() =>
          currentTicker && answer(`Tell me about ${currentTicker}`)
        }
      >
        Analyze
      </Button>
    </div>
  );

  return (
    <Card className="p-4 md:p-6 h-full shadow-soft">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Financial Expert AI</h2>
          <p className="text-sm text-muted-foreground">
            Ask about financial topics or upload documents for specific analysis
          </p>
        </div>
        <Upload className="opacity-70" />
      </div>

      {messages.length === 1 && renderSuggestions()}

      <div className="grid gap-3 mb-4">
        <div className="flex gap-2">
          <Input
            type="file"
            multiple
            onChange={(e) => onFiles(e.target.files)}
            className="flex-1"
          />
          <Button
            variant="secondary"
            onClick={() =>
              document
                .querySelector<HTMLInputElement>("input[type=file]")
                ?.click()
            }
          >
            Browse
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="https://example.com/financial-report"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button onClick={fetchFromUrl} variant="default">
            <LinkIcon className="mr-1" />
            Fetch
          </Button>
        </div>
      </div>

      {docs.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Processed documents:</h3>
          <div className="text-sm text-muted-foreground">
            {docs.map((doc, i) => (
              <div key={i}>{doc.name}</div>
            ))}
          </div>
        </div>
      )}

      <div className="h-64 md:h-72 border rounded-md p-3 overflow-auto bg-card/50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-2 ${m.role === "user" ? "text-right" : "text-left"}`}
          >
            <div
              className={`inline-block rounded-md px-3 py-2 ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              <MessageContent content={m.content} />
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="mt-3 flex gap-2">
        <Input
          placeholder="Ask about markets, investments, or financial analysis..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? onSend() : undefined)}
        />
        <Button onClick={onSend} variant="hero" disabled={isProcessing}>
          {isProcessing ? <div className="animate-spin">↻</div> : <Send />}
        </Button>
      </div>

      {/* Sentiment Analysis Demo */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Sentiment Analysis Demo</h3>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Enter symbol (e.g. MSFT)"
            onChange={(e) => setCurrentTicker(e.target.value.toUpperCase())}
            value={currentTicker}
            className="border px-2 py-1 rounded mr-2"
          />
          <button
            onClick={() => fetchSentiment(currentTicker)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Get Sentiment
          </button>
        </div>
        {sentiment && (
          <div className="mb-2">
            <div>
              <b>Sentiment for {sentiment.symbol}:</b>
            </div>
            <div>
              Average:{" "}
              <span
                className={
                  sentiment.average_sentiment > 0
                    ? "text-green-600"
                    : sentiment.average_sentiment < 0
                    ? "text-red-600"
                    : "text-yellow-600"
                }
              >
                {sentiment.average_sentiment.toFixed(2)}
              </span>
            </div>
            <div>
              Latest:{" "}
              <span
                className={
                  sentiment.latest_sentiment > 0
                    ? "text-green-600"
                    : sentiment.latest_sentiment < 0
                    ? "text-red-600"
                    : "text-yellow-600"
                }
              >
                {sentiment.latest_sentiment.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default QAChat;
