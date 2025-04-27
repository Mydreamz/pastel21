
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Edit, FileText, Trash2, Eye, ChevronDown, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface UserContentsListProps {
  userContents: any[];
  onEditContent: (contentId: string) => void;
  onDeleteContent: (contentId: string) => void;
}

const UserContentsList = ({ userContents, onEditContent, onDeleteContent }: UserContentsListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  const ITEMS_PER_PAGE = 5;
  
  // Sort the content
  const sortedContent = [...userContents].sort((a, b) => {
    if (sortField === 'price') {
      return sortDirection === 'asc' 
        ? parseFloat(a.price) - parseFloat(b.price)
        : parseFloat(b.price) - parseFloat(a.price);
    } else if (sortField === 'title') {
      return sortDirection === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else {
      // Default to date sorting
      return sortDirection === 'asc'
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });
  
  // Paginate the content
  const paginatedContent = sortedContent.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );
  
  const totalPages = Math.ceil(userContents.length / ITEMS_PER_PAGE);
  
  // Toggle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Safe delete with confirmation
  const handleDeleteClick = (contentId: string) => {
    if (confirmDelete === contentId) {
      onDeleteContent(contentId);
      setConfirmDelete(null);
      toast({
        title: "Content deleted",
        description: "Your content has been successfully removed"
      });
    } else {
      setConfirmDelete(contentId);
      // Auto-reset after 5 seconds
      setTimeout(() => setConfirmDelete(null), 5000);
    }
  };
  
  return (
    <div className="pt-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Published Content</h3>
        <Button onClick={() => navigate('/create')} className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm">
          Create New
        </Button>
      </div>
      
      {userContents.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p>You haven't created any content yet</p>
          <Button onClick={() => navigate('/create')} variant="link" className="text-emerald-500 mt-2">
            Create your first content
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-md border border-white/10 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-white/10">
                  <TableHead 
                    className="text-white cursor-pointer"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center">
                      Title
                      {sortField === 'title' && (
                        <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-white cursor-pointer"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center">
                      Price
                      {sortField === 'price' && (
                        <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-white cursor-pointer"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center">
                      Date
                      {sortField === 'created_at' && (
                        <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedContent.map((content) => (
                  <TableRow key={content.id} className="border-white/10">
                    <TableCell className="font-medium">{content.title}</TableCell>
                    <TableCell>${parseFloat(content.price).toFixed(2)}</TableCell>
                    <TableCell>{new Date(content.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          onClick={() => navigate(`/view/${content.id}`)}
                          variant="outline"
                          size="sm"
                          className="border-white/10 hover:bg-white/10"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => onEditContent(content.id)}
                          variant="outline"
                          size="sm"
                          className="border-white/10 hover:bg-white/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(content.id)}
                          variant="outline"
                          size="sm"
                          className={`border-white/10 hover:bg-white/10 ${confirmDelete === content.id ? 'bg-red-500/10 border-red-500/30' : ''}`}
                        >
                          {confirmDelete === content.id ? (
                            <span className="flex items-center space-x-1">
                              <Check className="h-4 w-4 text-green-500" onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(content.id);
                              }} />
                              <X className="h-4 w-4 text-red-500" onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDelete(null);
                              }} />
                            </span>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(curr => Math.max(curr - 1, 1))}
                    className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      isActive={currentPage === i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={currentPage === i + 1 ? 'bg-emerald-500 text-white border-emerald-500' : ''}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(curr => Math.min(curr + 1, totalPages))}
                    className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
};

export default UserContentsList;
