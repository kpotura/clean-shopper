import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { signOut } from './lib/api/auth'
import { ThemeProvider } from './lib/theme-context'
import NavBar from './components/NavBar'
import BrowsePage from './features/browse/BrowsePage'
import SearchPage from './features/search/SearchPage'
import SignInPage from './features/auth/SignInPage'
import SignUpPage from './features/auth/SignUpPage'

function AppShell() {
  const [session, setSession] = useState(undefined)
  const [page, setPage] = useState('browse')
  const [authPage, setAuthPage] = useState('signin')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Still checking session
  if (session === undefined) return null

  // Not authenticated — show auth pages
  if (!session) {
    return authPage === 'signin'
      ? <SignInPage onNavigateToSignUp={() => setAuthPage('signup')} />
      : <SignUpPage onNavigateToSignIn={() => setAuthPage('signin')} />
  }

  const handleSignOut = async () => {
    await signOut()
    setAuthPage('signin')
  }

  // Authenticated — show main app
  return (
    <div className="min-h-screen bg-surface-subtle">
      <NavBar activePage={page} onNavigate={setPage} onSignOut={handleSignOut} />
      {page === 'browse' && <BrowsePage />}
      {page === 'search' && <SearchPage />}
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  )
}
