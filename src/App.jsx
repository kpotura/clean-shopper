import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import NavBar from './components/NavBar'
import BrowsePage from './features/browse/BrowsePage'
import SearchPage from './features/search/SearchPage'
import SignInPage from './features/auth/SignInPage'
import SignUpPage from './features/auth/SignUpPage'

export default function App() {
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

  // Authenticated — show main app
  return (
    <div className="min-h-screen bg-neutral-50">
      <NavBar activePage={page} onNavigate={setPage} />
      {page === 'browse' && <BrowsePage />}
      {page === 'search' && <SearchPage />}
    </div>
  )
}
