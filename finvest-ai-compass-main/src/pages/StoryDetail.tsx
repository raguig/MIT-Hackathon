import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, Users, TrendingUp, DollarSign, Clock, Award } from 'lucide-react';

const storyDetails = {
  1: {
    company: 'AlphaLedger',
    type: 'Mid-market Asset Manager',
    location: 'New York, NY',
    employees: '450+',
    aum: '$12.5B',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop&auto=format',
    challenge: 'Managing overwhelming volumes of investor reports and regulatory filings while maintaining accuracy and compliance.',
    solution: 'Implemented FinDocGPT to automate document triage and anomaly detection across all investor communications.',
    results: {
      timeSaved: '78%',
      moneySaved: '$2.1M',
      documentsProcessed: '1,200+',
      anomaliesDetected: '3 material'
    },
    content: `
      <h2>The Challenge</h2>
      <p>AlphaLedger was drowning in paperwork. As a growing mid-market asset manager with $12.5B in assets under management, they received hundreds of investor reports monthly. Their compliance team of 12 analysts was struggling to keep up with the volume while maintaining the thoroughness required for regulatory compliance.</p>
      
      <h3>Manual Process Limitations</h3>
      <ul>
        <li>Each report took 45-60 minutes to review manually</li>
        <li>Inconsistent review quality due to analyst fatigue</li>
        <li>Risk of missing critical anomalies in dense financial documents</li>
        <li>Delayed response times to investors and regulators</li>
      </ul>

      <h2>The FinDocGPT Solution</h2>
      <p>AlphaLedger implemented FinDocGPT as their primary document analysis tool, integrating it directly into their existing workflow management system.</p>

      <h3>Implementation Process</h3>
      <ul>
        <li><strong>Phase 1:</strong> Pilot program with 100 historical documents to establish accuracy benchmarks</li>
        <li><strong>Phase 2:</strong> Integration with existing document management system</li>
        <li><strong>Phase 3:</strong> Full deployment with real-time processing capabilities</li>
        <li><strong>Phase 4:</strong> Custom training on AlphaLedger's specific compliance requirements</li>
      </ul>

      <h2>Remarkable Results</h2>
      <p>Within six months of implementation, AlphaLedger achieved transformational improvements across all key metrics.</p>

      <h3>The $2.1M Save</h3>
      <p>FinDocGPT identified three material anomalies that human reviewers had missed:</p>
      <ul>
        <li>A $800K accounting discrepancy in a quarterly report</li>
        <li>Inconsistent revenue recognition practices worth $900K in potential penalties</li>
        <li>A counterparty risk exposure of $400K that exceeded policy limits</li>
      </ul>

      <h3>Operational Excellence</h3>
      <p>Beyond financial savings, AlphaLedger reported improved team morale, faster investor response times, and enhanced regulatory standing. The compliance team now focuses on strategic analysis rather than routine document review.</p>
    `,
    testimonial: "FinDocGPT transformed our compliance operations. What used to take our team weeks now happens in hours, and we catch issues we never would have found manually. It's been a game-changer for our business.",
    contactPerson: 'Jennifer Martinez, Chief Compliance Officer'
  },
  2: {
    company: 'GreenBank SME Lending',
    type: 'Community Bank',
    location: 'Portland, OR',
    employees: '125',
    loans: '$450M',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop&auto=format',
    challenge: 'Improving loan covenant accuracy and risk assessment for small business lending.',
    solution: 'Used FinDocGPT to analyze loan documents and suggest covenant improvements.',
    results: {
      defaultPrevention: '1 major',
      riskImprovement: '25%',
      covenantUpdates: '300+',
      accuracy: '94%'
    },
    content: `
      <h2>Community Banking Innovation</h2>
      <p>GreenBank, a community bank specializing in small business lending, faced the challenge of competing with larger institutions while maintaining personalized service and prudent risk management.</p>
      
      <h3>The Challenge</h3>
      <ul>
        <li>Limited resources for comprehensive loan document review</li>
        <li>Outdated loan covenant templates</li>
        <li>Difficulty assessing risk for diverse small business models</li>
        <li>Pressure to maintain competitive loan approval times</li>
      </ul>

      <h2>FinDocGPT Implementation</h2>
      <p>GreenBank partnered with FinDocGPT to enhance their loan review process and modernize their covenant structures.</p>

      <h3>Covenant Optimization</h3>
      <p>FinDocGPT analyzed GreenBank's historical loan performance data and suggested specific improvements to loan covenants:</p>
      <ul>
        <li>Updated debt-to-equity ratio thresholds based on industry benchmarks</li>
        <li>Added cash flow coverage requirements tailored to seasonal businesses</li>
        <li>Implemented early warning indicators for financial distress</li>
        <li>Customized covenants for different business sectors (retail, manufacturing, services)</li>
      </ul>

      <h2>Preventing a Major Default</h2>
      <p>Six months after implementation, FinDocGPT's analysis of a $2.3M loan application revealed concerning patterns in the borrower's financial statements that traditional analysis had missed.</p>

      <h3>Red Flags Identified</h3>
      <ul>
        <li>Unusual timing of large receivables that didn't match seasonal patterns</li>
        <li>Inventory levels inconsistent with reported sales growth</li>
        <li>Cash flow projections that didn't account for known industry headwinds</li>
      </ul>

      <p>Further investigation revealed that the borrower was overstating revenue by 30%. The loan was declined, preventing what would have been GreenBank's largest default in five years.</p>

      <h2>Ongoing Benefits</h2>
      <p>GreenBank continues to use FinDocGPT for all commercial loans over $100K, resulting in improved portfolio performance and enhanced reputation in the community.</p>
    `,
    testimonial: "FinDocGPT helps us compete with the big banks while maintaining our community focus. It's like having a senior credit analyst on every deal.",
    contactPerson: 'Mark Stevens, Chief Lending Officer'
  },
  3: {
    company: 'Horizon Wealth Management',
    type: 'Wealth Management Firm',
    location: 'Chicago, IL',
    employees: '280',
    aum: '$8.2B',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=400&fit=crop&auto=format',
    challenge: 'Creating clear, explainable investment summaries for high-net-worth clients.',
    solution: 'Integrated FinDocGPT into advisor workflow to generate client-friendly document summaries.',
    results: {
      satisfaction: '+12 points',
      meetingEfficiency: '40%',
      clientRetention: '96%',
      advisorProductivity: '30%'
    },
    content: `
      <h2>Transforming Client Communication</h2>
      <p>Horizon Wealth Management serves over 1,200 high-net-worth families with complex investment needs. Their challenge was making sophisticated financial documents accessible to clients while maintaining professional standards.</p>
      
      <h3>The Communication Gap</h3>
      <ul>
        <li>Dense investment reports difficult for clients to understand</li>
        <li>Advisors spending too much time explaining basic concepts</li>
        <li>Client meetings focused on document explanation rather than strategy</li>
        <li>Inconsistent communication quality across different advisors</li>
      </ul>

      <h2>FinDocGPT Integration</h2>
      <p>Horizon integrated FinDocGPT directly into their client relationship management system, allowing advisors to generate clear, personalized summaries of complex financial documents.</p>

      <h3>Workflow Enhancement</h3>
      <ul>
        <li><strong>Automated Summaries:</strong> 2-page executive summaries for 50+ page investment reports</li>
        <li><strong>Risk Explanations:</strong> Plain-English explanations of portfolio risks and opportunities</li>
        <li><strong>Performance Attribution:</strong> Clear breakdown of what drove portfolio performance</li>
        <li><strong>Action Items:</strong> Specific recommendations tailored to each client's goals</li>
      </ul>

      <h2>Client Satisfaction Improvement</h2>
      <p>The results were immediate and measurable. Client satisfaction scores increased from 82 to 94 points within six months.</p>

      <h3>Key Improvements</h3>
      <ul>
        <li>Clients report better understanding of their investments</li>
        <li>More productive meetings focused on strategy rather than explanation</li>
        <li>Increased trust due to transparent communication</li>
        <li>Higher engagement with financial planning recommendations</li>
      </ul>

      <h2>Advisor Productivity</h2>
      <p>Advisors now spend 40% less time on document preparation and 30% more time on strategic planning with clients. This has led to better investment outcomes and stronger client relationships.</p>

      <h3>Business Impact</h3>
      <p>The improved client experience has resulted in 96% client retention rate (up from 89%) and a 25% increase in referrals from existing clients.</p>
    `,
    testimonial: "Our clients love the clear, concise summaries. We can now spend our time on what matters most - helping them achieve their financial goals.",
    contactPerson: 'Lisa Rodriguez, Senior Vice President'
  }
};

