import { useState, useEffect } from 'react'
import ProductCard from '../../components/ProductCard'
import CategoryTag from '../../components/CategoryTag'
import { fetchProducts } from '../../lib/api/products'
import { fetchSavedProductIds, saveProduct, unsaveProduct } from '../../lib/api/saved-products'

const CATEGORIES = ['All', 'Personal Care', 'Home Cleaning', 'Baby Care', 'Kitchen']

export default function BrowsePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [savedIds, setSavedIds] = useState(new Set())

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))

    fetchSavedProductIds()
      .then(setSavedIds)
      .catch((err) => console.error('fetchSavedProductIds failed:', err.message))
  }, [])

  const handleSave = async (id) => {
    const isSaved = savedIds.has(id)
    // Optimistic update
    setSavedIds((prev) => {
      const next = new Set(prev)
      isSaved ? next.delete(id) : next.add(id)
      return next
    })
    try {
      isSaved ? await unsaveProduct(id) : await saveProduct(id)
    } catch (err) {
      console.error('Save failed:', err.message)
    }
  }

  const filtered = activeCategory === 'All'
    ? products
    : products.filter((p) => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-surface-subtle">
      <div className="max-w-[1200px] mx-auto px-xl py-2xl">

        {/* Page header */}
        <div className="flex flex-col gap-sm mb-xl">
          <h1 className="text-h2 text-neutral-900">Browse Products</h1>
          <p className="text-body text-neutral-600">
            AI-assessed products ranked by ingredient safety. Save the ones you want to keep.
          </p>
        </div>

        {/* Category filter row */}
        <div className="flex items-center gap-sm flex-wrap mb-lg">
          {CATEGORIES.map((cat) => (
            <CategoryTag
              key={cat}
              label={cat}
              selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </div>

        {/* Error state */}
        {error && (
          <p className="text-body text-error">Failed to load products: {error}</p>
        )}

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <ProductCard key={i} loading />
              ))
            : filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  brand={product.brand}
                  verdict={product.verdict}
                  summary={product.description}
                  category={product.category}
                  score={product.score}
                  saved={savedIds.has(product.id)}
                  onSave={() => handleSave(product.id)}
                  onAddToCart={() => {}}
                />
              ))
          }
        </div>

      </div>
    </div>
  )
}
