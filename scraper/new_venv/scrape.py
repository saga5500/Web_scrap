import requests
import json
import sys
from supabase_utils import insert_or_update_job

def fetch_remote_jobs():
    """Fetch remote jobs from the RemoteOK API"""
    url = "https://remoteok.com/api"
    headers = {
        "User-Agent": "Mozilla/5.0"
    }
    
    try:
        print("Fetching jobs from RemoteOK API...")
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise exception for HTTP errors
        
        data = response.json()
        
        # The first element is metadata; skip it
        jobs = data[1:]
        
        print(f"Found {len(jobs)} jobs")
        return jobs
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        sys.exit(1)
    except json.JSONDecodeError:
        print("Error parsing response as JSON")
        sys.exit(1)

def display_jobs(jobs, limit=10):
    """Display job information in a readable format"""
    # Display only a limited number by default
    jobs_to_display = jobs[:limit]
    
    for i, job in enumerate(jobs_to_display, 1):
        print(f"\n--- Job {i} ---")
        print(f"Title: {job.get('position')}")
        print(f"Company: {job.get('company')}")
        print(f"Location: {job.get('location')}")
        print(f"Salary: {job.get('salary', 'Not specified')}")
        
        # Handle tags better - they come as a list or string
        tags = job.get('tags', [])
        if isinstance(tags, list):
            tags_str = ", ".join(tags)
        else:
            tags_str = tags
        print(f"Tags: {tags_str}")
        
        # Additional fields
        print(f"Job Type: {job.get('job_type', 'Not specified')}")
        print(f"Description: {job.get('description', 'No description')[:100]}...")  # Truncate long descriptions
        print(f"Posted: {job.get('date')}")
        print(f"URL: https://remoteok.com{job.get('url')}")  # Ensure proper URL format
    
    if len(jobs) > limit:
        print(f"\nShowing {limit} of {len(jobs)} jobs. Run with --all to see all jobs.")

def map_job_to_db(job):
    """Map job fields to database schema for Supabase"""
    return {
        "job_title": job.get("position", "Unknown Title"),
        "company": job.get("company", "Unknown Company"),
        "tags": job.get("tags", []) if isinstance(job.get("tags", []), list) else [job.get("tags")],
        "date_posted": job.get("date", None),
        "url": f"https://remoteok.com{job.get('url')}" if job.get("url") and not job.get("url").startswith("http") else job.get("url", "")
    }

def main():
    # Get jobs
    jobs = fetch_remote_jobs()
    
    # Display jobs (limited to 10 by default)
    display_jobs(jobs)
    
    # Save to Supabase
    success_count = 0
    for job in jobs:
        db_job = map_job_to_db(job)
        if insert_or_update_job(db_job):
            success_count += 1
    print(f"\nInserted/updated {success_count} jobs in Supabase.")

if __name__ == "__main__":
    main()
