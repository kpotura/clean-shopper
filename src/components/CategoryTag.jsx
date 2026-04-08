export default function CategoryTag({ label, selected = false, onClick }) {
  const base = 'inline-flex items-center px-md py-xs rounded-full text-small font-semibold transition-colors'

  const variant = selected
    ? 'bg-accent text-neutral-50'
    : 'bg-secondary text-accent-dark'

  const hover = onClick
    ? selected
      ? 'hover:bg-accent-dark cursor-pointer'
      : 'hover:bg-secondary-dark cursor-pointer'
    : ''

  return (
    <button
      onClick={onClick}
      className={`${base} ${variant} ${hover}`}
      type="button"
    >
      {label}
    </button>
  )
}
