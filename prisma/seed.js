const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
  // Create test admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@forge-os.com" },
    update: {},
    create: {
      email: "admin@forge-os.com",
      name: "Admin User",
      role: "admin",
    },
  })

  // Create test STO user
  const stoUser = await prisma.user.upsert({
    where: { email: "sto@forge-os.com" },
    update: {},
    create: {
      email: "sto@forge-os.com",
      name: "STO User", 
      role: "viewer",
    },
  })

  console.log("Seed data created:", { adminUser, stoUser })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
