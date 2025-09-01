"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
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
      className="min-h-screen flex flex-col justify-center px-8 py-12"
      style={{ backgroundColor: '#f9fafb' }}
    >
      <div className="mx-auto w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-12">
          <div 
            className="flex items-center justify-center w-14 h-14 rounded-lg mr-4"
            style={{ backgroundColor: '#f97316' }}
          >
            <span className="text-white text-2xl font-bold">F</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">FORGE</h1>
        </div>

        <div className="text-center mb-8">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Authentication Error</h2>
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
