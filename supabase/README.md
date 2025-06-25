# Supabase Setup Instructions

## Prerequisites
- A Supabase account (free tier works fine)
- Access to your Supabase project settings

## Setup Steps

### 1. Create a New Supabase Project
If you haven't already:
1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click "New Project" and follow the setup wizard
3. Once created, go to the "Settings" section in the sidebar and select "API"
4. Copy your URL and anon/public key for the next step

### 2. Configure Environment Variables
Create or update your `.env` file at the project root with:

```
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_anon_key_here
```

### 3. Set Up Database Schema
1. In your Supabase dashboard, navigate to the "SQL Editor" section
2. Create a "New Query"
3. Copy and paste the contents of `schema.sql` into the editor
4. Run the query to create the table structure

### 4. Verify Connection
We've provided tools to verify your Supabase connection is working properly:

```bash
# Option 1: Use the shell script (recommended)
./supabase/verify.sh

# Option 2: Run the Python script directly
python supabase/verify_connection.py
```

The verification will:
- Check that your `.env` file is properly configured
- Test the connection to your Supabase instance
- Verify that the 'jobs' table exists and has the correct schema
- Test CRUD operations on the table

### 5. Seed the Database
To populate the database with data from RemoteOK:
1. Make sure you have Python 3.7+ installed
2. Install dependencies: `pip install -r requirements.txt`
3. Run the scraper: `python src/scrape.py`

### 6. Verify Data
1. In your Supabase dashboard, go to "Table Editor" 
2. Select the "jobs" table
3. You should see the scraped job data

## Troubleshooting
- If you get authentication errors, check your `.env` file values
- If you see database errors, make sure you ran the schema.sql successfully
- For any issues with the scraper, check the console output for error messages
- Use the verification script to diagnose connection issues
