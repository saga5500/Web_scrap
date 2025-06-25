'use client';

import { memo, useMemo } from 'react';
import JobCard from './JobCard';

// Memoize the JobCard component to prevent unnecessary re-renders
const MemoizedJobCard = memo(JobCard);

function JobList({ jobs, currentPage, totalPages, onPageChange }) {
  // Memoize the job cards to prevent re-rendering when parent re-renders
  const jobCards = useMemo(() => {
    return jobs.map(job => (
      <MemoizedJobCard key={job.id} job={job} />
    ));
  }, [jobs]);

  // Memoize pagination buttons
  const paginationButtons = useMemo(() => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center space-x-2 my-6">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors"
          aria-label="Previous page"
        >
          Previous
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded transition-colors ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 hover:bg-gray-50'
            }`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
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
    <div>
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
    prevProps.totalPages === nextProps.totalPages
  );
});
