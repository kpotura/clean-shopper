import { useState } from 'react'
import ProductCard from '../../components/ProductCard'
import CategoryTag from '../../components/CategoryTag'

const PRODUCTS = [
  {
    id: 1,
    name: 'Pure Castile Soap',
    brand: "Dr. Bronner's",
    verdict: 'clean',
    summary: 'Made with organic, fair-trade oils and free from synthetic preservatives, detergents, or foaming agents.',
    category: 'Personal Care',
    score: 94,
  },
  {
    id: 2,
    name: 'Sensitive Skin Body Wash',
    brand: 'Dove',
    verdict: 'caution',
    summary: 'Contains some synthetic fragrance compounds and PEG-derived emulsifiers. Generally safe but worth reviewing for sensitive skin.',
    category: 'Personal Care',
    score: 58,
  },
  {
    id: 3,
    name: 'Free & Clear Dish Soap',
    brand: 'Seventh Generation',
    verdict: 'clean',
    summary: 'Plant-derived surfactants with no synthetic fragrance, dyes, or phosphates. No EWG-flagged ingredients.',
    category: 'Home Cleaning',
    score: 91,
  },
  {
    id: 4,
    name: 'Multi-Surface Disinfectant Spray',
    brand: 'Lysol',
    verdict: 'avoid',
    summary: 'Contains alkyl dimethyl benzyl ammonium chloride and synthetic fragrance. Several ingredients flagged as moderate-to-high hazard by EWG.',
    category: 'Home Cleaning',
    score: 22,
  },
  {
    id: 5,
    name: 'Tear-Free Baby Wash & Shampoo',
    brand: "Burt's Bees Baby",
    verdict: 'clean',
    summary: 'Formulated with natural ingredients and free from parabens, phthalates, and synthetic fragrance. EWG-verified.',
    category: 'Baby Care',
    score: 88,
  },
  {
    id: 6,
    name: 'Moisturizing Baby Lotion',
    brand: "Johnson's",
    verdict: 'caution',
    summary: 'Contains fragrance and some petroleum-derived ingredients. Considered low-risk but cleaner alternatives exist for newborns.',
    category: 'Baby Care',
    score: 47,
  },
]

const CATEGORIES = ['All', 'Personal Care', 'Home Cleaning', 'Baby Care']

export default function BrowsePage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [savedIds, setSavedIds] = useState(new Set())

  const handleSave = (id) => {
    setSavedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const filtered = activeCategory === 'All'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-neutral-50">
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

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              brand={product.brand}
              verdict={product.verdict}
              summary={product.summary}
              category={product.category}
              score={product.score}
              saved={savedIds.has(product.id)}
              onSave={() => handleSave(product.id)}
              onAddToCart={() => {}}
            />
          ))}
        </div>

      </div>
    </div>
  )
}
