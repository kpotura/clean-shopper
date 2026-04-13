import { useState } from 'react'
import InputField from '../../components/InputField'
import Button from '../../components/Button'
import { signUp } from '../../lib/api/auth'

export default function SignUpPage({ onNavigateToSignIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const data = await signUp(email, password)
      // If Supabase requires email confirmation, session will be null
      if (data.session) {
        // Auth state change in App.jsx handles redirect automatically
      } else {
        setConfirmed(true)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (confirmed) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center px-md">
        <div className="bg-white rounded-lg shadow-md p-2xl w-full max-w-md flex flex-col gap-lg text-center">
          <h1 className="text-h2 text-neutral-900">Check your email</h1>
          <p className="text-body text-neutral-600">
            We sent a confirmation link to <span className="font-semibold text-neutral-900">{email}</span>. Click it to activate your account.
          </p>
          <button
            type="button"
            onClick={onNavigateToSignIn}
            className="text-primary font-semibold hover:text-primary-dark transition-colors text-body"
          >
            Back to sign in
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-md">
      <div className="bg-white rounded-lg shadow-md p-2xl w-full max-w-md">

        {/* Header */}
        <div className="flex flex-col gap-sm mb-xl">
          <h1 className="text-h2 text-neutral-900">Create an account</h1>
          <p className="text-body text-neutral-600">
            Start building your clean product library.
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
            placeholder="Choose a password"
            helperText="Must be at least 6 characters."
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
            Create account
          </Button>
        </form>

        {/* Switch to sign-in */}
        <p className="text-body text-neutral-600 text-center mt-lg">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onNavigateToSignIn}
            className="text-primary font-semibold hover:text-primary-dark transition-colors"
          >
            Sign in
          </button>
        </p>

      </div>
    </div>
  )
}
