
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageSquare, Star, ThumbsUp, ThumbsDown, Download, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Feedback {
  id: string;
  name: string | null;
  email: string | null;
  rating: number | null;
  feedback_text: string;
  feedback_type: string;
  liked: boolean | null;
  created_at: string;
}

const FeedbackDashboard = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRating, setFilterRating] = useState<string>('all');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching feedback:', error);
        toast({
          title: "Error",
          description: "Failed to load feedback data.",
          variant: "destructive",
        });
        return;
      }

      setFeedback(data || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast({
        title: "Error",
        description: "Failed to load feedback data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = item.feedback_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || item.feedback_type === filterType;
    const matchesRating = filterRating === 'all' || 
                         (filterRating === 'no-rating' && !item.rating) ||
                         (item.rating && item.rating.toString() === filterRating);
    
    return matchesSearch && matchesType && matchesRating;
  });

  const exportFeedback = () => {
    const csv = [
      ['Date', 'Name', 'Email', 'Type', 'Rating', 'Liked', 'Feedback'],
      ...filteredFeedback.map(item => [
        new Date(item.created_at).toLocaleDateString(),
        item.name || '',
        item.email || '',
        item.feedback_type,
        item.rating || '',
        item.liked !== null ? (item.liked ? 'Yes' : 'No') : '',
        `"${item.feedback_text.replace(/"/g, '""')}"`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStats = () => {
    const total = feedback.length;
    const regular = feedback.filter(f => f.feedback_type === 'regular').length;
    const exit = feedback.filter(f => f.feedback_type === 'exit').length;
    const avgRating = feedback
      .filter(f => f.rating)
      .reduce((acc, f) => acc + (f.rating || 0), 0) / feedback.filter(f => f.rating).length;
    const liked = feedback.filter(f => f.liked === true).length;
    const disliked = feedback.filter(f => f.liked === false).length;

    return { total, regular, exit, avgRating: avgRating || 0, liked, disliked };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600">Loading feedback data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="mr-4 border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-700 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">Feedback Dashboard</h1>
            </div>
          </div>
          <Button onClick={exportFeedback} className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Feedback</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.regular}</div>
              <div className="text-sm text-gray-600">Regular Feedback</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.exit}</div>
              <div className="text-sm text-gray-600">Exit Feedback</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.avgRating.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.liked}</div>
              <div className="text-sm text-gray-600">Liked</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.disliked}</div>
              <div className="text-sm text-gray-600">Disliked</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search feedback or names..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="exit">Exit</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                  <SelectItem value="no-rating">No Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Feedback List */}
        <div className="space-y-4">
          {filteredFeedback.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                {feedback.length === 0 ? "No feedback submitted yet." : "No feedback matches your filters."}
              </CardContent>
            </Card>
          ) : (
            filteredFeedback.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <Badge variant={item.feedback_type === 'regular' ? 'default' : 'secondary'}>
                        {item.feedback_type}
                      </Badge>
                      {item.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{item.rating}/5</span>
                        </div>
                      )}
                      {item.liked !== null && (
                        <div className="flex items-center gap-1">
                          {item.liked ? (
                            <ThumbsUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <ThumbsDown className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()} at{' '}
                      {new Date(item.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-800 leading-relaxed">{item.feedback_text}</p>
                  </div>
                  
                  {(item.name || item.email) && (
                    <div className="flex gap-4 text-sm text-gray-600 border-t pt-3">
                      {item.name && <span><strong>Name:</strong> {item.name}</span>}
                      {item.email && <span><strong>Email:</strong> {item.email}</span>}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackDashboard;
