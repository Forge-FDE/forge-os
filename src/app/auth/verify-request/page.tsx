import { Card, CardContent } from "@/components/ui/card"
import { Mail, CheckCircle } from "lucide-react"

export default function VerifyRequestPage() {
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
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Check your email</h2>
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
  )
}
