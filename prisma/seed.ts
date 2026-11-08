import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

config();

const prisma = new PrismaClient();

async function purgeDatabase() {
  console.log('SEED_RESET=true, removing existing rows...');
  await prisma.auditLog.deleteMany();
  await prisma.customerDocument.deleteMany();
  await prisma.customerNote.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.visitService.deleteMany();
  await prisma.membershipService.deleteMany();
  await prisma.visit.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.planTemplateService.deleteMany();
  await prisma.planTemplate.deleteMany();
  await prisma.branchService.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.serviceVariant.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceCategory.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.user.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.branch.deleteMany();
}

async function main() {
  if (process.env.SEED_RESET === 'true') {
    await purgeDatabase();
  } else {
    console.log('Seeding without deleting existing guests, visits, or payments.');
  }

  // 2. Provision System Roles
  const roles = await Promise.all(
    [
      { name: 'SUPER_ADMIN', description: 'Global Central Administrator with full system access', isSystem: true },
      { name: 'ADMIN', description: 'Headquarters Administrator', isSystem: true },
      { name: 'BRANCH_MANAGER', description: 'Branch General Manager', isSystem: true },
      { name: 'RECEPTIONIST', description: 'Front-desk Receptionist & Check-in Coordinator', isSystem: true },
      { name: 'STAFF', description: 'General Spa Staff', isSystem: true },
      { name: 'THERAPIST', description: 'Licensed Spa Therapist & Aesthetician', isSystem: true },
      { name: 'ACCOUNTANT', description: 'Financial & Billing Officer', isSystem: true },
      { name: 'REPORT_VIEWER', description: 'Auditor and Business Intelligence Analyst', isSystem: true },
    ].map((role) =>
      prisma.role.upsert({
        where: { name: role.name },
        update: { description: role.description, isSystem: true },
        create: role,
      }),
    ),
  );

  const roleMap = new Map(roles.map((r) => [r.name, r]));

  // 3. Provision System Permissions
  const permissionDefs = [
    { name: 'branch.read', module: 'branch', description: 'View spa branches' },
    { name: 'branch.create', module: 'branch', description: 'Create new spa branch' },
    { name: 'branch.update', module: 'branch', description: 'Update branch settings & info' },
    { name: 'branch.delete', module: 'branch', description: 'Deactivate or delete branch' },

    { name: 'customer.read', module: 'customer', description: 'View customer profiles' },
    { name: 'customer.create', module: 'customer', description: 'Register new customers' },
    { name: 'customer.update', module: 'customer', description: 'Update customer details' },
    { name: 'customer.delete', module: 'customer', description: 'Archive or delete customer' },

    { name: 'service.read', module: 'service', description: 'View spa services & menus' },
    { name: 'service.create', module: 'service', description: 'Create new services & treatments' },
    { name: 'service.update', module: 'service', description: 'Update services & branch pricing' },
    { name: 'service.delete', module: 'service', description: 'Remove service' },

    { name: 'plan.read', module: 'plan', description: 'View membership plan packages' },
    { name: 'plan.create', module: 'plan', description: 'Create plan packages & bundles' },
    { name: 'plan.update', module: 'plan', description: 'Update plan configurations' },
    { name: 'plan.delete', module: 'plan', description: 'Archive plan package' },

    { name: 'membership.read', module: 'membership', description: 'View customer memberships' },
    { name: 'membership.create', module: 'membership', description: 'Assign or sell customer memberships' },
    { name: 'membership.update', module: 'membership', description: 'Modify membership status/details' },
    { name: 'membership.cancel', module: 'membership', description: 'Cancel customer membership' },

    { name: 'visit.read', module: 'visit', description: 'View check-in visits' },
    { name: 'visit.create', module: 'visit', description: 'Check-in customer & redeem service' },
    { name: 'visit.complete', module: 'visit', description: 'Complete visit service' },
    { name: 'visit.cancel', module: 'visit', description: 'Cancel visit' },

    { name: 'appointment.read', module: 'appointment', description: 'View spa appointment schedule' },
    { name: 'appointment.create', module: 'appointment', description: 'Book customer appointment' },
    { name: 'appointment.update', module: 'appointment', description: 'Modify or reschedule appointment' },
    { name: 'appointment.cancel', module: 'appointment', description: 'Cancel appointment' },

    { name: 'payment.read', module: 'payment', description: 'View billing and transactions' },
    { name: 'payment.create', module: 'payment', description: 'Process payments & receipts' },
    { name: 'payment.refund', module: 'payment', description: 'Issue refund' },

    { name: 'invoice.read', module: 'invoice', description: 'View client invoices' },
    { name: 'invoice.create', module: 'invoice', description: 'Generate client invoice' },

    { name: 'staff.read', module: 'staff', description: 'View staff directory' },
    { name: 'staff.create', module: 'staff', description: 'Add new staff member' },
    { name: 'staff.update', module: 'staff', description: 'Update staff member' },
    { name: 'staff.delete', module: 'staff', description: 'Deactivate staff member' },

    { name: 'user.read', module: 'user', description: 'View system users' },
    { name: 'user.create', module: 'user', description: 'Create branch system accounts' },
    { name: 'user.update', module: 'user', description: 'Manage user permissions' },
    { name: 'user.delete', module: 'user', description: 'Suspend or remove user' },

    { name: 'report.read', module: 'report', description: 'Access financial & operational reports' },
    { name: 'audit.read', module: 'audit', description: 'Access regulatory audit logs' },
    { name: 'settings.read', module: 'settings', description: 'View system and branch settings' },
    { name: 'settings.update', module: 'settings', description: 'Update settings' },
  ];

  const permissions = await Promise.all(
    permissionDefs.map((permission) =>
      prisma.permission.upsert({
        where: { name: permission.name },
        update: { module: permission.module, description: permission.description },
        create: permission,
      }),
    ),
  );
  console.log(`✓ Provisioned ${permissions.length} granular permissions`);

  // Map all permissions to SUPER_ADMIN role
  const superAdminRole = roleMap.get('SUPER_ADMIN')!;
  await prisma.rolePermission.createMany({
    data: permissions.map((perm) => ({ roleId: superAdminRole.id, permissionId: perm.id })),
    skipDuplicates: true,
  });

  // Map operational permissions to other system roles for future user provisioning
  const branchManagerRole = roleMap.get('BRANCH_MANAGER')!;
  const managerPerms = permissions.filter(
    (p) => !['branch.create', 'branch.delete', 'audit.read'].includes(p.name)
  );
  await prisma.rolePermission.createMany({
    data: managerPerms.map((perm) => ({ roleId: branchManagerRole.id, permissionId: perm.id })),
    skipDuplicates: true,
  });

  const receptionistRole = roleMap.get('RECEPTIONIST')!;
  const recPerms = permissions.filter((p) =>
    [
      'customer.read', 'customer.create', 'customer.update',
      'service.read', 'plan.read', 'membership.read', 'membership.create',
      'visit.read', 'visit.create', 'visit.complete',
      'appointment.read', 'appointment.create', 'appointment.update',
      'payment.read', 'payment.create', 'invoice.read', 'invoice.create',
      'staff.read',
    ].includes(p.name)
  );
  await prisma.rolePermission.createMany({
    data: recPerms.map((perm) => ({ roleId: receptionistRole.id, permissionId: perm.id })),
    skipDuplicates: true,
  });

  const therapistRole = roleMap.get('THERAPIST')!;
  const therPerms = permissions.filter((p) =>
    ['appointment.read', 'visit.read', 'visit.complete', 'service.read'].includes(p.name)
  );
  await prisma.rolePermission.createMany({
    data: therPerms.map((perm) => ({ roleId: therapistRole.id, permissionId: perm.id })),
    skipDuplicates: true,
  });
  console.log('✓ Configured RBAC role-permission assignments');

  const isProduction = process.env.NODE_ENV === 'production';
  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim() || (isProduction ? '' : 'bhairaram@gmail.com');
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || (isProduction ? '' : 'Bhairaram@123');
  const firstName = process.env.SEED_ADMIN_FIRST_NAME?.trim() || 'Bhairaram';
  const lastName = process.env.SEED_ADMIN_LAST_NAME?.trim() || 'SuperAdmin';

  if (!adminEmail || !adminPassword) {
    const existingUsers = await prisma.user.count();
    if (existingUsers === 0) {
      throw new Error('Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD before seeding an empty production database.');
    }
    console.log('Admin password was not changed. Existing users were left as they are.');
  } else {
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (existing) {
      console.log(`Admin ${adminEmail} already exists. Password was left unchanged.`);
    } else {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await prisma.user.create({
        data: {
          email: adminEmail,
          passwordHash,
          firstName,
          lastName,
          phone: null,
          branchId: null,
          isActive: true,
          userRoles: { create: { roleId: superAdminRole.id } },
        },
      });
      console.log(`Super admin created: ${adminEmail}`);
      if (!process.env.SEED_ADMIN_PASSWORD) {
        console.log('Development password: Bhairaram@123');
      }
    }
  }

  console.log('Seed finished. Guest and billing records were not removed.');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
