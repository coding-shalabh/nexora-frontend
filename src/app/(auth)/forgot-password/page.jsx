'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Mail, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'
import { api } from '@/lib/api'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await api.post('/auth/forgot-password', { email })
      setSuccess(true)
    } catch (err) {
      console.error('Forgot password error:', err)
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('An error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="border-0 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
          <CardDescription className="text-base">
            We&apos;ve sent a password reset link to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Click the link in the email to reset your password. The link will expire in 1 hour.
          </p>
          <p className="text-sm text-muted-foreground text-center">
            Didn&apos;t receive the email? Check your spam folder or{' '}
            <button
              onClick={() => setSuccess(false)}
              className="text-primary hover:underline font-medium"
            >
              try again
            </button>
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/login" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Forgot password?</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                className="pl-10"
                required
                disabled={isLoading}
                autoComplete="email"
                autoFocus
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
      </CardFooter>
    </Card>
  )
}
