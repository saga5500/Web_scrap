import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables from .env
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Check for missing values
if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase credentials. Check your .env file.")

# Initialize client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def insert_or_update_job(job):
    try:
        # Prepare job data for DB schema
        db_job = {
            "job_title": job.get("job_title", "Unknown Title"),
            "company": job.get("company", "Unknown Company"),
            "tags": job.get("tags", []),  # Should be a list for Supabase array
            "date_posted": job.get("date_posted"),
            "url": job.get("url", "")
        }
        # Check if job exists by URL
        existing = supabase.table("jobs").select("id").eq("url", db_job["url"]).execute()
        if existing.data:
            job_db_id = existing.data[0]["id"]
            print(f"Updating existing job: {db_job['job_title']} at {db_job['company']} (ID: {job_db_id})")
            supabase.table("jobs").update(db_job).eq("id", job_db_id).execute()
            return True
        else:
            supabase.table("jobs").insert(db_job).execute()
            print(f"Inserted: {db_job['job_title']} - {db_job['company']}")
            return True
    except Exception as e:
        print(f"Error in insert_or_update_job: {e}")
        import traceback
        traceback.print_exc()
        return False
