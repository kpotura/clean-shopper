import SafetyBadge from './SafetyBadge'

export default function ProductCard({
  name,
  brand,
  verdict,
  summary,
  imageUrl,
  category,
  score,
  saved = false,
  loading = false,
  onSave,
  onAddToCart,
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-lg flex flex-col gap-md">
        <div className="w-full aspect-square bg-neutral-100 rounded-md animate-pulse" />
        <div className="flex items-start justify-between gap-sm">
          <div className="flex flex-col gap-xs flex-1">
            <div className="h-4 bg-neutral-100 rounded-md animate-pulse w-3/4" />
            <div className="h-3 bg-neutral-100 rounded-md animate-pulse w-1/2" />
          </div>
          <div className="h-6 w-20 bg-neutral-100 rounded-full animate-pulse" />
        </div>
        <div className="h-8 bg-neutral-100 rounded-full animate-pulse w-24" />
        <div className="flex flex-col gap-xs">
          <div className="h-3 bg-neutral-100 rounded-md animate-pulse w-full" />
          <div className="h-3 bg-neutral-100 rounded-md animate-pulse w-5/6" />
        </div>
        <div className="flex items-center gap-sm mt-auto">
          <div className="h-9 w-20 bg-neutral-100 rounded-md animate-pulse" />
          <div className="h-9 w-28 bg-neutral-100 rounded-md animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-lg flex flex-col gap-md hover:shadow-md transition-shadow">

      {/* Product image */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={name}
          className="w-full aspect-square object-cover rounded-md bg-neutral-100"
        />
      )}

      {/* Header row — name, brand, score */}
      <div className="flex items-start justify-between gap-sm">
        <div className="flex flex-col gap-xs">
          <h4 className="text-h4 text-neutral-900">{name}</h4>
          <p className="text-small text-neutral-600">{brand}</p>
        </div>
        {score !== undefined && (
          <span className="text-h4 text-neutral-900 font-semibold shrink-0">{score}</span>
        )}
      </div>

      {/* Safety badge + optional category */}
      <div className="flex items-center gap-sm">
        <SafetyBadge verdict={verdict} size="sm" />
        {category && (
          <span className="text-micro text-neutral-600">{category}</span>
        )}
      </div>

      {/* AI summary */}
      <p className="text-body text-neutral-600">{summary}</p>

      {/* Actions */}
      {(onSave || onAddToCart) && (
        <div className="flex items-center gap-sm mt-auto">
          {onSave && (
            <button
              onClick={onSave}
              className="px-md py-sm rounded-md text-body font-semibold transition-colors bg-secondary text-primary border border-primary hover:bg-secondary-dark"
            >
              {saved ? 'Saved ✓' : 'Save'}
            </button>
          )}
          {onAddToCart && (
            <button
              onClick={onAddToCart}
              className="px-md py-sm rounded-md text-body font-semibold transition-colors bg-primary text-neutral-50 hover:bg-primary-light active:bg-primary-dark"
            >
              Add to Cart
            </button>
          )}
        </div>
      )}

    </div>
  )
}
