import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Username = () => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate username validation
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('username', username);
      toast({
        title: "Profile completed!",
        description: `Welcome to FinDocGPT, ${username}!`,
      });
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-display font-bold bg-gradient-primary bg-clip-text text-transparent">
            FinDocGPT
          </h1>
          <p className="text-muted-foreground mt-2">
            Almost there! Choose your username
          </p>
        </div>

        <Card className="card-floating">
          <CardHeader>
            <CardTitle>Choose Your Username</CardTitle>
            <CardDescription>
              This will be how you're identified in FinDocGPT
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  maxLength={20}
                  pattern="^[a-zA-Z0-9_]+$"
                  title="Username can only contain letters, numbers, and underscores"
                />
                <div className="text-xs text-muted-foreground">
                  {username && username.length >= 3 ? (
                    <span className="text-success">✓ Username available</span>
                  ) : (
                    'Username must be at least 3 characters long'
                  )}
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full btn-primary"
                disabled={isLoading || username.length < 3}
              >
                {isLoading ? 'Setting up...' : 'Continue'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Username;