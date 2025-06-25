# Remote Job Board Frontend

This is the frontend for our Remote Job Board application. It's built with Next.js and connects to a Supabase backend.

## Features

- View all remote job listings
- Filter jobs by:
  - Search terms (job title or company)
  - Tags (e.g., "javascript", "remote", "fullstack")
  - Date posted (today, this week, this month)
- Pagination for browsing many job listings
- Individual job detail pages
- Responsive design

## Setup Instructions

### Prerequisites

- Node.js 18.0 or later
- npm or yarn
- Supabase project with a "jobs" table

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
```bash
cd frontend
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

4. Copy the environment variables:
```bash
cp .env.local.example .env.local
```

5. Update the `.env.local` file with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

You can find these values in your Supabase project dashboard under Project Settings > API.

### Running the Application

To start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

Then start the production server:

```bash
npm run start
# or
yarn start
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
