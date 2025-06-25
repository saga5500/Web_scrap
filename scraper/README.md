# RemoteOK Job Scraper

A Python script to scrape remote job listings from RemoteOK and store them in a Supabase database.

## Project Structure

```
scraper/
├── .env                 # Environment variables (Supabase credentials)
├── requirements.txt     # Python dependencies
├── src/                 # Source code
│   ├── scrape.py        # Main script to fetch and process jobs
│   └── supabase_utils.py # Utility functions for Supabase operations
└── supabase/            # Supabase-related files
    ├── README.md        # Instructions for Supabase setup
    └── schema.sql       # SQL schema for the jobs table
```

## Setup

1. **Install dependencies**:
   ```
   pip install -r requirements.txt
   ```

2. **Configure Supabase**:
   - Follow the instructions in `supabase/README.md` to set up your Supabase project
   - Update the `.env` file with your Supabase credentials

3. **Run the scraper**:
   ```
   python src/scrape.py
   ```

## Features

- Fetches latest remote job listings from RemoteOK API
- Displays job details in the console
- Stores jobs in a Supabase database
- Handles duplicate jobs (updates existing entries)

## Database Schema

The jobs are stored with the following fields:
- `id`: UUID primary key
- `job_title`: Text (required)
- `company`: Text (required)
- `tags`: Text array
- `date_posted`: Date
- `url`: Text (unique, required)
- `created_at`: Timestamp with timezone
