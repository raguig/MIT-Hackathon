import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Upload,
  Link as LinkIcon,
  FileText,
  FileSpreadsheet,
  FileLineChart,
} from "lucide-react";

export interface DocData {
  name: string;
  type: string;
  content?: string;
  source: "upload" | "url";
}

interface Props {
  onDocsChange?: (docs: DocData[]) => void;
}

const stripHtml = (html: string) =>
  html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ");

export const UploadIngestCard = ({ onDocsChange }: Props) => {
  const [docs, setDocs] = useState<DocData[]>([]);
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const addDoc = (doc: DocData) => {
    const next = [doc, ...docs].slice(0, 6);
    setDocs(next);
    onDocsChange?.(next);
  };

  const onFiles = async (files: FileList | null) => {
    if (!files) return;
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "txt" || ext === "html" || ext === "htm" || ext === "pdf") {
        try {
          let content = "";
          if (ext === "pdf") {
            // For PDF files, we'll need to send the file itself
            const formData = new FormData();
            formData.append("file", file);
            const response = await fetch(
              "http://localhost:5000/api/process-pdf",
              {
                method: "POST",
                body: formData,
              }
            );
            const data = await response.json();
            content = data.text;
          } else {
            content = await file.text();
            if (ext === "html" || ext === "htm") {
              content = stripHtml(content);
            }
          }
          addDoc({
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
        addDoc({
          name: url,
          type: ct,
          content: stripHtml(text),
          source: "url",
        });
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

  return (
    <Card className="p-4 md:p-6 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">Ingest Documents</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Upload PDFs/HTML or fetch URLs to analyze.
          </p>
        </div>
        <Upload className="opacity-70" />
      </div>

      <div className="mt-4 grid gap-3">
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
            placeholder="https://example.com/press-release"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button onClick={fetchFromUrl} variant="default">
            <LinkIcon className="mr-1" />
            Fetch
          </Button>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-medium mb-2">Recent items</h3>
        <ul className="space-y-2 max-h-44 overflow-auto pr-1">
          {docs.length === 0 && (
            <li className="text-sm text-muted-foreground">No documents yet.</li>
          )}
          {docs.map((d, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-md border p-2"
            >
              <div className="flex items-center gap-2">
                {d.name.endsWith(".pdf") ? (
                  <FileText />
                ) : d.name.endsWith(".xlsx") || d.name.endsWith(".csv") ? (
                  <FileSpreadsheet />
                ) : (
                  <FileLineChart />
                )}
                <div>
                  <div
                    className="text-sm font-medium line-clamp-1 max-w-[200px] md:max-w-[300px]"
                    title={d.name}
                  >
                    {d.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {d.source.toUpperCase()}
                  </div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {d.content
                  ? `${d.content.length.toLocaleString()} chars`
                  : "Queued"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default UploadIngestCard;
