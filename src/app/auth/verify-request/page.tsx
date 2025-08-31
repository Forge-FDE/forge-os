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
            Check your email to complete the secure sign-in process.
          </p>
        </div>
      </div>

      {/* Right Panel - Verify Request */}
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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Check your email</CardTitle>
              <CardDescription className="text-gray-600">
                A secure sign-in link has been sent to your email address
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <div className="space-y-4 text-gray-600">
                <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 mr-3" style={{ color: '#f97316' }} />
                  <p className="text-sm">Click the link in your email to sign in to Forge OS</p>
                </div>
                <p className="text-sm text-gray-500">
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
