import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock } from 'lucide-react';

const recentAnalyses = [
  {
    id: 1,
    fileName: 'Q3_Financial_Report.pdf',
    risk: 'Low',
    timestamp: '2 hours ago',
    riskColor: 'risk-low'
  },
  {
    id: 2,
    fileName: 'Investment_Proposal_v2.docx',
    risk: 'Medium',
    timestamp: '1 day ago',
    riskColor: 'risk-medium'
  },
  {
    id: 3,
    fileName: 'Loan_Application_Details.pdf',
    risk: 'High',
    timestamp: '3 days ago',
    riskColor: 'risk-high'
  },
  {
    id: 4,
    fileName: 'Annual_Budget_Plan.xlsx',
    risk: 'Low',
    timestamp: '1 week ago',
    riskColor: 'risk-low'
  },
  {
    id: 5,
    fileName: 'Merger_Agreement_Draft.pdf',
    risk: 'Medium',
    timestamp: '2 weeks ago',
    riskColor: 'risk-medium'
  }
];

const RecentActivity = () => {
  return (
    <Card className="card-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4 text-accent" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentAnalyses.map((analysis) => (
          <div
            key={analysis.id}
            className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">
                  {analysis.fileName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {analysis.timestamp}
                </p>
              </div>
            </div>
            <Badge 
              variant="secondary" 
              className={`${analysis.riskColor} text-xs flex-shrink-0 ml-2`}
            >
              {analysis.risk}
            </Badge>
          </div>
        ))}
        <div className="pt-2">
          <button className="text-sm text-accent hover:text-accent-hover font-medium">
            View all analyses →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;