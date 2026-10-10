import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Purging all existing data from database...');

  // 1. Clear all existing data in reverse order of foreign key dependencies
  await prisma.auditLog.deleteMany();
  await prisma.customerDocument.deleteMany();
  await prisma.customerNote.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.visitService.deleteMany();
  await prisma.visit.deleteMany();
  await prisma.membershipService.deleteMany();
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

  console.log('✓ Successfully erased all database tables.');

  // 2. Provision System Roles
  const roles = await Promise.all([
    prisma.role.create({ data: { name: 'SUPER_ADMIN', description: 'Global Central Administrator with full system access', isSystem: true } }),
    prisma.role.create({ data: { name: 'ADMIN', description: 'Headquarters Administrator', isSystem: true } }),
    prisma.role.create({ data: { name: 'BRANCH_MANAGER', description: 'Branch General Manager', isSystem: true } }),
    prisma.role.create({ data: { name: 'RECEPTIONIST', description: 'Front-desk Receptionist & Check-in Coordinator', isSystem: true } }),
    prisma.role.create({ data: { name: 'STAFF', description: 'General Spa Staff', isSystem: true } }),
    prisma.role.create({ data: { name: 'THERAPIST', description: 'Licensed Spa Therapist & Aesthetician', isSystem: true } }),
    prisma.role.create({ data: { name: 'ACCOUNTANT', description: 'Financial & Billing Officer', isSystem: true } }),
    prisma.role.create({ data: { name: 'REPORT_VIEWER', description: 'Auditor and Business Intelligence Analyst', isSystem: true } }),
  ]);

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
    permissionDefs.map((p) => prisma.permission.create({ data: p }))
  );
  console.log(`✓ Provisioned ${permissions.length} granular permissions`);

  // Map all permissions to SUPER_ADMIN role
  const superAdminRole = roleMap.get('SUPER_ADMIN')!;
  await Promise.all(
    permissions.map((perm) =>
      prisma.rolePermission.create({
        data: { roleId: superAdminRole.id, permissionId: perm.id },
      })
    )
  );

  // Map operational permissions to other system roles for future user provisioning
  const branchManagerRole = roleMap.get('BRANCH_MANAGER')!;
  const managerPerms = permissions.filter(
    (p) => !['branch.create', 'branch.delete', 'audit.read'].includes(p.name)
  );
  await Promise.all(
    managerPerms.map((perm) =>
      prisma.rolePermission.create({
        data: { roleId: branchManagerRole.id, permissionId: perm.id },
      })
    )
  );

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
  await Promise.all(
    recPerms.map((perm) =>
      prisma.rolePermission.create({
        data: { roleId: receptionistRole.id, permissionId: perm.id },
      })
    )
  );

  const therapistRole = roleMap.get('THERAPIST')!;
  const therPerms = permissions.filter((p) =>
    ['appointment.read', 'visit.read', 'visit.complete', 'service.read'].includes(p.name)
  );
  await Promise.all(
    therPerms.map((perm) =>
      prisma.rolePermission.create({
        data: { roleId: therapistRole.id, permissionId: perm.id },
      })
    )
  );
  console.log('✓ Configured RBAC role-permission assignments');

  // 4. Create Single Super Admin Account
  const superAdminPasswordHash = await bcrypt.hash('Bhairaram@123', 10);

  const superAdmin = await prisma.user.create({
    data: {
      email: 'bhairaram@gmail.com',
      passwordHash: superAdminPasswordHash,
      firstName: 'Bhairaram',
      lastName: 'SuperAdmin',
      phone: null,
      branchId: null, // Global access across all branches
      isActive: true,
      userRoles: {
        create: {
          roleId: superAdminRole.id,
        },
      },
    },
  });

  console.log(`✓ Super Admin created successfully:`);
  console.log(`   Email:    ${superAdmin.email}`);
  console.log(`   Password: Bhairaram@123`);
  console.log(`   Role:     SUPER_ADMIN (Global Network Access)`);
  console.log(`\n🎉 Database is clean and ready with only 1 Super Admin user!`);
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
