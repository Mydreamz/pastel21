
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';
import StarsBackground from '@/components/StarsBackground';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ContentCard from '@/components/dashboard/ContentCard';

const Search = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { session } = useAuth();
  const isAuthenticated = !!session;
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const initialSearchQuery = searchParams.get('query') || '';
    setSearchQuery(initialSearchQuery);

    if (initialSearchQuery) {
      performSearch(initialSearchQuery);
    }
  }, [searchParams]);

  const performSearch = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('contents')
        .select('*')
        .ilike('title', `%${query}%`);

      if (error) {
        console.error('Search error:', error);
        return;
      }

      setSearchResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
    navigate(`/search?query=${searchQuery}`);
  };

  return (
    <div className="min-h-screen flex flex-col antialiased text-gray-800 relative overflow-hidden">
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.02] z-0"></div>

      <main className="relative z-10 flex-1 w-full max-w-screen-xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="text-gray-700 hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Search</h1>
        </div>

        <Card className="glass-card border-white/10 text-gray-800 mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Search for content..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="flex-1"
              />
              <Button type="submit">
                <SearchIcon className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {searchResults.length > 0 && (
          <section className="py-6">
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          </section>
        )}

        {searchQuery && searchResults.length === 0 && (
          <Card className="glass-card border-white/10 text-gray-800">
            <CardContent className="p-6 text-center">
              <p>No results found for "{searchQuery}"</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Search;
