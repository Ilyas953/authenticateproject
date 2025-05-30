
import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = 'https://qkxsuxdhdxpwmsnfaati.supabase.co'
export const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFreHN1eGRoZHhwd21zbmZhYXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MDQxMjUsImV4cCI6MjA2NDA4MDEyNX0.NJLSfsal-gNDw271j2ZBnmvxDBD3dUI0QsoiiTOWszY'
export const supabase = createClient(supabaseUrl, supabaseKey)