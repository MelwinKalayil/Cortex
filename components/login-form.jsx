'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react'

import { login } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export function LoginForm() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberDevice, setRememberDevice] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [signedIn, setSignedIn] = useState(false)

  function validate() {
    const next = {}

    if (!email.trim()) {
      next.email = 'Email address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Enter a valid email address.'
    }

    if (!password) {
      next.password = 'Password is required.'
    }

    return next
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError(null)

    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)

    try {
      const { user } = await login({
        email,
        password,
        rememberDevice,
      })

      console.log('[v0] signed in as', user.role)

      setSignedIn(true)

      // Redirect based on user role
      if (user.role === 'security') {
        router.push('/security/dashboard')
      } else if (user.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        setFormError('Invalid user role.')
      }

    } catch {
      setFormError(
        'Unable to sign in. Please check your credentials.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-6 shadow-xl sm:p-8">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-6"
      >
        {formError && (
          <div
            role="alert"
            className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {formError}
          </div>
        )}

        {signedIn && (
          <div
            role="status"
            className="rounded-md border border-safe/40 bg-safe/10 px-3 py-2 text-sm text-safe"
          >
            Authenticated. Redirecting to your dashboard…
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email address</Label>

          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={
              errors.email ? 'email-error' : undefined
            }
            disabled={isSubmitting}
          />

          {errors.email && (
            <p
              id="email-error"
              className="text-sm text-destructive"
            >
              {errors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>

            <button
              type="button"
              className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              Forgot password?
            </button>
          </div>

          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password
                  ? 'password-error'
                  : undefined
              }
              disabled={isSubmitting}
              className="pr-10"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((s) => !s)
              }
              aria-label={
                showPassword
                  ? 'Hide password'
                  : 'Show password'
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>

          {errors.password && (
            <p
              id="password-error"
              className="text-sm text-destructive"
            >
              {errors.password}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={rememberDevice}
            onCheckedChange={(checked) =>
              setRememberDevice(checked === true)
            }
            disabled={isSubmitting}
          />

          <Label
            htmlFor="remember"
            className="font-normal text-muted-foreground"
          >
            Remember this device
          </Label>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  )
}