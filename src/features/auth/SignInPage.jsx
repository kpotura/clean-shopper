import { useState } from 'react'
import InputField from '../../components/InputField'
import Button from '../../components/Button'
import { signIn } from '../../lib/api/auth'

export default function SignInPage({ onNavigateToSignUp }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await signIn(email, password)
      // Auth state change in App.jsx handles redirect automatically
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-md">
      <div className="bg-white rounded-lg shadow-md p-2xl w-full max-w-md">

        {/* Header */}
        <div className="flex flex-col gap-sm mb-xl">
          <h1 className="text-h2 text-neutral-900">Welcome back</h1>
          <p className="text-body text-neutral-600">
            Sign in to your Clean Shopper account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
          <InputField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            disabled={loading}
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Your password"
            disabled={loading}
          />

          {error && (
            <p className="text-small text-error">{error}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={!email || !password}
          >
            Sign in
          </Button>
        </form>

        {/* Switch to sign-up */}
        <p className="text-body text-neutral-600 text-center mt-lg">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={onNavigateToSignUp}
            className="text-primary font-semibold hover:text-primary-dark transition-colors"
          >
            Sign up
          </button>
        </p>

      </div>
    </div>
  )
}
