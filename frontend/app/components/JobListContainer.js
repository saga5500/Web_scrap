'use client';

import { useState, useEffect, useCallback } from 'react';
import JobList from './JobList';
import { fetchJobs } from '../../utils/jobs';

export default function JobListContainer({ initialFilters = {}, onJobCountChange }) {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalJobs: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  // Fetch jobs whenever page or filters change
  const fetchJobData = useCallback(async (page, filters) => {
    try {
      setLoading(true);
      
      const { jobs: jobsData, count, totalPages } = await fetchJobs({
        page,
        pageSize: 10,
        filters
      });

      setJobs(jobsData);
      setPagination(prev => ({
        ...prev,
        totalPages,
        totalJobs: count
      }));
      
      // Update parent component with the latest job count
      if (onJobCountChange) {
        onJobCountChange(count);
      }
    } catch (err) {
      setError('Failed to load jobs. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and when filters change
  useEffect(() => {
    fetchJobData(1, filters);
  }, [filters, fetchJobData]);

  // Handle page changes
  const handlePageChange = useCallback((newPage) => {
    fetchJobData(newPage, filters);
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
  }, [filters, fetchJobData]);

  // Update filters from parent
  useEffect(() => {
    setFilters(initialFilters);
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  }, [initialFilters]);

  if (loading && jobs.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-pulse text-xl">Loading jobs...</div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        <p>{error}</p>
      </div>
    );
  }


  return (
    <JobList 
      jobs={jobs}
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      totalJobs={pagination.totalJobs}
      onPageChange={handlePageChange}
    />
  );
}
