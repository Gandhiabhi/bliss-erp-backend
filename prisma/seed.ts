import { PrismaClient, BranchStatus, MembershipStatus, PaymentStatus, PaymentMethod, VisitStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed for International Spa System...');

  // 1. Clear existing data in reverse order of dependencies
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

  console.log('✓ Cleared previous database records');

  // 2. Roles
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

  // 3. Permissions
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
  console.log(`✓ Created ${permissions.length} granular permissions`);

  // Map permissions to roles
  // SUPER_ADMIN gets all permissions
  const superAdminRole = roleMap.get('SUPER_ADMIN')!;
  await Promise.all(
    permissions.map((perm) =>
      prisma.rolePermission.create({
        data: { roleId: superAdminRole.id, permissionId: perm.id },
      })
    )
  );

  // BRANCH_MANAGER gets all operational branch permissions
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

  // RECEPTIONIST gets check-in, customer, appointment, visit, and payment create
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

  // THERAPIST gets appointment and visit access
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

  // 4. Branches (International)
  const branches = await Promise.all([
    prisma.branch.create({
      data: {
        branchCode: 'DXB-01',
        name: 'Dubai Wellness Sanctuary',
        country: 'United Arab Emirates',
        state: 'Dubai',
        city: 'Dubai',
        address: 'Palm Jumeirah, Crescent West, Dubai',
        phone: '+971 4 398 7654',
        email: 'dubai@blishspa.com',
        timezone: 'Asia/Dubai',
        currency: 'AED',
        openingTime: '09:00',
        closingTime: '22:00',
        status: BranchStatus.ACTIVE,
      },
    }),
    prisma.branch.create({
      data: {
        branchCode: 'LDN-01',
        name: 'London Royal Oasis',
        country: 'United Kingdom',
        state: 'Greater London',
        city: 'London',
        address: '42 Berkeley Square, Mayfair, London W1J 5AW',
        phone: '+44 20 7946 0192',
        email: 'london@blishspa.com',
        timezone: 'Europe/London',
        currency: 'GBP',
        openingTime: '08:30',
        closingTime: '21:00',
        status: BranchStatus.ACTIVE,
      },
    }),
    prisma.branch.create({
      data: {
        branchCode: 'JAI-01',
        name: 'Jaipur Heritage Retreat',
        country: 'India',
        state: 'Rajasthan',
        city: 'Jaipur',
        address: 'Palace Road, Civil Lines, Jaipur 302006',
        phone: '+91 141 238 9010',
        email: 'jaipur@blishspa.com',
        timezone: 'Asia/Kolkata',
        currency: 'INR',
        openingTime: '08:00',
        closingTime: '20:30',
        status: BranchStatus.ACTIVE,
      },
    }),
    prisma.branch.create({
      data: {
        branchCode: 'SIN-01',
        name: 'Singapore Sentosa Serenity',
        country: 'Singapore',
        state: 'Central',
        city: 'Singapore',
        address: '1 Ocean Way, Sentosa Cove, Singapore 098374',
        phone: '+65 6789 0123',
        email: 'singapore@blishspa.com',
        timezone: 'Asia/Singapore',
        currency: 'SGD',
        openingTime: '10:00',
        closingTime: '22:00',
        status: BranchStatus.ACTIVE,
      },
    }),
  ]);

  const [dubaiBranch, londonBranch, jaipurBranch, singaporeBranch] = branches;
  console.log(`✓ Created 4 international branches: Dubai, London, Jaipur, Singapore`);

  // 5. Users
  const passwordHash = await bcrypt.hash('Admin@123456', 10);

  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@blishspa.com',
      passwordHash,
      firstName: 'Alexander',
      lastName: 'Vane',
      phone: '+1 415 555 0100',
      branchId: null, // Global access
      isActive: true,
      userRoles: { create: { roleId: superAdminRole.id } },
    },
  });

  const dubaiManager = await prisma.user.create({
    data: {
      email: 'dubai.manager@blishspa.com',
      passwordHash,
      firstName: 'Tariq',
      lastName: 'Al-Hashemi',
      phone: '+971 50 123 4567',
      branchId: dubaiBranch.id,
      isActive: true,
      userRoles: { create: { roleId: branchManagerRole.id } },
    },
  });

  const dubaiReceptionist = await prisma.user.create({
    data: {
      email: 'dubai.reception@blishspa.com',
      passwordHash,
      firstName: 'Layla',
      lastName: 'Hassan',
      phone: '+971 55 987 6543',
      branchId: dubaiBranch.id,
      isActive: true,
      userRoles: { create: { roleId: receptionistRole.id } },
    },
  });

  const londonManager = await prisma.user.create({
    data: {
      email: 'london.manager@blishspa.com',
      passwordHash,
      firstName: 'Charlotte',
      lastName: 'Sterling',
      phone: '+44 7700 900123',
      branchId: londonBranch.id,
      isActive: true,
      userRoles: { create: { roleId: branchManagerRole.id } },
    },
  });

  const jaipurManager = await prisma.user.create({
    data: {
      email: 'jaipur.manager@blishspa.com',
      passwordHash,
      firstName: 'Vikram',
      lastName: 'Rathore',
      phone: '+91 98290 12345',
      branchId: jaipurBranch.id,
      isActive: true,
      userRoles: { create: { roleId: branchManagerRole.id } },
    },
  });

  console.log('✓ Created users with password "Admin@123456"');

  // 6. Service Categories
  const categories = await Promise.all([
    prisma.serviceCategory.create({ data: { name: 'Massages & Bodywork', displayOrder: 1, description: 'Holistic therapeutic and relaxation body massages' } }),
    prisma.serviceCategory.create({ data: { name: 'Facials & Skin Rejuvenation', displayOrder: 2, description: 'Advanced clinical & botanical skincare treatments' } }),
    prisma.serviceCategory.create({ data: { name: 'Hydrotherapy & Thermal Suites', displayOrder: 3, description: 'Hammam, mineral baths, steam, and sauna experiences' } }),
    prisma.serviceCategory.create({ data: { name: 'Nails & Beauty Rituals', displayOrder: 4, description: 'Luxury manicure, pedicure, and grooming' } }),
  ]);

  const [catMassage, catFacial, catHydro, catNails] = categories;

  // 7. Services & Variants
  // Service 1: Swedish Massage
  const swedish = await prisma.service.create({
    data: {
      code: 'SRV-SWE-01',
      name: 'Swedish Relaxation Massage',
      categoryId: catMassage.id,
      description: 'Classic European full body relaxation massage to ease tension and improve circulation.',
      defaultDuration: 60,
      defaultPrice: 350.0,
      currency: 'AED',
      variants: {
        create: [
          { name: '30 Minutes Express', duration: 30, price: 210.0, currency: 'AED' },
          { name: '60 Minutes Full Body', duration: 60, price: 350.0, currency: 'AED' },
          { name: '90 Minutes Deluxe', duration: 90, price: 490.0, currency: 'AED' },
        ],
      },
    },
    include: { variants: true },
  });

  // Service 2: Deep Tissue Massage
  const deepTissue = await prisma.service.create({
    data: {
      code: 'SRV-DT-01',
      name: 'Deep Tissue Recovery Massage',
      categoryId: catMassage.id,
      description: 'Targeted deep muscle pressure release therapy for sports recovery and chronic tension.',
      defaultDuration: 60,
      defaultPrice: 420.0,
      currency: 'AED',
      variants: {
        create: [
          { name: '60 Minutes Intensive', duration: 60, price: 420.0, currency: 'AED' },
          { name: '90 Minutes Ultimate Therapy', duration: 90, price: 580.0, currency: 'AED' },
        ],
      },
    },
    include: { variants: true },
  });

  // Service 3: Aromatherapy Massage
  const aromatherapy = await prisma.service.create({
    data: {
      code: 'SRV-ARO-01',
      name: 'Signature Aromatherapy Infusion',
      categoryId: catMassage.id,
      description: 'Bespoke organic essential oils blended to restore emotional harmony and bodily vitality.',
      defaultDuration: 60,
      defaultPrice: 390.0,
      currency: 'AED',
      variants: {
        create: [
          { name: '60 Minutes Harmonizing', duration: 60, price: 390.0, currency: 'AED' },
          { name: '90 Minutes Deep Awakening', duration: 90, price: 540.0, currency: 'AED' },
        ],
      },
    },
    include: { variants: true },
  });

  // Service 4: Hydra-Glow Facial
  const facial = await prisma.service.create({
    data: {
      code: 'SRV-HYD-01',
      name: 'Hydra-Glow Anti-Aging Facial',
      categoryId: catFacial.id,
      description: 'Medical-grade hydradermabrasion with hyaluronic acid micro-infusion and collagen peptide mask.',
      defaultDuration: 60,
      defaultPrice: 450.0,
      currency: 'AED',
      variants: {
        create: [
          { name: '45 Minutes Instant Glow', duration: 45, price: 320.0, currency: 'AED' },
          { name: '60 Minutes Clinical Luxe', duration: 60, price: 450.0, currency: 'AED' },
          { name: '75 Minutes Platinum Cellular', duration: 75, price: 620.0, currency: 'AED' },
        ],
      },
    },
    include: { variants: true },
  });

  // Service 5: Moroccan Hammam
  const hammam = await prisma.service.create({
    data: {
      code: 'SRV-HAM-01',
      name: 'Royal Moroccan Hammam & Kessa Scrub',
      categoryId: catHydro.id,
      description: 'Authentic heated marble steam ritual with black eucalyptus soap and traditional exfoliating kessa glove.',
      defaultDuration: 60,
      defaultPrice: 490.0,
      currency: 'AED',
      variants: {
        create: [
          { name: '60 Minutes Royal Cleanse', duration: 60, price: 490.0, currency: 'AED' },
          { name: '90 Minutes Imperial Rhassoul Wrap', duration: 90, price: 690.0, currency: 'AED' },
        ],
      },
    },
    include: { variants: true },
  });

  // Service 6: Thermal Jacuzzi & Sauna Suite
  const jacuzzi = await prisma.service.create({
    data: {
      code: 'SRV-JAC-01',
      name: 'Private Thermal Jacuzzi & Sauna Suite',
      categoryId: catHydro.id,
      description: 'Exclusive private wellness sanctuary with cedarwood Finnish sauna and hydro-massage jacuzzi.',
      defaultDuration: 45,
      defaultPrice: 280.0,
      currency: 'AED',
    },
  });

  console.log('✓ Created 6 core services with variants');

  // Branch-specific pricing overrides
  // London branch in GBP
  await prisma.branchService.createMany({
    data: [
      { branchId: londonBranch.id, serviceId: swedish.id, customPrice: 85.0, currency: 'GBP', isActive: true },
      { branchId: londonBranch.id, serviceId: deepTissue.id, customPrice: 105.0, currency: 'GBP', isActive: true },
      { branchId: londonBranch.id, serviceId: facial.id, customPrice: 110.0, currency: 'GBP', isActive: true },
    ],
  });

  // Jaipur branch in INR
  await prisma.branchService.createMany({
    data: [
      { branchId: jaipurBranch.id, serviceId: swedish.id, customPrice: 4500.0, currency: 'INR', isActive: true },
      { branchId: jaipurBranch.id, serviceId: deepTissue.id, customPrice: 5500.0, currency: 'INR', isActive: true },
      { branchId: jaipurBranch.id, serviceId: facial.id, customPrice: 6000.0, currency: 'INR', isActive: true },
    ],
  });

  // Singapore branch in SGD
  await prisma.branchService.createMany({
    data: [
      { branchId: singaporeBranch.id, serviceId: swedish.id, customPrice: 140.0, currency: 'SGD', isActive: true },
      { branchId: singaporeBranch.id, serviceId: deepTissue.id, customPrice: 175.0, currency: 'SGD', isActive: true },
      { branchId: singaporeBranch.id, serviceId: facial.id, customPrice: 190.0, currency: 'SGD', isActive: true },
    ],
  });

  // 8. Staff profiles (separated from user accounts, but can be linked)
  const staffMembers = await Promise.all([
    // Dubai Staff
    prisma.staff.create({
      data: {
        staffCode: 'STF-DXB-001',
        branchId: dubaiBranch.id,
        name: 'Elena Rostova',
        phone: '+971 52 345 6789',
        email: 'elena.rostova@blishspa.com',
        position: 'Senior Massage Therapist',
        specialization: 'Swedish, Deep Tissue & Sports Therapy',
        status: 'ACTIVE',
      },
    }),
    prisma.staff.create({
      data: {
        staffCode: 'STF-DXB-002',
        branchId: dubaiBranch.id,
        name: 'Nadia Bensaid',
        phone: '+971 54 876 5432',
        email: 'nadia.bensaid@blishspa.com',
        position: 'Master Hammam & Aesthetician',
        specialization: 'Moroccan Hammam, Hydra-Glow Facials',
        status: 'ACTIVE',
      },
    }),
    prisma.staff.create({
      data: {
        staffCode: 'STF-DXB-003',
        branchId: dubaiBranch.id,
        userId: dubaiReceptionist.id, // Linked to receptionist user
        name: 'Layla Hassan',
        phone: '+971 55 987 6543',
        email: 'layla.hassan@blishspa.com',
        position: 'Lead Receptionist & Host',
        specialization: 'Guest Relations & Check-in Concierge',
        status: 'ACTIVE',
      },
    }),
    // London Staff
    prisma.staff.create({
      data: {
        staffCode: 'STF-LDN-001',
        branchId: londonBranch.id,
        name: 'Chloe Evans',
        phone: '+44 7700 900334',
        email: 'chloe.evans@blishspa.com',
        position: 'Holistic Therapist',
        specialization: 'Aromatherapy & Deep Tissue',
        status: 'ACTIVE',
      },
    }),
    // Jaipur Staff
    prisma.staff.create({
      data: {
        staffCode: 'STF-JAI-001',
        branchId: jaipurBranch.id,
        name: 'Rahul Sharma',
        phone: '+91 98290 55443',
        email: 'rahul.sharma@blishspa.com',
        position: 'Ayurvedic & Deep Tissue Therapist',
        specialization: 'Marma Therapy & Swedish Massage',
        status: 'ACTIVE',
      },
    }),
  ]);

  const [elenaDubai, nadiaDubai, laylaDubai, chloeLondon, rahulJaipur] = staffMembers;
  console.log(`✓ Created ${staffMembers.length} staff profiles across branches`);

  // 9. Plan Templates (Reusable Packages)
  const swedishVariant60 = swedish.variants.find((v) => v.duration === 60)!;
  const dtVariant60 = deepTissue.variants.find((v) => v.duration === 60)!;
  const facialVariant60 = facial.variants.find((v) => v.duration === 60)!;
  const hammamVariant60 = hammam.variants.find((v) => v.duration === 60)!;

  // Plan 1: Signature Royal Wellness Package
  const royalPlan = await prisma.planTemplate.create({
    data: {
      code: 'PLN-ROYAL-90',
      branchId: dubaiBranch.id, // Dubai-specific package
      name: 'Signature Royal Wellness Package',
      description: 'Complete 90-day comprehensive rejuvenation bundle including massages, clinical facial, and thermal suite access.',
      durationDays: 90,
      price: 2450.0,
      currency: 'AED',
      status: 'ACTIVE',
      createdById: superAdmin.id,
      services: {
        create: [
          { serviceId: swedish.id, serviceVariantId: swedishVariant60.id, quantity: 5 },
          { serviceId: deepTissue.id, serviceVariantId: dtVariant60.id, quantity: 3 },
          { serviceId: facial.id, serviceVariantId: facialVariant60.id, quantity: 3 },
          { serviceId: jacuzzi.id, quantity: 4 },
        ],
      },
    },
    include: { services: true },
  });

  // Plan 2: Executive Stress Relief Plan
  const executivePlan = await prisma.planTemplate.create({
    data: {
      code: 'PLN-EXEC-30',
      branchId: null, // Global plan template
      name: 'Executive Stress Relief Plan',
      description: 'Intense 30-day corporate recovery program featuring targeted deep pressure work and relaxing aromatherapy.',
      durationDays: 30,
      price: 1350.0,
      currency: 'AED',
      status: 'ACTIVE',
      createdById: superAdmin.id,
      services: {
        create: [
          { serviceId: deepTissue.id, serviceVariantId: dtVariant60.id, quantity: 3 },
          { serviceId: aromatherapy.id, quantity: 2 },
          { serviceId: jacuzzi.id, quantity: 2 },
        ],
      },
    },
    include: { services: true },
  });

  console.log('✓ Created reusable Plan Templates with bundled services');

  // 10. Customers
  const customers = await Promise.all([
    // Dubai Customers
    prisma.customer.create({
      data: {
        customerCode: 'CUST-DXB-0001',
        branchId: dubaiBranch.id,
        firstName: 'John',
        lastName: 'Smith',
        displayName: 'John Smith',
        phone: '+971 50 111 2233',
        email: 'john.smith@acmecorp.com',
        gender: 'Male',
        dateOfBirth: new Date('1984-06-15'),
        nationality: 'British',
        address: 'Villa 14, Frond D, Palm Jumeirah',
        city: 'Dubai',
        country: 'United Arab Emirates',
        emergencyContact: '+971 50 999 8877',
        notes: 'VIP Client. Prefers firm pressure on lower back. Allergic to eucalyptus oil.',
        preferredLanguage: 'English',
        status: 'ACTIVE',
      },
    }),
    prisma.customer.create({
      data: {
        customerCode: 'CUST-DXB-0002',
        branchId: dubaiBranch.id,
        firstName: 'Fatima',
        lastName: 'Al-Mansoor',
        displayName: 'Fatima Al-Mansoor',
        phone: '+971 55 444 7788',
        email: 'fatima.almansoor@emirates.ae',
        gender: 'Female',
        dateOfBirth: new Date('1991-03-22'),
        nationality: 'Emirati',
        address: 'Jumeirah 2, Street 18B',
        city: 'Dubai',
        country: 'United Arab Emirates',
        notes: 'Regular guest for Hammam rituals and Hydra-Glow facials.',
        preferredLanguage: 'Arabic',
        status: 'ACTIVE',
      },
    }),
    // London Customer
    prisma.customer.create({
      data: {
        customerCode: 'CUST-LDN-0001',
        branchId: londonBranch.id,
        firstName: 'James',
        lastName: 'Robertson',
        displayName: 'James Robertson',
        phone: '+44 7911 123456',
        email: 'james.robertson@londonlaw.co.uk',
        gender: 'Male',
        dateOfBirth: new Date('1978-11-04'),
        nationality: 'British',
        city: 'London',
        country: 'United Kingdom',
        status: 'ACTIVE',
      },
    }),
    // Jaipur Customer
    prisma.customer.create({
      data: {
        customerCode: 'CUST-JAI-0001',
        branchId: jaipurBranch.id,
        firstName: 'Ananya',
        lastName: 'Verma',
        displayName: 'Ananya Verma',
        phone: '+91 98290 88776',
        email: 'ananya.verma@designstudio.in',
        gender: 'Female',
        dateOfBirth: new Date('1994-08-19'),
        nationality: 'Indian',
        city: 'Jaipur',
        country: 'India',
        status: 'ACTIVE',
      },
    }),
  ]);

  const [johnSmith, fatimaDubai, jamesLondon, ananyaJaipur] = customers;
  console.log(`✓ Created ${customers.length} international customer profiles`);

  // 11. Memberships & Entitlements
  // Customer 1: John Smith purchases "Signature Royal Wellness Package"
  const now = new Date();
  const startDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000); // 15 days ago
  const endDate = new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days validity

  const johnMembership = await prisma.membership.create({
    data: {
      membershipCode: 'MEM-DXB-2026-001',
      customerId: johnSmith.id,
      branchId: dubaiBranch.id,
      planTemplateId: royalPlan.id,
      isCustomPlan: false,
      name: 'Signature Royal Wellness Package',
      description: '90-day comprehensive package allocated on 15 Sep 2026',
      startDate,
      endDate,
      price: 2450.0,
      currency: 'AED',
      discount: 150.0,
      tax: 115.0,
      finalAmount: 2415.0,
      paymentStatus: PaymentStatus.PAID,
      status: MembershipStatus.ACTIVE,
      createdById: dubaiManager.id,
      notes: 'Corporate partner discount applied.',
      services: {
        create: [
          { serviceId: swedish.id, serviceVariantId: swedishVariant60.id, allocatedQuantity: 5, consumedQuantity: 2 }, // 3 remaining
          { serviceId: deepTissue.id, serviceVariantId: dtVariant60.id, allocatedQuantity: 3, consumedQuantity: 1 }, // 2 remaining
          { serviceId: facial.id, serviceVariantId: facialVariant60.id, allocatedQuantity: 3, consumedQuantity: 1 }, // 2 remaining
          { serviceId: jacuzzi.id, allocatedQuantity: 4, consumedQuantity: 0 }, // 4 remaining
        ],
      },
    },
    include: { services: true },
  });

  // Invoice & Payment for John's membership
  const invoiceJohn = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-DXB-2026-0001',
      branchId: dubaiBranch.id,
      customerId: johnSmith.id,
      membershipId: johnMembership.id,
      subtotal: 2450.0,
      discount: 150.0,
      tax: 115.0,
      total: 2415.0,
      paidAmount: 2415.0,
      balanceAmount: 0.0,
      currency: 'AED',
      status: 'PAID',
      issueDate: startDate,
      items: {
        create: [
          {
            description: 'Signature Royal Wellness Package (90 Days)',
            quantity: 1,
            unitPriceSnapshot: 2450.0,
            discount: 150.0,
            tax: 115.0,
            total: 2415.0,
            currency: 'AED',
          },
        ],
      },
    },
  });

  await prisma.payment.create({
    data: {
      paymentCode: 'PAY-DXB-2026-0001',
      branchId: dubaiBranch.id,
      customerId: johnSmith.id,
      membershipId: johnMembership.id,
      invoiceId: invoiceJohn.id,
      amount: 2415.0,
      currency: 'AED',
      paymentMethod: PaymentMethod.CARD,
      transactionReference: 'AUTH-VISA-992104',
      paymentDate: startDate,
      status: PaymentStatus.PAID,
      notes: 'Visa Infinite card payment processed at reception terminal.',
      createdById: dubaiReceptionist.id,
    },
  });

  // Customer 2: Fatima Al-Mansoor has a CUSTOM Plan created specifically for her!
  const fatimaCustomMembership = await prisma.membership.create({
    data: {
      membershipCode: 'MEM-DXB-2026-002',
      customerId: fatimaDubai.id,
      branchId: dubaiBranch.id,
      planTemplateId: null, // Custom plan has null template id!
      isCustomPlan: true,
      name: 'Custom Royal Hammam & Facial Escape',
      description: 'Bespoke custom package crafted by Branch Manager Tariq Al-Hashemi',
      startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
      price: 3100.0,
      currency: 'AED',
      discount: 200.0,
      tax: 145.0,
      finalAmount: 3045.0,
      paymentStatus: PaymentStatus.PAID,
      status: MembershipStatus.ACTIVE,
      createdById: dubaiManager.id,
      notes: 'Client requested extra Hammam sessions instead of massage.',
      services: {
        create: [
          { serviceId: hammam.id, serviceVariantId: hammamVariant60.id, allocatedQuantity: 4, consumedQuantity: 1 }, // 3 remaining
          { serviceId: facial.id, serviceVariantId: facialVariant60.id, allocatedQuantity: 4, consumedQuantity: 0 }, // 4 remaining
        ],
      },
    },
    include: { services: true },
  });

  console.log('✓ Created standard and custom memberships with service allocations');

  // 12. Historical Visits & Service Consumptions (Audit trail)
  // Visit 1 for John Smith: Swedish Massage 60m consumed
  const swedishMemService = johnMembership.services.find((s) => s.serviceId === swedish.id)!;
  const dtMemService = johnMembership.services.find((s) => s.serviceId === deepTissue.id)!;
  const facialMemService = johnMembership.services.find((s) => s.serviceId === facial.id)!;

  const visit1Date = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
  const visit1 = await prisma.visit.create({
    data: {
      visitCode: 'VST-DXB-2026-0001',
      branchId: dubaiBranch.id,
      customerId: johnSmith.id,
      membershipId: johnMembership.id,
      visitDate: visit1Date,
      checkInTime: new Date(visit1Date.getTime() + 10 * 60 * 1000),
      checkOutTime: new Date(visit1Date.getTime() + 75 * 60 * 1000),
      status: VisitStatus.COMPLETED,
      notes: 'Check-in confirmed by reception. Client reported feeling energized.',
      createdById: dubaiReceptionist.id,
      visitServices: {
        create: [
          {
            membershipServiceId: swedishMemService.id,
            serviceId: swedish.id,
            serviceVariantId: swedishVariant60.id,
            staffId: elenaDubai.id,
            quantity: 1,
            serviceNameSnapshot: 'Swedish Relaxation Massage',
            variantNameSnapshot: '60 Minutes Full Body',
            unitPriceSnapshot: 350.0,
            currencySnapshot: 'AED',
            status: 'COMPLETED',
            notes: 'Performed in Treatment Suite 3 by Elena Rostova.',
          },
        ],
      },
    },
  });

  // Visit 2 for John Smith: Second Swedish Massage 60m + Hydra-Glow Facial consumed
  const visit2Date = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const visit2 = await prisma.visit.create({
    data: {
      visitCode: 'VST-DXB-2026-0002',
      branchId: dubaiBranch.id,
      customerId: johnSmith.id,
      membershipId: johnMembership.id,
      visitDate: visit2Date,
      checkInTime: new Date(visit2Date.getTime() + 15 * 60 * 1000),
      checkOutTime: new Date(visit2Date.getTime() + 130 * 60 * 1000),
      status: VisitStatus.COMPLETED,
      notes: 'Dual treatment visit. Massage followed by facial.',
      createdById: dubaiReceptionist.id,
      visitServices: {
        create: [
          {
            membershipServiceId: swedishMemService.id,
            serviceId: swedish.id,
            serviceVariantId: swedishVariant60.id,
            staffId: elenaDubai.id,
            quantity: 1,
            serviceNameSnapshot: 'Swedish Relaxation Massage',
            variantNameSnapshot: '60 Minutes Full Body',
            unitPriceSnapshot: 350.0,
            currencySnapshot: 'AED',
            status: 'COMPLETED',
            notes: 'Second Swedish entitlement redeemed.',
          },
          {
            membershipServiceId: facialMemService.id,
            serviceId: facial.id,
            serviceVariantId: facialVariant60.id,
            staffId: nadiaDubai.id,
            quantity: 1,
            serviceNameSnapshot: 'Hydra-Glow Anti-Aging Facial',
            variantNameSnapshot: '60 Minutes Clinical Luxe',
            unitPriceSnapshot: 450.0,
            currencySnapshot: 'AED',
            status: 'COMPLETED',
            notes: 'Redeemed with Aesthetician Nadia Bensaid.',
          },
        ],
      },
    },
  });

  // Visit 3 for John Smith: Deep Tissue Massage consumed
  const visit3Date = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
  await prisma.visit.create({
    data: {
      visitCode: 'VST-DXB-2026-0003',
      branchId: dubaiBranch.id,
      customerId: johnSmith.id,
      membershipId: johnMembership.id,
      visitDate: visit3Date,
      checkInTime: new Date(visit3Date.getTime() + 5 * 60 * 1000),
      checkOutTime: new Date(visit3Date.getTime() + 70 * 60 * 1000),
      status: VisitStatus.COMPLETED,
      notes: 'Deep tissue therapy post-flight recovery.',
      createdById: dubaiReceptionist.id,
      visitServices: {
        create: [
          {
            membershipServiceId: dtMemService.id,
            serviceId: deepTissue.id,
            serviceVariantId: dtVariant60.id,
            staffId: elenaDubai.id,
            quantity: 1,
            serviceNameSnapshot: 'Deep Tissue Recovery Massage',
            variantNameSnapshot: '60 Minutes Intensive',
            unitPriceSnapshot: 420.0,
            currencySnapshot: 'AED',
            status: 'COMPLETED',
            notes: 'First Deep Tissue entitlement redeemed.',
          },
        ],
      },
    },
  });

  // Visit for Fatima: Moroccan Hammam consumed
  const fatimaHammamMemService = fatimaCustomMembership.services.find((s) => s.serviceId === hammam.id)!;
  const visitFatimaDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  await prisma.visit.create({
    data: {
      visitCode: 'VST-DXB-2026-0004',
      branchId: dubaiBranch.id,
      customerId: fatimaDubai.id,
      membershipId: fatimaCustomMembership.id,
      visitDate: visitFatimaDate,
      checkInTime: new Date(visitFatimaDate.getTime() + 5 * 60 * 1000),
      checkOutTime: new Date(visitFatimaDate.getTime() + 65 * 60 * 1000),
      status: VisitStatus.COMPLETED,
      notes: 'Hammam ritual completed by Nadia.',
      createdById: dubaiReceptionist.id,
      visitServices: {
        create: [
          {
            membershipServiceId: fatimaHammamMemService.id,
            serviceId: hammam.id,
            serviceVariantId: hammamVariant60.id,
            staffId: nadiaDubai.id,
            quantity: 1,
            serviceNameSnapshot: 'Royal Moroccan Hammam & Kessa Scrub',
            variantNameSnapshot: '60 Minutes Royal Cleanse',
            unitPriceSnapshot: 490.0,
            currencySnapshot: 'AED',
            status: 'COMPLETED',
          },
        ],
      },
    },
  });

  console.log('✓ Seeded historical visits with service consumption and snapshot pricing');

  // 13. Upcoming Appointments
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  await prisma.appointment.create({
    data: {
      appointmentCode: 'APT-DXB-2026-001',
      branchId: dubaiBranch.id,
      customerId: johnSmith.id,
      serviceId: deepTissue.id,
      serviceVariantId: dtVariant60.id,
      staffId: elenaDubai.id,
      scheduledDate: tomorrow,
      startTime: '14:00',
      endTime: '15:00',
      status: 'CONFIRMED',
      notes: 'Customer requested same therapist (Elena). Room 3 reserved.',
    },
  });

  await prisma.appointment.create({
    data: {
      appointmentCode: 'APT-DXB-2026-002',
      branchId: dubaiBranch.id,
      customerId: fatimaDubai.id,
      serviceId: facial.id,
      serviceVariantId: facialVariant60.id,
      staffId: nadiaDubai.id,
      scheduledDate: tomorrow,
      startTime: '16:30',
      endTime: '17:30',
      status: 'PENDING',
      notes: 'Awaiting phone confirmation.',
    },
  });

  // 14. Customer Notes
  await prisma.customerNote.create({
    data: {
      customerId: johnSmith.id,
      branchId: dubaiBranch.id,
      authorId: dubaiReceptionist.id,
      authorName: 'Layla Hassan',
      note: 'Prefers hot chamomile herbal infusion served in relaxation lounge after treatments.',
    },
  });

  // 15. Initial Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        actorId: superAdmin.id,
        actorName: 'Alexander Vane (SUPER_ADMIN)',
        branchId: dubaiBranch.id,
        action: 'BRANCH_CREATED',
        entityType: 'Branch',
        entityId: dubaiBranch.id,
        afterData: { code: 'DXB-01', name: 'Dubai Wellness Sanctuary' },
        createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
      },
      {
        actorId: dubaiManager.id,
        actorName: 'Tariq Al-Hashemi',
        branchId: dubaiBranch.id,
        action: 'MEMBERSHIP_CREATED',
        entityType: 'Membership',
        entityId: johnMembership.id,
        afterData: { membershipCode: 'MEM-DXB-2026-001', customer: 'John Smith', plan: 'Signature Royal Wellness Package' },
        createdAt: startDate,
      },
      {
        actorId: dubaiReceptionist.id,
        actorName: 'Layla Hassan',
        branchId: dubaiBranch.id,
        action: 'SERVICE_CONSUMED',
        entityType: 'VisitService',
        entityId: visit1.id,
        afterData: { service: 'Swedish Relaxation Massage', consumed: 1, remainingAfter: 3 },
        createdAt: visit1Date,
      },
    ],
  });

  console.log('✓ Created initial regulatory audit logs');
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
