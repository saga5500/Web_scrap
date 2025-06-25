import requests
import csv
import json
from datetime import datetime
import os
import sys

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

def save_to_csv(jobs, filename="remote_jobs.csv"):
    """Save jobs to CSV file"""
    # Ensure output directory exists
    os.makedirs(os.path.dirname(filename) if os.path.dirname(filename) else '.', exist_ok=True)
    
    # Define fields to export
    fieldnames = [
        'position', 'company', 'location', 'salary', 'tags',
        'date', 'url', 'job_type', 'description'
    ]
    
    try:
        with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            
            for job in jobs:
                # Process tags if they exist
                if 'tags' in job and isinstance(job['tags'], list):
                    job['tags'] = ', '.join(job['tags'])
                
                # Ensure URL has correct format
                if 'url' in job and not job['url'].startswith('http'):
                    job['url'] = f"https://remoteok.com{job['url']}"
                
                # Write only the fields we're interested in
                row = {field: job.get(field, '') for field in fieldnames}
                writer.writerow(row)
        
        print(f"\nSaved {len(jobs)} jobs to {filename}")
        return True
    except Exception as e:
        print(f"Error saving to CSV: {e}")
        return False

def main():
    # Get jobs
    jobs = fetch_remote_jobs()
    
    # Display jobs (limited to 10 by default)
    display_jobs(jobs)
    
    # Save to CSV
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    save_to_csv(jobs, f"remote_jobs_{timestamp}.csv")

if __name__ == "__main__":
    main()
