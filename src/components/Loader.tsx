import React from 'react';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-7 h-7 border-4 border-t-4 border-white rounded-full animate-spin border-t-violet-600"></div>
    </div>
  );
};

export default Loader;
