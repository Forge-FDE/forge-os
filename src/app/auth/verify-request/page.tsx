import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, CheckCircle } from "lucide-react"

export default function VerifyRequestPage() {
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
            Check your email to complete the secure sign-in process.
          </p>
        </div>
      </div>

      {/* Right Panel - Verify Request */}
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
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Check your email</h1>
            <p className="text-gray-600 text-lg">
              A secure sign-in link has been sent to your email address
            </p>
          </div>

          <Card className="shadow-lg border border-gray-200">
            <CardContent className="p-8">
              <div className="space-y-6 text-gray-600">
                <div className="flex items-start p-6 bg-gray-50 rounded-lg">
                  <Mail className="h-6 w-6 mr-4 mt-1 flex-shrink-0" style={{ color: '#f97316' }} />
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Check your email</p>
                    <p className="text-sm">Click the link in your email to sign in to Forge OS</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  You can close this window after clicking the email link.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
