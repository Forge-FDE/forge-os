"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Mail, Shield } from "lucide-react"

function SignInForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to send magic link. Please try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Check your email",
          description: "A magic link has been sent to your email address.",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen flex"
      style={{ backgroundColor: '#f9fafb' }}
    >
      {/* Left Panel - Branding */}
      <div 
        className="hidden lg:flex lg:w-2/5 lg:flex-col lg:justify-center lg:px-12"
        style={{ backgroundColor: '#1f2937' }}
      >
        <div className="mx-auto max-w-sm">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <div 
              className="flex items-center justify-center w-12 h-12 rounded-lg mr-3"
              style={{ backgroundColor: '#f97316' }}
            >
              <span className="text-white text-xl font-bold">F</span>
            </div>
            <h1 className="text-3xl font-bold text-white">FORGE</h1>
          </div>
          
          {/* Tagline */}
          <h2 className="text-lg text-gray-300 mb-4">
            STO Account Management Platform
          </h2>
          <p className="text-gray-400 leading-relaxed text-sm mb-8">
            Streamline your account workflows, track performance metrics, and manage 
            stakeholder relationships all in one powerful dashboard.
          </p>
          
          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-center text-gray-300">
              <Shield className="w-4 h-4 mr-3" style={{ color: '#f97316' }} />
              <span className="text-sm">Secure authentication</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Mail className="w-4 h-4 mr-3" style={{ color: '#f97316' }} />
              <span className="text-sm">Magic link sign-in</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Sign In Form */}
      <div className="flex flex-1 flex-col justify-center px-8 py-12 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center mb-12 lg:hidden">
            <div 
              className="flex items-center justify-center w-12 h-12 rounded-lg mr-3"
              style={{ backgroundColor: '#f97316' }}
            >
              <span className="text-white text-xl font-bold">F</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">FORGE</h1>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Welcome back
            </h1>
            <p className="text-gray-600 text-lg">
              Enter your email to receive a secure magic link
            </p>
          </div>

          <Card className="shadow-lg border border-gray-200">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-800">
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-14 text-lg px-4 border-2 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-semibold rounded-lg"
                  disabled={isLoading}
                  style={{ 
                    backgroundColor: '#f97316',
                    borderColor: '#f97316'
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending magic link...
                    </div>
                  ) : (
                    <>
                      <Mail className="mr-3 h-5 w-5" />
                      Send Magic Link
                    </>
                  )}
                </Button>
              </form>
              
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500">
                  By signing in, you agree to our terms of service and privacy policy.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f9fafb' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  )
}
