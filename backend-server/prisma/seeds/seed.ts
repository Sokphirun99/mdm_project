import { PrismaClient, UserRole } from '@prisma/client';
import { hashPassword } from '../../src/utils/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234';
  const adminFirstName = process.env.ADMIN_FIRST_NAME || 'Admin';
  const adminLastName = process.env.ADMIN_LAST_NAME || 'User';

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (existingAdmin) {
    console.log(`✅ Admin user already exists: ${adminEmail}`);
  } else {
    const hashedPassword = await hashPassword(adminPassword);
    
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        firstName: adminFirstName,
        lastName: adminLastName,
        role: UserRole.ADMIN,
        isActive: true
      }
    });

    console.log(`✅ Created admin user: ${admin.email}`);
  }

  // Create default organization (if needed)
  const defaultOrg = await prisma.organization.findFirst();
  
  if (!defaultOrg) {
    const org = await prisma.organization.create({
      data: {
        name: 'Default Organization',
        description: 'Default organization for MDM system',
        domain: 'example.com',
        isActive: true
      }
    });

    console.log(`✅ Created default organization: ${org.name}`);
  } else {
    console.log(`✅ Default organization already exists: ${defaultOrg.name}`);
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
