
import StarsBackground from '@/components/StarsBackground';

interface ViewContentContainerProps {
  children: React.ReactNode;
}

const ViewContentContainer = ({ children }: ViewContentContainerProps) => {
  return (
    <div className="min-h-screen flex flex-col antialiased text-gray-800 relative">
      <StarsBackground />
      <div className="bg-grid absolute inset-0 opacity-[0.03] z-0"></div>
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 md:px-6 py-6">
        {children}
      </div>
    </div>
  );
};

export default ViewContentContainer;
