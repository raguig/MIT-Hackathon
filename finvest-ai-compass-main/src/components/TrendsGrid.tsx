import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Database, Leaf } from 'lucide-react';

const trends = [
  {
    id: 1,
    title: 'AI in finance: Responsible automation for portfolio decisions',
    summary: 'AI models helping risk analytics, data enrichment, and trade signal aggregation.',
    icon: TrendingUp,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&auto=format'
  },
  {
    id: 2,
    title: 'Real-time financial data streams',
    summary: 'Low-latency feeds and cloud ETL let firms respond to market shifts faster.',
    icon: Database,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop&auto=format'
  },
  {
    id: 3,
    title: 'ESG metrics mainstreamed in reporting',
    summary: 'Green metrics increasingly required for lending and investment decisions.',
    icon: Leaf,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop&auto=format'
  }
];

const TrendsGrid = () => {
  return (
    <div className="space-y-6">
      {trends.map((trend) => (
        <Card key={trend.id} className="card-primary hover:shadow-md transition-all duration-200">
          <div className="flex">
            <div className="w-1/3">
              <img
                src={trend.image}
                alt={trend.title}
                className="w-full h-32 object-cover rounded-l-[var(--radius)]"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x200/f1f5f9/64748b?text=Financial+Trends';
                }}
              />
            </div>
            <div className="flex-1 p-4">
              <CardHeader className="p-0 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <trend.icon className="h-4 w-4 text-accent" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Trend</span>
                </div>
                <CardTitle className="text-base leading-tight">{trend.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-sm text-muted-foreground">{trend.summary}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="w-16 h-1 bg-accent/20 rounded-full">
                    <div className="w-3/4 h-full bg-accent rounded-full"></div>
                  </div>
                  <Link to={`/trend/${trend.id}`}>
                    <button className="text-xs text-accent hover:text-accent-hover font-medium">
                      Read more →
                    </button>
                  </Link>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TrendsGrid;