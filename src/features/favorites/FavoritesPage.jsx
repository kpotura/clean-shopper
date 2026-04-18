import { useState, useEffect } from 'react'
import ProductCard from '../../components/ProductCard'
import CategoryTag from '../../components/CategoryTag'
import SortControl from '../../components/SortControl'
import EmptyState from '../../components/EmptyState'
import Button from '../../components/Button'
import { fetchSavedProducts, unsaveProduct } from '../../lib/api/saved-products'

const SORT_OPTIONS = [
  { value: 'date_desc', label: 'Date Saved' },
  { value: 'name_asc',  label: 'Name A–Z' },
  { value: 'verdict',   label: 'Verdict' },
]

const VERDICT_ORDER = { clean: 0, caution: 1, avoid: 2 }

const PLACEHOLDER_PRODUCTS = [
  {
    id: 'ph-1',
    name: 'Truly Pure Foaming Face Wash',
    brand: 'Beautycounter',
    verdict: 'clean',
    description: 'Gentle foaming cleanser with certified-clean ingredients; free from parabens, SLS, and synthetic fragrance.',
    category: 'Personal Care',
    score: 94,
    savedAt: new Date().toISOString(),
  },
  {
    id: 'ph-2',
    name: 'Free & Clear Laundry Detergent',
    brand: 'Seventh Generation',
    verdict: 'clean',
    description: 'Hypoallergenic laundry detergent with no optical brighteners, fragrances, or dyes. USDA Certified Biobased.',
    category: 'Home Cleaning',
    score: 91,
    savedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'ph-3',
    name: 'Method All-Purpose Cleaner',
    brand: 'Method',
    verdict: 'caution',
    description: 'Mostly clean ingredients; one fragrance component flagged for mild irritation risk.',
    category: 'Home Cleaning',
    score: 74,
    savedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'ph-4',
    name: 'Mineral Sunscreen SPF 30',
    brand: 'Badger',
    verdict: 'clean',
    description: 'Zinc oxide-based broad-spectrum SPF made with organic ingredients; reef-safe and EWG verified.',
    category: 'Personal Care',
    score: 96,
    savedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 'ph-5',
    name: "Burt's Bees Baby Lotion",
    brand: "Burt's Bees",
    verdict: 'clean',
    description: 'Mineral oil-free, no parabens or phthalates. Gentle on sensitive skin; dermatologist tested.',
    category: 'Baby Care',
    score: 88,
    savedAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: 'ph-6',
    name: 'Tide Original Detergent',
    brand: 'Procter & Gamble',
    verdict: 'avoid',
    description: 'Contains optical brighteners and synthetic fragrance blends flagged by EWG for health concerns.',
    category: 'Home Cleaning',
    score: 28,
    savedAt: new Date(Date.now() - 432000000).toISOString(),
  },
]

function sortProducts(products, sortKey) {
  const copy = [...products]
  if (sortKey === 'name_asc') return copy.sort((a, b) => a.name.localeCompare(b.name))
  if (sortKey === 'verdict') {
    return copy.sort((a, b) => (VERDICT_ORDER[a.verdict] ?? 3) - (VERDICT_ORDER[b.verdict] ?? 3))
  }
  return copy // date_desc: already ordered from API / placeholder
}

export default function FavoritesPage({ onNavigate }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [sort, setSort] = useState('date_desc')
  const [shareStatus, setShareStatus] = useState(null) // null | 'copied' | 'shared'
  const [isPlaceholder, setIsPlaceholder] = useState(false)

  useEffect(() => {
    fetchSavedProducts()
      .then((data) => {
        if (data.length === 0) {
          setProducts(PLACEHOLDER_PRODUCTS)
          setIsPlaceholder(true)
        } else {
          setProducts(data)
          setIsPlaceholder(false)
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleUnsave = async (id) => {
    if (isPlaceholder) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
      return
    }
    setProducts((prev) => prev.filter((p) => p.id !== id))
    try {
      await unsaveProduct(id)
    } catch (err) {
      console.error('Unsave failed:', err.message)
      fetchSavedProducts().then(setProducts)
    }
  }

  const handleShare = async () => {
    const list = products
      .map((p) => `• ${p.name} by ${p.brand} (${p.verdict})`)
      .join('\n')
    const shareText = `My Clean Shopper Favorites:\n\n${list}`

    try {
      if (navigator.share) {
        await navigator.share({ title: 'My Clean Shopper Favorites', text: shareText })
        setShareStatus('shared')
      } else {
        await navigator.clipboard.writeText(shareText)
        setShareStatus('copied')
      }
    } catch {
      // cancelled or blocked — no-op
    }
    setTimeout(() => setShareStatus(null), 2500)
  }

  // Derived state
  const uniqueCategories = [...new Set(products.map((p) => p.category).filter(Boolean))]
  const showCategoryFilter = uniqueCategories.length >= 2
  const categories = ['All', ...uniqueCategories]

  const filtered = activeCategory === 'All'
    ? products
    : products.filter((p) => p.category === activeCategory)

  const sorted = sortProducts(filtered, sort)

  const shareLabel = shareStatus === 'copied'
    ? 'Copied to clipboard!'
    : shareStatus === 'shared'
    ? 'Shared!'
    : '↑ Share list'

  return (
    <div className="min-h-screen bg-surface-subtle">
      <div className="max-w-[1200px] mx-auto px-xl py-2xl">

        {/* Page header */}
        <div className="flex items-start justify-between gap-md mb-xl">
          <div className="flex flex-col gap-sm">
            <h1 className="text-h2 text-neutral-900">Favorites</h1>
            {!loading && (
              <p className="text-body text-neutral-600">
                {products.length === 0
                  ? 'No saved products yet.'
                  : `${sorted.length} saved product${sorted.length === 1 ? '' : 's'}`
                }
                {isPlaceholder && (
                  <span className="ml-sm text-small text-neutral-400">(sample data)</span>
                )}
              </p>
            )}
          </div>
          {!loading && products.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleShare}>
              {shareLabel}
            </Button>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="text-body text-error mb-lg">Failed to load favorites: {error}</p>
        )}

        {/* Controls: category filter + sort */}
        {!loading && products.length > 0 && (
          <div className="flex items-center justify-between gap-md flex-wrap mb-lg">
            {showCategoryFilter ? (
              <div className="flex items-center gap-sm flex-wrap">
                {categories.map((cat) => (
                  <CategoryTag
                    key={cat}
                    label={cat}
                    selected={activeCategory === cat}
                    onClick={() => setActiveCategory(cat)}
                  />
                ))}
              </div>
            ) : (
              <div />
            )}
            <SortControl options={SORT_OPTIONS} value={sort} onChange={setSort} />
          </div>
        )}

        {/* Global empty state */}
        {!loading && products.length === 0 && !error && (
          <EmptyState
            headline="No saved products yet"
            description="Browse products and tap Save to build your favorites list."
            actionLabel="Browse products"
            onAction={() => onNavigate('browse')}
          />
        )}

        {/* Filtered empty state */}
        {!loading && products.length > 0 && sorted.length === 0 && (
          <EmptyState
            headline={`No ${activeCategory} products saved`}
            actionLabel="Clear filter"
            onAction={() => setActiveCategory('All')}
          />
        )}

        {/* Product grid */}
        {(loading || sorted.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <ProductCard key={i} loading />
                ))
              : sorted.map((product) => (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    brand={product.brand}
                    verdict={product.verdict}
                    summary={product.description}
                    category={product.category}
                    score={product.score}
                    saved={true}
                    onSave={() => handleUnsave(product.id)}
                  />
                ))
            }
          </div>
        )}

        {/* Share button at bottom of long lists */}
        {!loading && products.length >= 3 && (
          <div className="flex justify-center mt-2xl">
            <Button variant="ghost" size="sm" onClick={handleShare}>
              {shareLabel}
            </Button>
          </div>
        )}

      </div>
    </div>
  )
}
