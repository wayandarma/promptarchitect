import React from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <div className="group relative flex items-center">
      {children}
      <div className="absolute bottom-full mb-2 hidden w-48 flex-col items-center group-hover:flex left-1/2 -translate-x-1/2 z-50">
        <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-normal bg-dark-700 shadow-lg rounded-md border border-dark-600">
          {text}
        </span>
        <div className="w-3 h-3 -mt-2 rotate-45 bg-dark-700 border-r border-b border-dark-600"></div>
      </div>
    </div>
  );
};