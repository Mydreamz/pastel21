
import React from 'react';
import ContentFilters from './ContentFilters';

interface DashboardSearchProps {
  onFilter: (filters: string[]) => void;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DashboardSearch = ({ onFilter, searchQuery, onSearchChange }: DashboardSearchProps) => {
  return (
    <div className="p-4 border-b border-pastel-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <ContentFilters onFilter={onFilter} />
      
      <div className="relative w-full md:w-64">
        <input 
          type="text"
          placeholder="Search content..."
          value={searchQuery}
          onChange={onSearchChange}
          className="w-full bg-white/50 border border-pastel-200/50 rounded-xl py-2 pl-8 pr-4 text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pastel-500/50 shadow-neumorphic"
        />
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
      </div>
    </div>
  );
};

export default DashboardSearch;
