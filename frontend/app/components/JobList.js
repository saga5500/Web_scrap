'use client';

import { memo, useMemo } from 'react';
import JobCard from './JobCard';

// Memoize the JobCard component to prevent unnecessary re-renders
const MemoizedJobCard = memo(JobCard);

function JobList({ jobs, currentPage, totalPages, totalJobs, onPageChange }) {
  // Memoize the job cards to prevent re-rendering when parent re-renders
  const jobCards = useMemo(() => {
    return jobs.map(job => (
      <MemoizedJobCard key={job.id} job={job} />
    ));
  }, [jobs]);

  // Generate pagination range with fixed number of pages
  const getPaginationRange = (current, total) => {
    const range = [];
    const maxPages = 6; // Show max 6 page numbers
    
    if (total <= maxPages) {
      // If total pages are less than max, show all
      for (let i = 1; i <= total; i++) {
        range.push(i);
      }
    } else {
      // Always include first page
      range.push(1);
      
      // Calculate start and end pages
      let startPage = Math.max(2, current - 1);
      let endPage = Math.min(total - 1, startPage + 3);
      
      // Adjust if we're at the end
      if (endPage === total - 1) {
        startPage = Math.max(2, endPage - 3);
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        range.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        range.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < total - 1) {
        range.push('...');
      }
      
      // Always include last page
      range.push(total);
    }
    
    return range;
  };

  // Memoize pagination buttons
  const paginationButtons = useMemo(() => {
    if (totalPages <= 1) return null;

    const pages = getPaginationRange(currentPage, totalPages);
    const prevDisabled = currentPage === 1;
    const nextDisabled = currentPage === totalPages;
    
    return (
      <nav className="flex items-center justify-center space-x-1 mt-8">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={prevDisabled}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            prevDisabled 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
          <span className="sr-only">Previous</span>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div className="flex -space-x-px">
          {pages.map((page, index) => 
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`min-w-[2.5rem] px-3 py-2 text-sm font-medium ${
                  currentPage === page
                    ? 'bg-blue-50 text-blue-600 border-blue-500 border-t-2'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )
          )}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={nextDisabled}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            nextDisabled 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
          <span className="sr-only">Next</span>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </nav>
    );
  }, [currentPage, totalPages, onPageChange]);

  if (jobs.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <h3 className="text-xl font-medium text-gray-700">No jobs found</h3>
        <p className="mt-2 text-gray-500">Try adjusting your filters or search terms</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6 mb-8">
        {jobCards}
      </div>
      {paginationButtons}
    </div>
  );
}

export default memo(JobList, (prevProps, nextProps) => {
  // Only re-render if these props change
  return (
    prevProps.jobs === nextProps.jobs &&
    prevProps.currentPage === nextProps.currentPage &&
    prevProps.totalPages === nextProps.totalPages &&
    prevProps.totalJobs === nextProps.totalJobs &&
    prevProps.onPageChange === nextProps.onPageChange
  );
});
