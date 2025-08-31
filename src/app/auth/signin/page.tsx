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
        className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8"
        style={{ backgroundColor: '#1f2937' }}
      >
        <div className="mx-auto max-w-md text-center">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div 
              className="flex items-center justify-center w-16 h-16 rounded-xl mr-4"
              style={{ backgroundColor: '#f97316' }}
            >
              <span className="text-white text-2xl font-bold">F</span>
            </div>
            <h1 className="text-4xl font-bold text-white">FORGE</h1>
          </div>
          
          {/* Tagline */}
          <h2 className="text-xl text-gray-300 mb-6">
            STO Account Management Platform
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Streamline your account workflows, track performance metrics, and manage 
            stakeholder relationships all in one powerful dashboard.
          </p>
          
          {/* Features */}
          <div className="mt-12 space-y-4">
            <div className="flex items-center text-gray-300">
              <Shield className="w-5 h-5 mr-3" style={{ color: '#f97316' }} />
              <span>Secure authentication</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Mail className="w-5 h-5 mr-3" style={{ color: '#f97316' }} />
              <span>Magic link sign-in</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Sign In Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mx-auto w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center mb-8 lg:hidden">
            <div 
              className="flex items-center justify-center w-12 h-12 rounded-lg mr-3"
              style={{ backgroundColor: '#f97316' }}
            >
              <span className="text-white text-xl font-bold">F</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">FORGE</h1>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1 text-center pb-8">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Welcome back
              </CardTitle>
              <CardDescription className="text-gray-600">
                Enter your email to receive a secure magic link
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
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
                    className="h-11 text-base"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-medium"
                  disabled={isLoading}
                  style={{ 
                    backgroundColor: '#f97316',
                    borderColor: '#f97316'
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending magic link...
                    </div>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Magic Link
                    </>
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
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
