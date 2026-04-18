function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search products…',
  loading = false,
  disabled = false,
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSubmit()
  }

  return (
    <div
      className={[
        'flex items-center gap-sm bg-surface border rounded-full px-md py-sm shadow-sm transition-all',
        'focus-within:ring-2 focus-within:ring-primary-dark focus-within:border-primary-dark',
        disabled ? 'bg-neutral-100 border-neutral-200' : 'border-neutral-200',
      ].join(' ')}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        aria-label="Search products"
        className={[
          'flex-1 text-body bg-transparent outline-none',
          disabled
            ? 'text-neutral-400 cursor-not-allowed placeholder:text-neutral-400'
            : 'text-neutral-900 placeholder:text-neutral-400',
        ].join(' ')}
      />
      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled || loading}
        aria-label="Submit search"
        className={[
          'shrink-0 transition-colors',
          disabled || loading
            ? 'text-neutral-400 cursor-not-allowed'
            : 'text-primary hover:text-primary-dark',
        ].join(' ')}
      >
        {loading ? <Spinner /> : <SearchIcon />}
      </button>
    </div>
  )
}
