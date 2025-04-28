
import { useState, useEffect } from 'react';

export const useContentPermissions = (content: any) => {
  const [isCreator, setIsCreator] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    if (content) {
      const auth = localStorage.getItem('auth');
      if (auth) {
        try {
          const parsedAuth = JSON.parse(auth);
          if (parsedAuth && parsedAuth.user) {
            setIsCreator(content.creatorId === parsedAuth.user.id);
            
            const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
            const hasPurchased = transactions.some(
              (tx: any) => tx.contentId === content.id && tx.userId === parsedAuth.user.id
            );
            setIsPurchased(hasPurchased);
          }
        } catch (e) {
          console.error("Auth parsing error", e);
        }
      }
    }
  }, [content]);

  return { isCreator, isPurchased };
};
