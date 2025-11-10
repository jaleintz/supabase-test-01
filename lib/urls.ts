import { supabase } from './supabase'
import { Url, UrlInsert } from './types'

export async function getAllUrls(): Promise<Url[]> {
  const { data, error } = await supabase
    .from('urls')
    .select('*')
    .order('added_at', { ascending: false })

  if (error) {
    console.error('Error fetching URLs:', error)
    throw error
  }

  return data || []
}

export async function addUrl(urlData: UrlInsert): Promise<Url> {
  const { data, error } = await supabase
    .from('urls')
    .insert([urlData])
    .select()
    .single()

  if (error) {
    console.error('Error adding URL:', error)
    throw error
  }

  return data
}

export async function deleteUrl(id: string): Promise<void> {
  const { error } = await supabase
    .from('urls')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting URL:', error)
    throw error
  }
}

export async function getUrlById(id: string): Promise<Url | null> {
  const { data, error } = await supabase
    .from('urls')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching URL:', error)
    return null
  }

  return data
}
