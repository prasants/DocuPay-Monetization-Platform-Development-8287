import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://fgrdepmuwrasrkmlwwee.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZncmRlcG11d3Jhc3JrbWx3d2VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNzg1MDcsImV4cCI6MjA2Njg1NDUwN30.B8AE3SJMt7KZyS61ZNpWbdkrq54YNtN-Cn6_rLOL6Dw'

if(SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

export default supabase