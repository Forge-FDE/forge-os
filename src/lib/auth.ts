import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import EmailProvider from "next-auth/providers/email"
import { prisma } from "@/lib/prisma"

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || []

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Skip adapter for now until database is set up
  ...(process.env.NODE_ENV === 'production' ? {} : { adapter: PrismaAdapter(prisma) }),
  
  providers: [
    // Simplified email provider - disable actual sending for now
    EmailProvider({
      server: process.env.NODE_ENV === 'production' ? undefined : {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM || "noreply@forge-os.com",
      // For testing - just log the magic link instead of sending
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        console.log(`Magic link for ${identifier}: ${url}`)
        // In production, we'll just log - no actual email sending
      },
    })
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user?.id || session.user.id
        session.user.role = ADMIN_EMAILS.includes(user?.email || session.user.email || '') ? 'admin' : 'viewer'
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  trustHost: true,
  debug: process.env.NODE_ENV === 'development',
  
  // Add explicit host configuration
  experimental: {
    trustHost: true
  }
})
