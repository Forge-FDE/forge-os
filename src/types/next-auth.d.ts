import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: "viewer" | "admin"
    }
  }

  interface User {
    role?: string
  }
}
