import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Search, RefreshCw, FileText, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Content {
  id: string;
  title: string;
  content_type: string;
  price: string;
  views: number;
  creator_name: string;
  status: string;
  created_at: string;
}

const ContentManagement = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [filteredContents, setFilteredContents] = useState<Content[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchContents();
  }, []);

  useEffect(() => {
    const filtered = contents.filter(content =>
      content.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.creator_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.content_type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContents(filtered);
  }, [contents, searchTerm]);

  const fetchContents = async () => {
    try {
      setIsLoading(true);
      
      const adminToken = localStorage.getItem('admin-auth');
      const { data, error } = await supabase.functions.invoke('admin-dashboard-data', {
        body: { action: 'get-contents' },
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      setContents(data.data || []);
    } catch (error) {
      console.error('Error fetching contents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contents",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getContentTypeBadge = (type: string) => {
    const typeConfig = {
      'text': { variant: 'default' as const, label: 'Text' },
      'link': { variant: 'secondary' as const, label: 'Link' },
      'media': { variant: 'outline' as const, label: 'Media' }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.text;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'published': { variant: 'default' as const, label: 'Published' },
      'draft': { variant: 'secondary' as const, label: 'Draft' },
      'scheduled': { variant: 'outline' as const, label: 'Scheduled' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.published;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Content Management
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchContents}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content by title, creator, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background border-border"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full"></div>
          </div>
        ) : filteredContents.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-muted-foreground">Title</TableHead>
                  <TableHead className="text-muted-foreground">Creator</TableHead>
                  <TableHead className="text-muted-foreground">Type</TableHead>
                  <TableHead className="text-muted-foreground">Price</TableHead>
                  <TableHead className="text-muted-foreground">Views</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContents.map((content) => (
                  <TableRow key={content.id}>
                    <TableCell className="text-foreground max-w-xs">
                      <div className="truncate" title={content.title}>
                        {content.title}
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {content.creator_name || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {getContentTypeBadge(content.content_type)}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {content.price === '0' ? 'Free' : `₹${content.price}`}
                    </TableCell>
                    <TableCell className="text-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        {content.views || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(content.status)}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {formatDate(content.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'No content found matching your search' : 'No content found'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentManagement;