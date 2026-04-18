import { useState, useEffect } from 'react'
import SearchBar from '../../components/SearchBar'
import ProductCard from '../../components/ProductCard'
import EmptyState from '../../components/EmptyState'
import { searchProducts } from '../../lib/api/products'
import { fetchSavedProductIds, saveProduct, unsaveProduct } from '../../lib/api/saved-products'

function MagnifyingGlassIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-12 w-12"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
    </svg>
  )
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastQuery, setLastQuery] = useState('')
  const [savedIds, setSavedIds] = useState(new Set())

  useEffect(() => {
    fetchSavedProductIds()
      .then(setSavedIds)
      .catch((err) => console.error('fetchSavedProductIds failed:', err.message))
  }, [])

  const handleSearch = async () => {
    const term = query.trim()
    if (!term) return

    setLoading(true)
    setError(null)
    setLastQuery(term)

    try {
      const data = await searchProducts(term)
      setResults(data)
    } catch (err) {
      setError(err.message)
      setResults(null)
    } finally {
      setLoading(false)
    }
  }

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

  const hasSearched = results !== null
  const hasResults = hasSearched && results.length > 0

  return (
    <div className="min-h-screen bg-surface-subtle">
      <div className="max-w-[1200px] mx-auto px-xl py-2xl">

        {/* Page header */}
        <div className="flex flex-col gap-sm mb-xl">
          <h1 className="text-h2 text-neutral-900">Search Products</h1>
          <p className="text-body text-neutral-600">
            Search by product name, brand, or keyword to find clean alternatives.
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-xl">
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={handleSearch}
            placeholder={'Try "dish soap", "Seventh Generation", or "sulfate-free"…'}
            loading={loading}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-body text-error mb-lg">Something went wrong: {error}</p>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCard key={i} loading />
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && hasResults && (
          <>
            <p className="text-small text-neutral-600 mb-lg">
              {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{lastQuery}&rdquo;
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
              {results.map((product) => (
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
              ))}
            </div>
          </>
        )}

        {/* No results */}
        {!loading && hasSearched && !hasResults && !error && (
          <EmptyState
            icon={<MagnifyingGlassIcon />}
            headline={`No results for "${lastQuery}"`}
            description="Try a different keyword, check the spelling, or search by brand name."
          />
        )}

        {/* Idle — before first search */}
        {!loading && !hasSearched && !error && (
          <EmptyState
            icon={<MagnifyingGlassIcon />}
            headline="What are you looking for?"
            description={'Search by product name, brand, or ingredient keyword — like "dish soap", "baby lotion", or "fragrance-free".'}
          />
        )}

      </div>
    </div>
  )
}
