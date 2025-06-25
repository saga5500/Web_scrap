'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import JobFilters from './components/JobFilters';
import JobListContainer from './components/JobListContainer';
import { fetchAllTags } from '../utils/jobs';

export default function Home() {
  const [allTags, setAllTags] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: '',
    selectedTags: [],
    dateFilter: ''
  });
  const [jobCount, setJobCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch tags on component mount
  useEffect(() => {
    async function getTags() {
      try {
        const tags = await fetchAllTags();
        setAllTags(tags);
      } catch (err) {
        console.error('Error fetching tags:', err);
      } finally {
        setLoading(false);
      }
    }
    
    getTags();
  }, []);  

  // Memoize the filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => ({
    ...filters,
    // Add any other filter properties here
  }), [filters.searchTerm, JSON.stringify(filters.selectedTags), filters.dateFilter]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prevFilters => {
      // Prevent unnecessary updates if filters haven't actually changed
      if (
        prevFilters.searchTerm === newFilters.searchTerm &&
        JSON.stringify(prevFilters.selectedTags) === JSON.stringify(newFilters.selectedTags) &&
        prevFilters.dateFilter === newFilters.dateFilter
      ) {
        return prevFilters;
      }
      return newFilters;
    });
  }, []);

  // Update job count when it changes
  const handleJobCountChange = useCallback((count) => {
    setJobCount(count);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Remote Job Listings</h1>
        <p className="text-gray-600 mt-2">
          Find the latest remote jobs from around the web
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar with filters */}
        <div className="lg:col-span-1">
          <JobFilters 
            onFilterChange={handleFilterChange} 
            allTags={allTags} 
          />
          
          <div className="bg-white p-4 rounded-lg shadow mt-4">
            <h3 className="font-medium text-gray-800 mb-2">Job Stats</h3>
            <p className="text-gray-600">Total Jobs: {jobCount}</p>
          </div>
        </div>
        
        {/* Main content with job list */}
        <div className="lg:col-span-3">
          <JobListContainer 
            initialFilters={memoizedFilters}
            onJobCountChange={handleJobCountChange}
          />
        </div>
      </div>
    </div>
  );
}
