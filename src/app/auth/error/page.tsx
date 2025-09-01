"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification token has expired or has already been used.",
    Default: "An error occurred during authentication.",
  }

  const message = errorMessages[error || "Default"] || errorMessages.Default

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
          
          <h2 className="text-lg text-gray-300 mb-4">
            STO Account Management Platform
          </h2>
          <p className="text-gray-400 leading-relaxed text-sm">
            Secure access to your account management dashboard.
          </p>
        </div>
      </div>

      {/* Right Panel - Error Form */}
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

          <div className="text-center mb-8">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Authentication Error</h1>
            <p className="text-gray-600 text-lg">{message}</p>
          </div>

          <Card className="shadow-lg border border-gray-200">
            <CardContent className="p-8 text-center">
              <Button 
                asChild 
                className="w-full h-14 text-lg font-semibold rounded-lg"
                style={{ 
                  backgroundColor: '#f97316',
                  borderColor: '#f97316'
                }}
              >
                <Link href="/auth/signin">Try Again</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f9fafb' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}
