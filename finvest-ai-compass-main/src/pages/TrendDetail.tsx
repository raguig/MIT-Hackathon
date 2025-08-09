import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, Database, Leaf, Users, BarChart, DollarSign } from 'lucide-react';

const trendDetails = {
  1: {
    title: 'AI in Finance: Responsible Automation for Portfolio Decisions',
    category: 'Technology',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&auto=format',
    content: `
      <h2>The Rise of AI-Powered Portfolio Management</h2>
      <p>Artificial Intelligence is revolutionizing how financial institutions approach portfolio management and investment decisions. Leading firms are implementing sophisticated AI models that combine risk analytics, real-time data enrichment, and advanced trade signal aggregation to make more informed investment choices.</p>
      
      <h3>Key Benefits for Financial Institutions</h3>
      <ul>
        <li><strong>Enhanced Risk Assessment:</strong> AI models can process vast amounts of market data in real-time, identifying potential risks that human analysts might miss.</li>
        <li><strong>Improved Signal Detection:</strong> Machine learning algorithms excel at detecting subtle patterns in market movements and economic indicators.</li>
        <li><strong>Automated Rebalancing:</strong> Portfolio adjustments can be made automatically based on predefined risk parameters and market conditions.</li>
        <li><strong>Cost Reduction:</strong> Automation reduces the need for manual analysis, lowering operational costs while improving accuracy.</li>
      </ul>

      <h3>Implementation Challenges</h3>
      <p>Despite the benefits, financial institutions face several challenges when implementing AI-driven portfolio management:</p>
      <ul>
        <li>Regulatory compliance and model explainability requirements</li>
        <li>Integration with existing trading systems and risk management frameworks</li>
        <li>Data quality and real-time processing capabilities</li>
        <li>Staff training and change management</li>
      </ul>

      <h3>Future Outlook</h3>
      <p>Industry experts predict that AI will become standard in portfolio management within the next 5 years, with smaller firms adopting cloud-based AI solutions and larger institutions developing proprietary models. The focus will shift from whether to adopt AI to how to implement it responsibly and effectively.</p>
    `,
    stats: [
      { label: 'Firms Using AI', value: '67%', icon: TrendingUp },
      { label: 'Cost Reduction', value: '35%', icon: DollarSign },
      { label: 'Accuracy Improvement', value: '28%', icon: BarChart }
    ]
  },
  2: {
    title: 'Real-Time Financial Data Streams',
    category: 'Infrastructure',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&auto=format',
    content: `
      <h2>The Evolution of Financial Data Processing</h2>
      <p>The financial industry is experiencing a paradigm shift towards real-time data processing. Traditional batch processing systems are being replaced by sophisticated streaming architectures that enable firms to respond to market changes within milliseconds.</p>
      
      <h3>Technical Architecture</h3>
      <p>Modern real-time data systems typically include:</p>
      <ul>
        <li><strong>Low-Latency Message Queues:</strong> Apache Kafka and similar technologies enable sub-millisecond data transmission</li>
        <li><strong>Cloud ETL Pipelines:</strong> Automated data transformation and enrichment in real-time</li>
        <li><strong>In-Memory Databases:</strong> Redis and similar solutions for ultra-fast data retrieval</li>
        <li><strong>Event-Driven Architecture:</strong> Microservices that react instantly to market events</li>
      </ul>

      <h3>Business Impact</h3>
      <p>Financial institutions leveraging real-time data streams report significant improvements in:</p>
      <ul>
        <li>Trade execution times reduced by 70%</li>
        <li>Risk detection capabilities improved by 40%</li>
        <li>Customer experience enhanced through instant updates</li>
        <li>Regulatory reporting efficiency increased by 50%</li>
      </ul>

      <h3>Implementation Strategy</h3>
      <p>Successful implementation requires careful planning around data governance, system integration, and performance monitoring. Leading firms are adopting a phased approach, starting with critical trading systems before expanding to other business units.</p>
    `,
    stats: [
      { label: 'Latency Reduction', value: '70%', icon: Database },
      { label: 'Processing Speed', value: '<1ms', icon: TrendingUp },
      { label: 'Market Coverage', value: '24/7', icon: BarChart }
    ]
  },
  3: {
    title: 'ESG Metrics Mainstreamed in Financial Reporting',
    category: 'Sustainability',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop&auto=format',
    content: `
      <h2>ESG Integration in Financial Decision Making</h2>
      <p>Environmental, Social, and Governance (ESG) metrics have evolved from nice-to-have data points to critical factors in lending and investment decisions. Financial institutions are now required to incorporate ESG considerations into their risk assessment and portfolio management processes.</p>
      
      <h3>Regulatory Requirements</h3>
      <p>Recent regulatory changes have made ESG reporting mandatory for many financial institutions:</p>
      <ul>
        <li><strong>EU Taxonomy Regulation:</strong> Detailed classification system for sustainable economic activities</li>
        <li><strong>SFDR (Sustainable Finance Disclosure Regulation):</strong> Transparency requirements for investment products</li>
        <li><strong>TCFD (Task Force on Climate-related Financial Disclosures):</strong> Climate risk disclosure framework</li>
        <li><strong>SEC Climate Rules:</strong> Enhanced climate-related disclosures for public companies</li>
      </ul>

      <h3>Implementation in Lending</h3>
      <p>Banks are integrating ESG factors into their lending decisions through:</p>
      <ul>
        <li>Environmental risk assessments for project financing</li>
        <li>Social impact evaluation for community development loans</li>
        <li>Governance quality analysis for corporate lending</li>
        <li>Green loan products with preferential rates</li>
      </ul>

      <h3>Technology Solutions</h3>
      <p>Financial institutions are leveraging technology to manage ESG data through specialized platforms that aggregate, validate, and analyze ESG metrics from multiple sources, ensuring accuracy and compliance with reporting standards.</p>
    `,
    stats: [
      { label: 'ESG Integration', value: '89%', icon: Leaf },
      { label: 'Green Financing', value: '$2.3T', icon: DollarSign },
      { label: 'Regulatory Growth', value: '45%', icon: Users }
    ]
  }
};

const TrendDetail = () => {
  const { id } = useParams();
  const trend = trendDetails[Number(id) as keyof typeof trendDetails];

  if (!trend) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="card-primary text-center">
          <CardContent className="p-8">
            <h2 className="text-heading mb-4">Trend Not Found</h2>
            <p className="text-muted-foreground mb-6">The requested trend analysis could not be found.</p>
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
            <Badge variant="secondary">{trend.category}</Badge>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <img
            src={trend.image}
            alt={trend.title}
            className="w-full h-64 object-cover rounded-[var(--radius)] mb-6"
          />
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="outline">{trend.readTime}</Badge>
            <span className="text-sm text-muted-foreground">Financial Analysis</span>
          </div>
          <h1 className="text-hero mb-6">{trend.title}</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {trend.stats.map((stat, index) => (
            <Card key={index} className="card-primary text-center">
              <CardContent className="p-4">
                <stat.icon className="h-8 w-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Article Content */}
        <Card className="card-primary">
          <CardContent className="p-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: trend.content }}
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
              View More Trends
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default TrendDetail;