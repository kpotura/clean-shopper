import { useTheme } from '../lib/theme-context'

const NAV_LINKS = [
  { label: 'Browse', route: 'browse' },
  { label: 'Search', route: 'search' },
]

const THEME_META = {
  crimson:  { label: 'Crimson', nextLabel: 'BHDS-2',  dot: '#16488E' },
  'BHDS-2': { label: 'BHDS-2',  nextLabel: 'Crimson', dot: '#E60000' },
}

export default function NavBar({ activePage, onNavigate, onSignOut }) {
  const { theme, toggleTheme } = useTheme()
  const meta = THEME_META[theme]

  return (
    <nav className="w-full bg-white border-b border-neutral-200 shadow-sm px-xl py-md flex items-center justify-between">
      <button
        onClick={() => onNavigate('browse')}
        className="text-h4 font-semibold text-neutral-900 hover:text-primary transition-colors"
      >
        Clean Shopper
      </button>
      <ul className="flex items-center gap-lg list-none m-0 p-0">
        {NAV_LINKS.map(({ label, route }) => (
          <li key={route}>
            <button
              onClick={() => onNavigate(route)}
              className={
                activePage === route
                  ? 'text-body text-primary font-semibold'
                  : 'text-body text-neutral-600 hover:text-neutral-900 transition-colors'
              }
            >
              {label}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${meta.nextLabel} theme`}
            title={`Switch to ${meta.nextLabel} theme`}
            className="flex items-center gap-xs text-body text-neutral-600 hover:text-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-dark rounded-sm"
          >
            <span
              className="inline-block w-3 h-3 rounded-full border border-neutral-200 flex-shrink-0"
              style={{ backgroundColor: meta.dot }}
              aria-hidden="true"
            />
            {meta.nextLabel}
          </button>
        </li>
        <li>
          <button
            onClick={onSignOut}
            className="text-body text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Sign out
          </button>
        </li>
      </ul>
    </nav>
  )
}
