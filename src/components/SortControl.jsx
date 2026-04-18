export default function SortControl({ options, value, onChange, label = 'Sort by' }) {
  const id = 'sort-control'
  return (
    <div className="inline-flex items-center gap-sm">
      <label
        htmlFor={id}
        className="text-small text-neutral-600 whitespace-nowrap"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-small font-semibold text-neutral-900 bg-white border border-neutral-200 rounded-md px-sm py-xs focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-primary-dark cursor-pointer transition-colors hover:border-neutral-400"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
