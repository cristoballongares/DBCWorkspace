import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Solo el ADMIN se siembra directamente. Briana y David se crean via el
// link de invitacion que el ADMIN genera desde el panel (registro solo
// por invitacion, sin cuentas placeholder).
const ADMIN_EMAIL = 'cristoballongares@gmail.com';
const ADMIN_NAME = 'Cristobal';
const ADMIN_SEED_PASSWORD = 'changeme';

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_SEED_PASSWORD, 10);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      role: Role.ADMIN,
      passwordHash,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
