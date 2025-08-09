import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ExternalLink } from 'lucide-react';

const events = [
  {
    id: 1,
    date: 'Dec 8, 2024',
    title: 'OpenAI Releases ChatGPT-5 for better automation in finances',
    summary: 'New model claims improved financial reasoning and faster retrieval integrations.',
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=300&h=150&fit=crop&auto=format',
    category: 'AI/Tech'
  },
  {
    id: 2,
    date: 'Dec 7, 2024',
    title: 'Global Clearinghouses Adopt Real-Time Reconciliation Protocols',
    summary: 'Major clearinghouses pilot a standard for T+0 reconciliations.',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=150&fit=crop&auto=format',
    category: 'Markets'
  },
  {
    id: 3,
    date: 'Dec 6, 2024',
    title: 'Regulator Issues Guidance on AI-Driven Trading Models',
    summary: 'New transparency requirements for model explainability in automated strategies.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&h=150&fit=crop&auto=format',
    category: 'Regulation'
  }
];

const EventsGrid = () => {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id} className="card-primary hover:shadow-md transition-all duration-200 group cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{event.date}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {event.category}
              </Badge>
            </div>
            <CardTitle className="text-sm leading-tight group-hover:text-accent transition-colors">
              {event.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-20 object-cover rounded-md mb-3"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/300x150/f1f5f9/64748b?text=News';
              }}
            />
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              {event.summary}
            </p>
            <Link to={`/event/${event.id}`} className="flex items-center text-xs text-accent hover:text-accent-hover">
              <ExternalLink className="h-3 w-3 mr-1" />
              Read more
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EventsGrid;