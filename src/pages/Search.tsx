
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '@/components/search/SearchBar';
import SearchResults from '@/components/search/SearchResults';
import MainNav from '@/components/navigation/MainNav';
import Footer from '@/components/navigation/Footer';
import AuthDialog from '@/components/auth/AuthDialog';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/App';
import { Tag, Tags } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [popularTags, setPopularTags] = useState<string[]>(["Photography", "Article", "Tutorial", "Design", "Programming"]);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const { user, session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (initialQuery) {
      searchContent(initialQuery);
    } else {
      // Load recent content if no search query
      try {
        const contents = JSON.parse(localStorage.getItem('contents') || '[]');
        const sorted = contents
          .sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 6);
        setResults(sorted);
      } catch (e) {
        console.error("Error loading content", e);
      }
    }
  }, [initialQuery]);

  const searchContent = (searchQuery: string) => {
    setLoading(true);
    setQuery(searchQuery);
    
    // Update URL with search query
    setSearchParams({ q: searchQuery });
    
    try {
      const contents = JSON.parse(localStorage.getItem('contents') || '[]');
      // Simple search implementation
      const searchResults = contents.filter((content: any) => {
        const titleMatch = content.title.toLowerCase().includes(searchQuery.toLowerCase());
        const teaserMatch = content.teaser.toLowerCase().includes(searchQuery.toLowerCase());
        const contentMatch = content.content && content.content.toLowerCase().includes(searchQuery.toLowerCase());
        
        return titleMatch || teaserMatch || contentMatch;
      });
      
      setTimeout(() => {
        setResults(searchResults);
        setLoading(false);
      }, 500); // Simulate network delay
    } catch (e) {
      console.error("Error searching content", e);
      setLoading(false);
      toast({
        title: "Search Error",
        description: "Failed to search content. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleTagSearch = (tag: string) => {
    searchContent(tag);
  };

  const openAuthDialog = (tab: 'login' | 'signup') => {
    setAuthTab(tab);
    setShowAuthDialog(true);
  };

  return (
    <div className="min-h-screen flex flex-col antialiased text-gray-800 bg-[#EAEFFC]">
      <MainNav openAuthDialog={openAuthDialog} />
      
      <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Search Content</h1>
          <SearchBar onSearch={searchContent} placeholder="Search for creators, topics, or content..." />
          
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <div className="flex items-center mr-2">
              <Tags className="h-4 w-4 mr-1 text-gray-600" />
              <span className="text-sm text-gray-600">Popular:</span>
            </div>
            {popularTags.map((tag) => (
              <Badge 
                key={tag}
                variant="outline" 
                className="bg-white/20 hover:bg-white/30 cursor-pointer border-white/20 text-gray-700"
                onClick={() => handleTagSearch(tag)}
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <SearchResults 
          results={results}
          loading={loading}
          query={query}
        />
      </main>

      <Footer />
      
      <AuthDialog
        showAuthDialog={showAuthDialog}
        setShowAuthDialog={setShowAuthDialog}
        authTab={authTab}
        setAuthTab={setAuthTab}
        setIsAuthenticated={() => {}} // This is no longer needed as we're using global auth context
        setUserData={() => {}} // This is no longer needed as we're using global auth context
      />
    </div>
  );
};

export default Search;
