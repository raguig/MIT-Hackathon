import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, TrendingUp, Calendar, Award } from 'lucide-react';
import TrendsGrid from '@/components/TrendsGrid';
import EventsGrid from '@/components/EventsGrid';
import SuccessStories from '@/components/SuccessStories';
import RecentActivity from '@/components/RecentActivity';
import logoImage from '@/assets/findocgpt-logo.png';

const Dashboard = () => {
  const username = localStorage.getItem('username') || 'User';

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-3">
                <img src={logoImage} alt="FinDocGPT" className="h-8" />
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  FinDocGPT
                </h1>
              </div>
              <div className="hidden sm:block h-6 w-px bg-border" />
              <span className="hidden sm:inline text-sm text-muted-foreground">
                v1.0 • Secure
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground">Welcome back,</span>
              <span className="font-medium">{username}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-10 animate-fade-in">
          <h2 className="text-heading mb-4">
            Welcome to FinDocGPT, {username}!
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Hi {username}, glad you're here. Upload documents, get fast, explainable feedback 
            on whether they're safe to act on — powered by advanced sentiment analysis and anomaly detection.
          </p>
        </div>

        {/* Three Column Layout */}
        <div className="grid lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-3 space-y-6 animate-slide-up">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-accent" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to="/analysis">
                  <Button className="w-full btn-primary">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                </Link>
                <Link to="/analysis">
                  <Button variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Start New Analysis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <RecentActivity />
          </div>

          {/* Middle Column - Financial Trends */}
          <div className="lg:col-span-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="mb-6">
              <h3 className="text-subheading mb-2 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Latest Financial Trends
              </h3>
            </div>
            <TrendsGrid />
          </div>

          {/* Right Column - Financial Events */}
          <div className="lg:col-span-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="mb-6">
              <h3 className="text-subheading mb-2 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                Latest Events
              </h3>
            </div>
            <EventsGrid />
          </div>
        </div>

        {/* Success Stories */}
        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="mb-6">
            <h3 className="text-subheading mb-2 flex items-center gap-2">
              <Award className="h-5 w-5 text-accent" />
              Success Stories
            </h3>
          </div>
          <SuccessStories />
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                Secure SSL
              </Badge>
              <span className="text-sm text-muted-foreground">
                AI Model: FinDocGPT v1.0
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-accent">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-accent">
                Audit Log
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;