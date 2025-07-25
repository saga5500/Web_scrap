-- Enable UUID extension (required for generating unique IDs)
create extension if not exists "uuid-ossp";

-- Create jobs table
create table if not exists jobs (
  id uuid primary key default uuid_generate_v4(),
  job_title text not null,
  company text not null,
  tags text[],
  date_posted date,
  url text unique not null,
  created_at timestamp with time zone default timezone('utc', now())
);


-- Add a comment to the table for documentation
comment on table jobs is 'Remote job listings scraped from RemoteOK';
