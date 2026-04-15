import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://edenqijtuvhesbwoqktg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkZW5xaWp0dXZoZXNid29xa3RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMTM0ODAsImV4cCI6MjA5MTc4OTQ4MH0.ut_h-K_mxMmAPLmcGfhoVTVIxNv8ZgcBT9gj00twgwY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)