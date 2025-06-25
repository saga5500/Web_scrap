'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export default function JobFilters({ onFilterChange, allTags = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [showTagMenu, setShowTagMenu] = useState(false);
  
  // Debounce search term changes
  const searchTimeoutRef = useRef(null);
  
  // Handle search input changes with debouncing
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set a new timeout to update filters after 300ms of no typing
    searchTimeoutRef.current = setTimeout(() => {
      updateFilters({ searchTerm: value });
    }, 300);
  };
  
  // Update filters only when values have actually changed
  const updateFilters = useCallback((changes) => {
    const newFilters = {
      searchTerm,
      selectedTags,
      dateFilter,
      ...changes
    };
    
    onFilterChange(newFilters);
  }, [searchTerm, selectedTags, dateFilter, onFilterChange]);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);
  
  // Toggle tag selection
  const toggleTag = (tag) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    updateFilters({ selectedTags: newTags });
  };
  
  // Handle date filter change
  const handleDateChange = (e) => {
    const value = e.target.value;
    setDateFilter(value);
    updateFilters({ dateFilter: value });
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setDateFilter('');
    updateFilters({
      searchTerm: '',
      selectedTags: [],
      dateFilter: ''
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-lg font-medium text-gray-800 mb-3">Filters</h2>
      
      {/* Search input */}
      <div className="mb-4">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <input
          type="text"
          id="search"
          name="search"
          placeholder="Job title or company"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          aria-label="Search jobs"
        />
      </div>
      
      {/* Date filter */}
      <div className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Date Posted
        </label>
        <select
          id="date"
          name="date"
          value={dateFilter}
          onChange={handleDateChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          aria-label="Filter by date posted"
        >
          <option value="">Any time</option>
          <option value="today">Today</option>
          <option value="week">This week</option>
          <option value="month">This month</option>
        </select>
      </div>
      
      {/* Tags filter */}
      <div className="mb-4">
        <label htmlFor="tag-menu-button" className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <div className="relative">
          <button
            id="tag-menu-button"
            type="button"
            onClick={() => setShowTagMenu(!showTagMenu)}
            className="w-full px-3 py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center"
            aria-expanded={showTagMenu}
            aria-controls="tag-menu"
            aria-label="Select tags"
          >
            <span>
              {selectedTags.length > 0 
                ? `${selectedTags.length} selected` 
                : 'Select tags'}
            </span>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform ${showTagMenu ? 'transform rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showTagMenu && (
            <div 
              id="tag-menu"
              className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              {allTags.length > 0 ? (
                <div className="p-2">
                  {allTags.map(tag => (
                    <div key={tag} className="flex items-center py-1">
                      <input
                        type="checkbox"
                        id={`tag-${tag}`}
                        name={`tag-${tag}`}
                        checked={selectedTags.includes(tag)}
                        onChange={() => toggleTag(tag)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label 
                        htmlFor={`tag-${tag}`}
                        className="ml-2 text-sm text-gray-700 cursor-pointer"
                      >
                        {tag}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-2 text-sm text-gray-500">No tags available</div>
              )}
            </div>
          )}
        </div>
        
        {/* Selected tags display */}
        {selectedTags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <span 
                key={tag} 
                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Clear filters button */}
      <button
        type="button"
        onClick={clearFilters}
        className="w-full px-4 py-2 bg-gray-100 text-gray-800 font-medium rounded-md hover:bg-gray-200 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );
}