const StoryDetail = () => {
  const { id } = useParams();
  const story = storyDetails[Number(id) as keyof typeof storyDetails];

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="card-primary text-center">
          <CardContent className="p-8">
            <h2 className="text-heading mb-4">Story Not Found</h2>
            <p className="text-muted-foreground mb-6">The requested success story could not be found.</p>
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
            <Badge variant="secondary">{story.type}</Badge>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <img
            src={story.image}
            alt={story.company}
            className="w-full h-64 object-cover rounded-[var(--radius)] mb-6"
          />
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{story.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{story.employees} employees</span>
            </div>
            {(story as any).aum && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{(story as any).aum} AUM</span>
              </div>
            )}
            {(story as any).loans && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{(story as any).loans} in loans</span>
              </div>
            )}
          </div>
          <h1 className="text-hero mb-2">{story.company}</h1>
          <p className="text-xl text-muted-foreground">{story.challenge}</p>
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {Object.entries(story.results).map(([key, value], index) => (
            <Card key={index} className="card-primary text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary mb-1">{value}</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Story Content */}
        <Card className="card-primary mb-8">
          <CardContent className="p-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: story.content }}
            />
          </CardContent>
        </Card>

        {/* Testimonial */}
        <Card className="card-elevated mb-8">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <Award className="h-12 w-12 text-accent mx-auto mb-4" />
              <blockquote className="text-xl italic text-primary mb-4">
                "{story.testimonial}"
              </blockquote>
              <cite className="text-muted-foreground">
                — {story.contactPerson}
              </cite>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-subheading mb-4">Ready to Transform Your Operations?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join {story.company} and hundreds of other financial institutions using FinDocGPT to streamline their document analysis and improve decision-making.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/analysis">
              <Button size="lg" className="btn-primary">
                Try FinDocGPT Now
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg">
                View More Stories
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StoryDetail;