const NAV_LINKS = [
  { label: 'Home', route: '/' },
  { label: 'Library', route: '/library' },
  { label: 'Shopping List', route: '/shopping-list' },
];

export default function NavBar({ activeRoute }) {
  return (
    <nav className="w-full bg-white border-b border-neutral-200 shadow-sm px-xl py-md flex items-center justify-between">
      <span className="text-h4 font-semibold text-neutral-900">Clean Shopper</span>
      <ul className="flex items-center gap-lg list-none m-0 p-0">
        {NAV_LINKS.map(({ label, route }) => (
          <li key={route}>
            <a
              href={route}
              className={
                activeRoute === route
                  ? 'text-body text-primary font-semibold'
                  : 'text-body text-neutral-600 hover:text-neutral-900 transition-colors'
              }
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
