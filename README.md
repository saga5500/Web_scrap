# Remote Job Board

This is a full-stack Remote Job Board application with web scraping capabilities. It consists of a Next.js frontend and a Python scraper that populates a Supabase database with job listings.

## Features

### Frontend Features
- View all remote job listings
- Filter jobs by:
  - Search terms (job title or company)
  - Tags (e.g., "javascript", "remote", "fullstack")
  - Date posted (today, this week, this month)
- Pagination for browsing many job listings
- Individual job detail pages
- Responsive design

### Scraper Features
- Automated job scraping from various job boards
- Supabase database integration
- Virtual environment management
- Data validation and cleaning

## Quick Start Guide

### Prerequisites

- Node.js 18.0 or later
- Python 3.8 or later
- npm or yarn
- Supabase project with a "jobs" table

## 1. Clone the Repository

```bash
git clone git@github.com:saga5500/Web_scrap.git
cd Web_scrap
```

## 2. Activate Python Virtual Environment

The virtual environment is located in `scraper/new_venv`.

### 🔹 On Linux/macOS:

```bash
source scraper/new_venv/bin/activate
```

### 🔹 On Windows:

```bash
.\scraper\new_venv\Scripts\activate
```

## 3. Install Dependencies

Run this from the root folder:

### Using `python`:

```bash
pip install -r scraper/new_venv/requirements.txt
```

### Or if `python3` is required:

```bash
python3 -m pip install -r scraper/new_venv/requirements.txt
```

## 4. Verify Supabase Connection (Optional)

Run this from the root folder:

### Using `python`:

```bash
python supabase/verify_connection.py
```

### Or:

```bash
python3 supabase/verify_connection.py
```

## 5. Run the Scraper

Run this from the root folder:

```bash
python scraper/new_venv/scrape.py
```

*Or if `python3` is required:*

```bash
python3 scraper/new_venv/scrape.py
```

## 🖥️ Start the Frontend (Next.js)

### Navigate to the `frontend` folder:

```bash
cd frontend
```

### Install Node.js Dependencies:

```bash
npm install
```

### Set up Environment Variables:

```bash
cp .env.local.example .env.local
```

Update the `.env.local` file with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

You can find these values in your Supabase project dashboard under Project Settings > API.

### Start the Development Server:

```bash
npm run dev
```

The app should now be running at [http://localhost:3000](http://localhost:3000)

### Building for Production

To create a production build:

```bash
npm run build
```

Then start the production server:

```bash
npm run start
```

## 📦 Project Structure Overview

```bash
Web_scrapping/
├── scraper/
│   ├── scrape.py              # Main scraper
│   ├── supabase_utils.py      # Supabase helpers
│   └── new_venv/              # Python virtual environment
├── supabase/
│   ├── schema.sql             # Database schema
│   └── verify_connection.py   # Verify Supabase connection
├── frontend/                  # Next.js frontend
│   ├── app/
│   │   ├── page.jsx           # Homepage with job listings
│   │   ├── job/[id]/page.js   # Individual job detail page
│   │   └── components/        # React components
│   │       ├── JobCard.js
│   │       ├── JobList.js
│   │       └── JobFilters.js
│   └── utils/                 # Utility functions
│       ├── jobs.js            # Job fetching functions
│       └── supabase.js        # Supabase client
└── README.md
```

## Project Structure

- `app/` - Next.js application using the App Router
  - `page.js` - Homepage with job listings and filters
  - `job/[id]/page.js` - Individual job detail page
  - `components/` - Reusable React components
    - `JobCard.js` - Individual job listing card
    - `JobList.js` - List of job cards with pagination
    - `JobFilters.js` - Search and filter controls
- `utils/` - Utility functions
  - `jobs.js` - Functions for fetching and filtering jobs
  - `supabase.js` - Supabase client configuration

## Connecting to the Backend

This frontend connects to a Supabase backend that contains job listings. Ensure that:

1. Your Supabase database has a `jobs` table with the schema described in the backend documentation
2. You have the correct Supabase URL and anon key in your `.env.local` file
3. If you want to scrape and update job data, run the scraper from the backend directory

## Technologies Used

- Next.js 15
- React 19
- Supabase (PostgreSQL & JS client)
- Tailwind CSS for styling
- date-fns for date formatting