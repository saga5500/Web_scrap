#!/usr/bin/env python3
"""
Supabase Connection Verification Tool

This script verifies that:
1. Your .env file contains valid Supabase credentials
2. The connection to Supabase can be established
3. The 'jobs' table exists and has the correct schema
4. Basic CRUD operations work as expected
"""

import os
import sys
import json
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client, Client

# Add parent directory to path so we can import from src
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

def print_status(message, success=None):
    """Print a formatted status message"""
    if success is None:
        print(f"[*] {message}")
    elif success:
        print(f"[✓] {message}")
    else:
        print(f"[✗] {message}")

def verify_env():
    """Verify that environment variables are set"""
    print_status("Checking environment variables...")
    
    # Load environment variables
    load_dotenv()
    
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    
    if not url:
        print_status("SUPABASE_URL is missing in .env file", False)
        return False
    
    if not key:
        print_status("SUPABASE_KEY is missing in .env file", False)
        return False
    
    # Basic URL validation
    if not url.startswith("https://"):
        print_status(f"SUPABASE_URL doesn't look valid: {url}", False)
        return False
    
    print_status("Environment variables found", True)
    return True

def verify_connection():
    """Verify that we can connect to Supabase"""
    print_status("Testing Supabase connection...")
    
    try:
        # Create client
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_KEY")
        supabase = create_client(url, key)
        
        # Simple query to test connection
        response = supabase.table('jobs').select('*', count='exact').limit(1).execute()
        
        # If we get here, connection was successful
        print_status("Successfully connected to Supabase", True)
        return supabase
    except Exception as e:
        print_status(f"Failed to connect to Supabase: {str(e)}", False)
        return None

def verify_table_schema(supabase):
    """Verify that the jobs table exists and has the expected schema"""
    print_status("Verifying 'jobs' table schema...")
    
    try:
        # Run a raw SQL query to get table information
        result = supabase.table("jobs").select("*").limit(0).execute()
        
        # Check if table exists by seeing if the query succeeded
        if hasattr(result, 'data') and isinstance(result.data, list):
            print_status("'jobs' table exists", True)
            return True
        else:
            print_status("'jobs' table query returned unexpected result", False)
            return False
    except Exception as e:
        print_status(f"Error verifying 'jobs' table: {str(e)}", False)
        return False

def test_crud_operations(supabase):
    """Test Create, Read, Update, Delete operations on the jobs table"""
    print_status("Testing CRUD operations on 'jobs' table...")
    
    test_job = {
        "job_title": "Test Job (Verification Script)",
        "company": "Test Company",
        "tags": ["test", "verification"],
        "date_posted": datetime.now().strftime("%Y-%m-%d"),
        "url": f"https://test-verification-{datetime.now().strftime('%Y%m%d%H%M%S')}.com"
    }
    
    # CREATE
    try:
        insert_result = supabase.table("jobs").insert(test_job).execute()
        if not insert_result.data or len(insert_result.data) == 0:
            print_status("Failed to insert test job", False)
            return False
        
        job_id = insert_result.data[0].get('id')
        print_status(f"Successfully inserted test job with ID: {job_id}", True)
        
        # READ
        read_result = supabase.table("jobs").select("*").eq("id", job_id).execute()
        if not read_result.data or len(read_result.data) == 0:
            print_status("Failed to read test job after insertion", False)
            return False
        
        print_status("Successfully read test job", True)
        
        # UPDATE
        updated_job = {
            "job_title": "Updated Test Job"
        }
        update_result = supabase.table("jobs").update(updated_job).eq("id", job_id).execute()
        if not update_result.data or len(update_result.data) == 0:
            print_status("Failed to update test job", False)
            return False
        
        print_status("Successfully updated test job", True)
        
        # DELETE (clean up after ourselves)
        delete_result = supabase.table("jobs").delete().eq("id", job_id).execute()
        if not delete_result.data or len(delete_result.data) == 0:
            print_status("Failed to delete test job", False)
            return False
        
        print_status("Successfully deleted test job", True)
        return True
    except Exception as e:
        print_status(f"Error during CRUD operations: {str(e)}", False)
        return False

def main():
    """Main verification function"""
    print("\n=== Supabase Connection Verification ===\n")
    
    # Step 1: Verify environment variables
    if not verify_env():
        print("\n❌ Verification failed: Environment variables are not properly set")
        print("Please check your .env file and ensure it contains SUPABASE_URL and SUPABASE_KEY")
        return False
    
    # Step 2: Verify connection
    supabase = verify_connection()
    if not supabase:
        print("\n❌ Verification failed: Could not connect to Supabase")
        print("Please check your credentials and ensure your Supabase project is running")
        return False
    
    # Step 3: Verify table schema
    if not verify_table_schema(supabase):
        print("\n❌ Verification failed: Issues with 'jobs' table")
        print("Please ensure you have created the 'jobs' table using the schema.sql file")
        return False
    
    # Step 4: Test CRUD operations
    if not test_crud_operations(supabase):
        print("\n❌ Verification failed: CRUD operations not working properly")
        print("Please check the Supabase logs for more information")
        return False
    
    # All checks passed
    print("\n✅ Verification successful! Your Supabase connection is working properly.")
    print("You can now run the scraper to collect and store job data.")
    return True

if __name__ == "__main__":
    main()
