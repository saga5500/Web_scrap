'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { format } from 'date-fns';
import { fetchJobById } from '../../../utils/jobs';
import Link from 'next/link';

export default function JobDetailPage() {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    async function loadJob() {
      try {
        setLoading(true);
        const jobData = await fetchJobById(id);
        if (!jobData) {
          setError('Job not found');
        } else {
          setJob(jobData);
        }
      } catch (err) {
        console.error('Error loading job:', err);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadJob();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-xl">Loading job details...</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-3xl mx-auto my-8 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error || 'Job not found'}</p>
        </div>
        <div className="mt-4">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to all jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-8 px-4">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to all jobs
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-gray-900">{job.job_title}</h1>
            {job.date_posted && (
              <span className="text-sm text-gray-500">
                Posted: {format(new Date(job.date_posted), 'MMMM d, yyyy')}
              </span>
            )}
          </div>
          
          <h2 className="text-xl font-semibold text-gray-700 mt-2">{job.company}</h2>
          
          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {job.tags && job.tags.map(tag => (
              <span 
                key={tag} 
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          
          {/* Job Details */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold">Job Details</h3>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium">{job.company}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Posted Date</p>
                <p className="font-medium">
                  {job.date_posted ? format(new Date(job.date_posted), 'MMMM d, yyyy') : 'Not specified'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Apply button */}
          <div className="mt-8">
            <a 
              href={job.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply for this job
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
