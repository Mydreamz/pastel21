
import React from 'react';

const EditContentLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center text-gray-800">
      <div className="animate-spin h-8 w-8 border-t-2 border-pastel-500 border-r-2 rounded-full mr-3"></div>
      Loading content...
    </div>
  );
};

export default EditContentLoader;
