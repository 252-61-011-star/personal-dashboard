import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const localUrl = localStorage.getItem('hermes_sb_url');
  const localKey = localStorage.getItem('hermes_sb_key');

  const url = localUrl || envUrl || '';
  const key = localKey || envKey || '';

  return { url, key, isConfigured: Boolean(url && key) };
};

export const initSupabase = (url?: string, key?: string): SupabaseClient | null => {
  const config = getSupabaseConfig();
  const targetUrl = url || config.url;
  const targetKey = key || config.key;

  if (!targetUrl || !targetKey) {
    supabaseClient = null;
    return null;
  }

  try {
    supabaseClient = createClient(targetUrl, targetKey);
    return supabaseClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    supabaseClient = null;
    return null;
  }
};

export const getSupabase = (): SupabaseClient | null => {
  if (!supabaseClient) {
    supabaseClient = initSupabase();
  }
  return supabaseClient;
};

export const SUPABASE_SETUP_SQL = `-- Run this in your Supabase SQL Editor to enable cloud sync:

create table if not exists public.user_dashboard (
  id text primary key,
  user_name text not null default 'Nh Anik',
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.user_dashboard enable row level security;

-- Create policy to allow all actions for anonymous client key (or authenticated users)
create policy "Allow all actions for dashboard owner"
on public.user_dashboard
for all
using (true)
with check (true);
`;
