import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://pxrauybuimeedgzictxs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4cmF1eWJ1aW1lZWRnemljdHhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMjYyMDIsImV4cCI6MjA4MTcwMjIwMn0.X4TXZypMimmfhdF-rIU3HUXtz_AL3Ggxji_UvuxCF9g'
)
