const NAV_LINKS = [
  { label: 'Browse', route: 'browse' },
  { label: 'Search', route: 'search' },
]

export default function NavBar({ activePage, onNavigate, onSignOut }) {
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
