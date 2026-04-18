import { supabase } from '../supabase'

export async function fetchSavedProductIds() {
  const { data, error } = await supabase
    .from('saved_products')
    .select('product_id')

  if (error) throw error
  return new Set(data.map((r) => Number(r.product_id)))
}

export async function saveProduct(productId) {
  const { error } = await supabase
    .from('saved_products')
    .insert({ product_id: productId })

  if (error) throw error
}

export async function unsaveProduct(productId) {
  const { error } = await supabase
    .from('saved_products')
    .delete()
    .eq('product_id', productId)

  if (error) throw error
}
