import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Users, Building2, TrendingUp, AlertTriangle } from 'lucide-react';

const eventDetails = {
  1: {
    date: 'December 8, 2024',
    title: 'OpenAI Releases ChatGPT-5 for Better Automation in Finances',
    category: 'AI/Technology',
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=400&fit=crop&auto=format',
    content: `
      <h2>Revolutionary AI Capabilities for Financial Services</h2>
      <p>OpenAI's latest release, ChatGPT-5, introduces groundbreaking capabilities specifically designed for financial automation. The new model demonstrates significantly improved financial reasoning abilities and faster integration with existing financial systems.</p>
      
      <h3>Key Features for Financial Institutions</h3>
      <ul>
        <li><strong>Enhanced Financial Reasoning:</strong> 40% improvement in complex financial calculations and risk assessments</li>
        <li><strong>Faster API Integration:</strong> New retrieval-augmented generation (RAG) capabilities reduce response times by 60%</li>
        <li><strong>Regulatory Compliance:</strong> Built-in understanding of financial regulations across multiple jurisdictions</li>
        <li><strong>Multi-language Support:</strong> Supports financial documents in 15+ languages with context preservation</li>
      </ul>

      <h3>Industry Impact</h3>
      <p>Early adopters report significant improvements in document processing efficiency, with some investment banks seeing 70% reduction in manual review time for complex financial documents. The model's ability to explain its reasoning makes it particularly valuable for regulatory environments.</p>

      <h3>Implementation Timeline</h3>
      <p>OpenAI plans to roll out ChatGPT-5 to enterprise customers in Q1 2025, with special pricing tiers for financial institutions. Beta testing is currently underway with select partners including major banks and asset management firms.</p>
    `,
    speakers: [
      { name: 'Sam Altman', role: 'CEO, OpenAI', company: 'OpenAI' },
      { name: 'Dr. Sarah Chen', role: 'Head of Financial AI', company: 'Goldman Sachs' },
      { name: 'Michael Torres', role: 'CTO', company: 'JPMorgan Chase' }
    ],
    attendees: '2,500+',
    impact: 'High'
  },
  2: {
    date: 'December 7, 2024',
    title: 'Global Clearinghouses Adopt Real-Time Reconciliation Protocols',
    category: 'Markets/Infrastructure',
    location: 'London, UK',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop&auto=format',
    content: `
      <h2>Revolutionary Change in Settlement Systems</h2>
      <p>Major global clearinghouses have announced the adoption of new real-time reconciliation protocols, marking the most significant change in settlement infrastructure since the introduction of T+2 settlement cycles.</p>
      
      <h3>Technical Specifications</h3>
      <ul>
        <li><strong>T+0 Settlement:</strong> Same-day settlement for major currency pairs and government bonds</li>
        <li><strong>Blockchain Integration:</strong> Distributed ledger technology for transparent, immutable records</li>
        <li><strong>Cross-Border Efficiency:</strong> Reduced settlement time from 3-5 days to under 2 hours</li>
        <li><strong>Risk Reduction:</strong> Significant decrease in counterparty risk through faster settlements</li>
      </ul>

      <h3>Participating Clearinghouses</h3>
      <p>The initiative includes LCH, Eurex Clearing, CME Clearing, and JSCC, representing over 80% of global clearing volume. The phased rollout will begin with government bonds in Q2 2025, followed by corporate bonds and derivatives.</p>

      <h3>Market Implications</h3>
      <p>This development is expected to free up an estimated $2.4 trillion in collateral globally, improving liquidity and reducing funding costs for market participants. Smaller firms will benefit from reduced capital requirements and improved cash flow management.</p>
    `,
    speakers: [
      { name: 'Emma Richardson', role: 'CEO', company: 'LCH Ltd' },
      { name: 'Klaus Weber', role: 'Head of Innovation', company: 'Eurex Clearing' },
      { name: 'David Kim', role: 'Chief Risk Officer', company: 'CME Group' }
    ],
    attendees: '1,200+',
    impact: 'Critical'
  },
  3: {
    date: 'December 6, 2024',
    title: 'Regulator Issues Guidance on AI-Driven Trading Models',
    category: 'Regulation/Compliance',
    location: 'Washington, DC',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=400&fit=crop&auto=format',
    content: `
      <h2>New Transparency Requirements for AI Trading</h2>
      <p>The Securities and Exchange Commission has released comprehensive guidance on the use of artificial intelligence in automated trading strategies, establishing new standards for model explainability and risk management.</p>
      
      <h3>Key Regulatory Requirements</h3>
      <ul>
        <li><strong>Model Documentation:</strong> Detailed documentation of AI model architecture, training data, and decision logic</li>
        <li><strong>Explainability Standards:</strong> Models must provide human-interpretable explanations for trading decisions</li>
        <li><strong>Risk Controls:</strong> Mandatory circuit breakers and position limits for AI-driven strategies</li>
        <li><strong>Audit Trail:</strong> Complete logging of model decisions and performance metrics</li>
      </ul>

      <h3>Compliance Timeline</h3>
      <p>Financial institutions have 18 months to ensure their AI trading systems meet the new requirements. The SEC will conduct examinations starting in July 2025, with potential penalties for non-compliance including trading restrictions.</p>

      <h3>Industry Response</h3>
      <p>Major trading firms are investing heavily in explainable AI technologies and model governance frameworks. Some estimate compliance costs at $10-50 million for large institutions, but view this as necessary for sustainable AI adoption in trading.</p>

      <h3>Global Coordination</h3>
      <p>The SEC is coordinating with international regulators including the FCA, ESMA, and JFSA to ensure consistent global standards for AI trading regulation.</p>
    `,
    speakers: [
      { name: 'Gary Gensler', role: 'Chairman', company: 'SEC' },
      { name: 'Dr. Jennifer Walsh', role: 'Director of Trading', company: 'FINRA' },
      { name: 'Robert Chen', role: 'Chief Compliance Officer', company: 'Citadel Securities' }
    ],
    attendees: '800+',
    impact: 'High'
  }
};

const EventDetail = () => {
  const { id } = useParams();
  const event = eventDetails[Number(id) as keyof typeof eventDetails];

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="card-primary text-center">
          <CardContent className="p-8">
            <h2 className="text-heading mb-4">Event Not Found</h2>
            <p className="text-muted-foreground mb-6">The requested event details could not be found.</p>
            <Link to="/dashboard">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{event.category}</Badge>
              <Badge variant={event.impact === 'Critical' ? 'destructive' : 'default'}>
                {event.impact} Impact
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-64 object-cover rounded-[var(--radius)] mb-6"
          />
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{event.attendees} attendees</span>
            </div>
          </div>
          <h1 className="text-hero mb-6">{event.title}</h1>
        </div>

        {/* Speakers */}
        <Card className="card-primary mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              Key Speakers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {event.speakers.map((speaker, index) => (
                <div key={index} className="text-center p-4 bg-muted/30 rounded-[var(--radius)]">
                  <h4 className="font-semibold mb-1">{speaker.name}</h4>
                  <p className="text-sm text-primary mb-1">{speaker.role}</p>
                  <p className="text-xs text-muted-foreground">{speaker.company}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Article Content */}
        <Card className="card-primary">
          <CardContent className="p-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: event.content }}
            />
          </CardContent>
        </Card>

        {/* Related Actions */}
        <div className="mt-8 flex gap-4">
          <Link to="/analysis">
            <Button className="btn-primary">
              Analyze Your Documents
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline">
              View More Events
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default EventDetail;