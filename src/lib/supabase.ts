import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Post = {
  id: string
  title: string
  content: string
  author: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export type Comment = {
  id: string
  post_id: string
  author: string
  content: string
  created_at: string
  updated_at: string
}