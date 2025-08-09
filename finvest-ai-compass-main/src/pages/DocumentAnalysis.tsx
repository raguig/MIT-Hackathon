import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  TrendingDown,
  Download,
  ArrowLeft,
  Eye
} from 'lucide-react';
import DocumentUpload from '@/components/DocumentUpload';
import AnalysisResults from '@/components/AnalysisResults';

const DocumentAnalysis = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setAnalysisComplete(false);
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
              <div className="hidden sm:block h-6 w-px bg-border" />
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Document Analysis
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                AI-Powered
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Rail - Upload & Options */}
          <div className="lg:col-span-3 space-y-6">
            <DocumentUpload 
              onFileUpload={handleFileUpload}
              uploadedFile={uploadedFile}
            />

            {uploadedFile && (
              <Card className="card-primary">
                <CardHeader>
                  <CardTitle className="text-base">Analysis Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Model</label>
                    <Select defaultValue="v1.0">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="v1.0">FinDocGPT v1.0</SelectItem>
                        <SelectItem value="beta">FinDocGPT v2.0 (Beta)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Analysis Depth</label>
                    <Select defaultValue="quick">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quick">Quick (30s)</SelectItem>
                        <SelectItem value="full">Full (several minutes)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Sensitivity</label>
                    <Select defaultValue="balanced">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">Conservative</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4">
                    <Button 
                      onClick={startAnalysis} 
                      className="w-full btn-primary"
                      disabled={isAnalyzing || analysisComplete}
                    >
                      {isAnalyzing ? 'Analyzing...' : analysisComplete ? 'Analysis Complete' : 'Start Analysis'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            {!uploadedFile ? (
              <div className="text-center py-16">
                <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Upload a Document to Begin</h3>
                <p className="text-muted-foreground">
                  Upload your financial document to get AI-powered sentiment analysis and anomaly detection
                </p>
              </div>
            ) : isAnalyzing ? (
              <Card className="card-floating">
                <CardContent className="py-12">
                  <div className="text-center space-y-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-accent border-t-transparent mx-auto"></div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Analyzing Document</h3>
                      <p className="text-muted-foreground mb-4">
                        Running sentiment analysis and anomaly detection on {uploadedFile.name}
                      </p>
                      <Progress value={66} className="w-64 mx-auto" />
                      <p className="text-sm text-muted-foreground mt-2">
                        Processing... 2 of 3 steps complete
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : analysisComplete ? (
              <AnalysisResults fileName={uploadedFile.name} />
            ) : (
              <Card className="card-primary">
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Document Ready for Analysis</h3>
                  <p className="text-muted-foreground">
                    {uploadedFile.name} has been uploaded. Configure your analysis options and click "Start Analysis" to begin.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentAnalysis;