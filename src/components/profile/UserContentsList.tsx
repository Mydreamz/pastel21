
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit, FileText, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserContentsListProps {
  userContents: any[];
  onEditContent: (contentId: string) => void;
  onDeleteContent: (contentId: string) => void;
}

const UserContentsList = ({ userContents, onEditContent, onDeleteContent }: UserContentsListProps) => {
  const navigate = useNavigate();
  
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
          {userContents.map((content) => (
            <div key={content.id} className="p-4 bg-white/5 border border-white/10 rounded-lg flex justify-between items-center">
              <div>
                <h4 className="font-medium">{content.title}</h4>
                <p className="text-sm text-gray-400">${parseFloat(content.price).toFixed(2)} • Created {new Date(content.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => onEditContent(content.id)} variant="outline" size="sm" className="border-white/10 hover:bg-white/10">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button onClick={() => onDeleteContent(content.id)} variant="outline" size="sm" className="border-white/10 hover:bg-white/10 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserContentsList;
