import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, TrendingUp } from 'lucide-react';

const stories = [
  {
    id: 1,
    company: 'AlphaLedger',
    type: 'Mid-market Asset Manager',
    story: 'Used FinDocGPT to triage 1,200 investor reports; reduced manual review time by 78% and flagged 3 material anomalies that saved them an estimated $2.1M.',
    metrics: { saved: '$2.1M', efficiency: '78%', documents: '1,200' },
    icon: Building2,
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=300&h=200&fit=crop&auto=format'
  },
  {
    id: 2,
    company: 'GreenBank SME Lending',
    type: 'Community Bank',
    story: 'FinDocGPT suggested updates to loan covenant wording; improved risk scoring and prevented one bad loan default.',
    metrics: { prevented: '1 default', improved: 'Risk scoring', updated: 'Covenants' },
    icon: Users,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop&auto=format'
  },
  {
    id: 3,
    company: 'Horizon Wealth',
    type: 'Wealth Management',
    story: 'Integrated FinDocGPT into their advisor workflow to produce explainable summaries for clients — client satisfaction rose 12 points.',
    metrics: { satisfaction: '+12 pts', integration: 'Advisor workflow', summaries: 'Explainable' },
    icon: TrendingUp,
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&h=200&fit=crop&auto=format'
  }
];

const SuccessStories = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {stories.map((story) => (
        <Link key={story.id} to={`/story/${story.id}`}>
          <Card className="card-primary hover:shadow-md transition-all duration-200 group cursor-pointer">
            <div className="relative">
              <img
                src={story.image}
                alt={story.company}
                className="w-full h-40 object-cover rounded-t-[var(--radius)]"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/300x200/f1f5f9/64748b?text=Success+Story';
                }}
              />
              <div className="absolute top-4 left-4">
                <div className="bg-card/90 backdrop-blur-sm rounded-full p-2">
                  <story.icon className="h-4 w-4 text-accent" />
                </div>
              </div>
            </div>
            
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-lg group-hover:text-primary transition-colors">{story.company}</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {story.type}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {story.story}
              </p>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                {Object.entries(story.metrics).map(([key, value]) => (
                  <div key={key} className="p-2 bg-muted/30 rounded-md">
                    <div className="text-sm font-semibold text-accent">
                      {value}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {key}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-xs text-accent group-hover:text-accent-hover font-medium">
                Read full story →
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default SuccessStories;