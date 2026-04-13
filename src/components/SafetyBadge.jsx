const verdictConfig = {
  clean:   { label: 'Clean',       classes: 'bg-success text-neutral-50' },
  caution: { label: 'Use Caution', classes: 'bg-warning text-neutral-50' },
  avoid:   { label: 'Avoid',       classes: 'bg-error text-neutral-50'   },
}

const sizeClasses = {
  md: 'px-md py-xs text-small',
  sm: 'px-sm py-xs text-micro',
}

export default function SafetyBadge({ verdict, size = 'md' }) {
  if (!verdictConfig[verdict]) return null
  const { label, classes } = verdictConfig[verdict]

  return (
    <span
      className={`inline-flex items-center gap-xs rounded-full font-semibold ${classes} ${sizeClasses[size]}`}
    >
      {label}
    </span>
  )
}
