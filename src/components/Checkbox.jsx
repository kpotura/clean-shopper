export default function Checkbox({ id, label, checked, onChange, disabled = false }) {
  return (
    <div className="flex items-center gap-sm">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className={`w-4 h-4 accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark rounded-sm ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      />
      <label
        htmlFor={id}
        className={`text-small select-none ${
          disabled
            ? 'text-neutral-400 cursor-not-allowed'
            : 'text-neutral-600 cursor-pointer'
        }`}
      >
        {label}
      </label>
    </div>
  )
}
