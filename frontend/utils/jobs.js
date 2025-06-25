import { subDays } from 'date-fns';
import { supabase } from './supabase';

// Fetch all jobs from Supabase with pagination
export async function fetchJobs({ page = 1, pageSize = 10, filters = {} }) {
  try {
    const { searchTerm, selectedTags, dateFilter } = filters;
    
    // Start building the query
    let query = supabase
      .from('jobs')
      .select('*', { count: 'exact' });
    
    // Apply search filter
    if (searchTerm) {
      query = query.or(`job_title.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%`);
    }
    
    // Apply tag filters
    if (selectedTags && selectedTags.length > 0) {
      // For each selected tag, check if it's in the tags array
      selectedTags.forEach(tag => {
        query = query.contains('tags', [tag]);
      });
    }
    
    // Apply date filter
    if (dateFilter) {
      const today = new Date();
      let dateLimit;
      
      switch (dateFilter) {
        case 'today':
          dateLimit = today.toISOString().split('T')[0];
          query = query.gte('date_posted', dateLimit);
          break;
        case 'week':
          dateLimit = subDays(today, 7).toISOString().split('T')[0];
          query = query.gte('date_posted', dateLimit);
          break;
        case 'month':
          dateLimit = subDays(today, 30).toISOString().split('T')[0];
          query = query.gte('date_posted', dateLimit);
          break;
      }
    }
    
    // Add sorting and pagination
    const startRange = (page - 1) * pageSize;
    const endRange = startRange + pageSize - 1;
    
    const { data, error, count } = await query
      .order('date_posted', { ascending: false })
      .range(startRange, endRange);
    
    if (error) throw error;
    
    return { 
      jobs: data || [], 
      count: count || 0,
      totalPages: count ? Math.ceil(count / pageSize) : 0
    };
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return { jobs: [], count: 0, totalPages: 0 };
  }
}

// Fetch a single job by ID
export async function fetchJobById(id) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching job with ID ${id}:`, error);
    return null;
  }
}

// Get all unique tags from jobs
export async function fetchAllTags() {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('tags');
    
    if (error) throw error;
    
    const tagsSet = new Set();
    
    data.forEach(job => {
      if (job.tags && Array.isArray(job.tags)) {
        job.tags.forEach(tag => tagsSet.add(tag));
      }
    });
    
    return Array.from(tagsSet).sort();
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

// Filter jobs based on search term, tags, and date
export function filterJobs(jobs, filters) {
  const { searchTerm, selectedTags, dateFilter } = filters;
  
  return jobs.filter(job => {
    // Search term filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      (job.job_title && job.job_title.toLowerCase().includes(searchLower)) ||
      (job.company && job.company.toLowerCase().includes(searchLower));
    
    // Tags filter
    const matchesTags = selectedTags.length === 0 || 
      (job.tags && selectedTags.every(tag => job.tags.includes(tag)));
    
    // Date filter
    let matchesDate = true;
    if (dateFilter && job.date_posted) {
      const jobDate = new Date(job.date_posted);
      const today = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = jobDate >= today.setHours(0, 0, 0, 0);
          break;
        case 'week':
          matchesDate = jobDate >= subDays(today, 7);
          break;
        case 'month':
          matchesDate = jobDate >= subDays(today, 30);
          break;
        default:
          matchesDate = true;
      }
    }
    
    return matchesSearch && matchesTags && matchesDate;
  });
}
