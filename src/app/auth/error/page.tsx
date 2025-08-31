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
          
          <h2 className="text-xl text-gray-300 mb-6">
            STO Account Management Platform
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Secure access to your account management dashboard.
          </p>
        </div>
      </div>

      {/* Right Panel - Error Form */}
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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Authentication Error</CardTitle>
              <CardDescription className="text-gray-600">{message}</CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <Button 
                asChild 
                className="w-full h-11 text-base font-medium"
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
