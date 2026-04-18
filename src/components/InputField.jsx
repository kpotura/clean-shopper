import { useState } from 'react'

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-8-10-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

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
  showToggle = false,
}) {
  const [visible, setVisible] = useState(false)

  const resolvedType = showToggle && type === 'password'
    ? (visible ? 'text' : 'password')
    : type

  return (
    <div className="flex flex-col gap-xs">
      <label htmlFor={id} className="text-small font-semibold text-neutral-900">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={resolvedType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={[
            'w-full py-sm rounded-md border bg-surface',
            showToggle ? 'pl-md pr-xl' : 'px-md',
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
        {showToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            disabled={disabled}
            aria-label={visible ? 'Hide password' : 'Show password'}
            className="absolute right-md top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-dark rounded-sm disabled:cursor-not-allowed"
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-micro text-error">{error}</p>
      )}
      {!error && helperText && (
        <p className="text-micro text-neutral-600">{helperText}</p>
      )}
    </div>
  )
}
