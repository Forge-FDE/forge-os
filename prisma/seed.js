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

  // Create test accounts
  const testAccount1 = await prisma.account.upsert({
    where: { name: "Test Account 1" },
    update: {},
    create: {
      name: "Test Account 1",
      codename: "TEST-001",
      phase: "P1_PILOT",
      stoId: stoUser.id,
      sponsor: "John Doe",
      champion: "Jane Smith",
      sentiment: "G",
      dsltDays: 1,
      escalationScore: 15,
      escalationState: "none",
      volume7d: 1000,
      revenue7d: 5000,
      cost7d: 2000,
      gm7d: 0.6,
      qcPct7d: 0.95,
      aht7d: 120.5,
      p95ms7d: 800,
      automation7d: 0.7,
      blockersOpen: 0,
      oldestBlockerAgeD: 0,
    },
  })

  const testAccount2 = await prisma.account.upsert({
    where: { name: "Test Account 2" },
    update: {},
    create: {
      name: "Test Account 2",
      codename: "TEST-002", 
      phase: "P2_EXPANSION",
      stoId: stoUser.id,
      sponsor: "Bob Wilson",
      champion: "Alice Johnson",
      sentiment: "Y",
      dsltDays: 3,
      escalationScore: 45,
      escalationState: "watch",
      volume7d: 2500,
      revenue7d: 12000,
      cost7d: 4000,
      gm7d: 0.67,
      qcPct7d: 0.98,
      aht7d: 95.2,
      p95ms7d: 650,
      automation7d: 0.8,
      blockersOpen: 1,
      oldestBlockerAgeD: 2,
    },
  })

  console.log("Seed data created:", { adminUser, stoUser, testAccount1, testAccount2 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
