import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import EmailProvider from "next-auth/providers/email"
import { prisma } from "@/lib/prisma"

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || []

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Prisma adapter required for email authentication
  adapter: PrismaAdapter(prisma),
  
  providers: process.env.NODE_ENV === 'production' 
    ? [
        // Custom email provider for production - no nodemailer dependency
        {
          id: "email",
          name: "Email", 
          type: "email",
          
          server: {},
          from: process.env.EMAIL_FROM || "noreply@forge-os.com",
          
          // Just log the magic link - no actual sending
          sendVerificationRequest: async ({ identifier, url }) => {
            console.log(`🔗 Magic link for ${identifier}: ${url}`)
            return Promise.resolve()
          }
        }
      ]
    : [
        // Full EmailProvider for development
        EmailProvider({
          server: {
            host: process.env.EMAIL_SERVER_HOST,
            port: process.env.EMAIL_SERVER_PORT,
            auth: {
              user: process.env.EMAIL_SERVER_USER,
              pass: process.env.EMAIL_SERVER_PASSWORD
            }
          },
          from: process.env.EMAIL_FROM || "noreply@forge-os.com",
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
  debug: process.env.NODE_ENV === 'development'
})
