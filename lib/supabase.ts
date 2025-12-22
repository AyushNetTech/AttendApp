import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://gtqvqokrodnqklbiaiwv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0cXZxb2tyb2RucWtsYmlhaXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjk0NTQsImV4cCI6MjA4MTk0NTQ1NH0.SEdfe5aBZsg70ZdNUuBOvCa_52zYTbAkf1lDQnqPygI'
)
