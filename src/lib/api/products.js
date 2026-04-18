import { supabase } from '../supabase'

export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true })

  if (error) throw error
  return data
}

export async function searchProducts(query) {
  const term = query.trim()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${term}%,brand.ilike.%${term}%,description.ilike.%${term}%`)
    .order('name', { ascending: true })

  if (error) throw error
  return data
}
