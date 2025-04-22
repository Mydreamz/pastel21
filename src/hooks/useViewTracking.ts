
export const useViewTracking = () => {
  const trackView = (contentId: string) => {
    const views = JSON.parse(localStorage.getItem('contentViews') || '[]');
    views.push({
      contentId,
      timestamp: Date.now()
    });
    localStorage.setItem('contentViews', JSON.stringify(views));
  };

  return { trackView };
};
