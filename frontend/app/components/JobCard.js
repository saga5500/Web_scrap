'use client';

import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function JobCard({ job }) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    if (job.date_posted) {
      try {
        const date = parseISO(job.date_posted);
        setFormattedDate(format(date, 'MMM d, yyyy'));
      } catch (error) {
        console.error('Error formatting date:', error);
        setFormattedDate(job.date_posted);
      }
    }
  }, [job.date_posted]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <Link href={`/job/${job.id}`}>
          <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            {job.job_title}
          </h2>
        </Link>
        {formattedDate && (
          <span className="text-sm text-gray-500" suppressHydrationWarning>
            {formattedDate}
          </span>
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-700 mt-1">{job.company}</h3>
      
      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-2">
        {job.tags && job.tags.map((tag, idx) => (
          <span 
            key={`${tag}-${idx}`} 
            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      
      {/* Buttons */}
      <div className="mt-4 pt-3 border-t border-gray-200 flex gap-3">
        <Link 
          href={`/job/${job.id}`}
          className="inline-block px-4 py-2 bg-gray-100 text-gray-800 font-medium rounded-md hover:bg-gray-200 transition-colors"
        >
          View Details
        </Link>
        
        <a 
          href={job.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Apply
        </a>
      </div>
    </div>
  );
}
