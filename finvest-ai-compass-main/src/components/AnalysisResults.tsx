import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  TrendingUp, 
  TrendingDown,
  Download,
  Eye,
  FileText,
  BarChart3
} from 'lucide-react';

interface AnalysisResultsProps {
  fileName: string;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ fileName }) => {
  const riskScore = 34; // Mock risk score
  const confidence = 87; // Mock confidence
  const recommendation = 'Conditional'; // Mock recommendation

  const anomalies = [
    {
      id: 1,
      severity: 'High',
      location: 'Page 3, Line 15',
      type: 'Revenue Recognition',
      explanation: 'Suspicious rounding pattern in Q4 revenue figures',
      evidence: '$2,400,000 → $2,500,000 (4.2% unexplained increase)'
    },
    {
      id: 2,
      severity: 'Medium',
      location: 'Page 7, Table 2',
      type: 'Date Inconsistency',
      explanation: 'Audit date precedes transaction date',
      evidence: 'Audit: 2024-03-15, Transaction: 2024-03-20'
    },
    {
      id: 3,
      severity: 'Low',
      location: 'Page 12, Summary',
      type: 'Ratio Outlier',
      explanation: 'Debt-to-equity ratio 15% above sector benchmark',
      evidence: 'Current: 0.78, Sector avg: 0.68'
    }
  ];

  const sentimentSections = [
    { section: 'Executive Summary', sentiment: 'Positive', score: 0.72 },
    { section: 'Financial Performance', sentiment: 'Neutral', score: 0.12 },
    { section: 'Risk Assessment', sentiment: 'Negative', score: -0.45 },
    { section: 'Future Outlook', sentiment: 'Positive', score: 0.56 }
  ];

  const recommendations = [
    'Validate revenue recognition methodology for Q4 reporting period',
    'Confirm audit timeline and transaction sequence accuracy',
    'Request supporting documentation for Schedule B calculations',
    'Review debt covenant compliance with current ratio levels'
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'risk-high';
      case 'Medium': return 'risk-medium';
      case 'Low': return 'risk-low';
      default: return 'risk-medium';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return 'text-success';
      case 'Negative': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return TrendingUp;
      case 'Negative': return TrendingDown;
      default: return BarChart3;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top-line Decision Card */}
      <Card className="card-floating">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange/10 rounded-full">
                <AlertTriangle className="h-6 w-6 text-orange" />
              </div>
              <div>
                <CardTitle className="text-2xl">Conditional Recommendation</CardTitle>
                <CardDescription>Analysis of {fileName}</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-orange">{riskScore}</div>
              <div className="text-sm text-muted-foreground">Risk Score</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <Progress value={riskScore} className="mb-2" />
              <div className="text-sm text-muted-foreground">Risk Level</div>
            </div>
            <div className="text-center">
              <Progress value={confidence} className="mb-2" />
              <div className="text-sm text-muted-foreground">Confidence: {confidence}%</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">3</div>
              <div className="text-sm text-muted-foreground">Anomalies Found</div>
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Why this recommendation?</h4>
            <p className="text-sm text-muted-foreground">
              Document shows generally positive sentiment but contains 3 anomalies requiring attention. 
              Revenue recognition patterns and timing discrepancies suggest need for additional validation before proceeding.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Analysis Details */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="sentiment" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
              <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
              <TabsTrigger value="recommendations">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="sentiment" className="space-y-4">
              <Card className="card-primary">
                <CardHeader>
                  <CardTitle>Overall Sentiment: Cautiously Positive</CardTitle>
                  <CardDescription>
                    Sentiment analysis across document sections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sentimentSections.map((section) => {
                      const Icon = getSentimentIcon(section.sentiment);
                      return (
                        <div key={section.section} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                          <div className="flex items-center gap-3">
                            <Icon className={`h-4 w-4 ${getSentimentColor(section.sentiment)}`} />
                            <div>
                              <div className="font-medium">{section.section}</div>
                              <div className="text-sm text-muted-foreground">{section.sentiment}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-mono ${getSentimentColor(section.sentiment)}`}>
                              {section.score > 0 ? '+' : ''}{section.score.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6 p-4 bg-accent/5 rounded-lg">
                    <h4 className="font-medium mb-2">Key Phrases</h4>
                    <div className="flex flex-wrap gap-2">
                      {['strong performance', 'market headwinds', 'strategic growth', 'liquidity concerns', 'operational efficiency'].map((phrase) => (
                        <Badge key={phrase} variant="secondary" className="bg-accent/10 text-accent">
                          {phrase}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="anomalies" className="space-y-4">
              {anomalies.map((anomaly) => (
                <Card key={anomaly.id} className="card-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className={getSeverityColor(anomaly.severity)}>
                          {anomaly.severity}
                        </Badge>
                        <CardTitle className="text-base">{anomaly.type}</CardTitle>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Show Evidence
                      </Button>
                    </div>
                    <CardDescription>{anomaly.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{anomaly.explanation}</p>
                    <div className="bg-muted/30 rounded-md p-3">
                      <div className="text-xs text-muted-foreground mb-1">Evidence:</div>
                      <div className="font-mono text-sm">{anomaly.evidence}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <Card className="card-primary">
                <CardHeader>
                  <CardTitle>Recommended Actions</CardTitle>
                  <CardDescription>
                    Suggested next steps based on analysis findings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
                        <div className="flex-shrink-0 w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{rec}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">High Priority</Badge>
                            <Badge variant="outline" className="text-xs">Finance Team</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Rail */}
        <div className="space-y-6">
          <Card className="card-primary">
            <CardHeader>
              <CardTitle className="text-base">Export & Share</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Export PDF Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Export JSON Data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Eye className="mr-2 h-4 w-4" />
                View Full Document
              </Button>
            </CardContent>
          </Card>

          <Card className="card-primary">
            <CardHeader>
              <CardTitle className="text-base">Analysis Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Model:</span>
                <span>FinDocGPT v1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Analysis time:</span>
                <span>2m 34s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timestamp:</span>
                <span>Dec 9, 2024 2:45 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Document pages:</span>
                <span>15</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-primary">
            <CardHeader>
              <CardTitle className="text-base">Help & Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="ghost" className="w-full justify-start text-sm">
                Explain Model Logic
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                Report False Positive
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                Submit Feedback
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;