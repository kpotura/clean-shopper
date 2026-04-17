export default function CategoryTag({ label, selected = false, onClick }) {
  const base = 'inline-flex items-center px-md py-xs rounded-full text-small font-semibold transition-colors'

  const variant = selected
    ? 'bg-accent text-on-accent'
    : 'bg-secondary text-on-secondary'

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
