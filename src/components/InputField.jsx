export default function InputField({
  id,
  label,
  value,
  onChange,
  placeholder,
  helperText,
  error,
  disabled = false,
  type = 'text',
}) {
  return (
    <div className="flex flex-col gap-xs">
      <label htmlFor={id} className="text-small font-semibold text-neutral-900">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={[
          'w-full px-md py-sm rounded-md border bg-white',
          'text-body text-neutral-900 placeholder:text-neutral-400',
          'focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-primary-dark',
          'transition-colors',
          error
            ? 'border-error ring-2 ring-error'
            : 'border-neutral-200',
          disabled
            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border-neutral-200'
            : '',
        ].join(' ')}
      />
      {error && (
        <p className="text-micro text-error">{error}</p>
      )}
      {!error && helperText && (
        <p className="text-micro text-neutral-600">{helperText}</p>
      )}
    </div>
  )
}
