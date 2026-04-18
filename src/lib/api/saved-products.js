import { supabase } from '../supabase'

export async function fetchSavedProducts() {
  const { data: savedRows, error: savedError } = await supabase
    .from('saved_products')
    .select('product_id, created_at')
    .order('created_at', { ascending: false })

  if (savedError) throw savedError
  if (!savedRows.length) return []

  const ids = savedRows.map((r) => r.product_id)
  const savedAtMap = Object.fromEntries(savedRows.map((r) => [r.product_id, r.created_at]))

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .in('id', ids)

  if (productsError) throw productsError

  return savedRows
    .map(({ product_id }) => {
      const product = products.find((p) => String(p.id) === String(product_id))
      return product ? { ...product, savedAt: savedAtMap[product_id] } : null
    })
    .filter(Boolean)
}

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
