import Button from './Button'

export default function EmptyState({
  headline,
  description,
  actionLabel,
  onAction,
  icon,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-md py-3xl px-xl">
      {icon && (
        <div className="text-neutral-400 mb-sm">{icon}</div>
      )}
      <h3 className="text-h3 text-neutral-900">{headline}</h3>
      {description && (
        <p className="text-body text-neutral-600 max-w-md">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
