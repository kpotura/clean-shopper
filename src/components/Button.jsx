function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 mx-auto"
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

const variantClasses = {
  primary:   'bg-primary text-on-primary hover:bg-primary-light active:bg-primary-dark',
  secondary: 'bg-secondary text-primary border border-primary hover:bg-secondary-dark active:bg-secondary-dark active:border-primary-dark active:text-primary-dark',
  ghost:     'bg-transparent text-primary hover:bg-secondary active:bg-secondary-dark',
}

const sizeClasses = {
  md: 'px-lg py-sm text-body',
  sm: 'px-md py-xs text-small',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  fullWidth = false,
}) {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={[
        'rounded-md font-sans font-semibold transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-primary-dark',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-50 cursor-not-allowed' : '',
      ].join(' ')}
    >
      {loading ? <Spinner /> : children}
    </button>
  )
}
