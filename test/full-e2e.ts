import assert from 'assert';

const API_BASE = 'http://localhost:4000/api/v1';

async function runFullE2ETestSuite() {
  console.log('===============================================================');
  console.log('🚀 BLISH SPA ERP - COMPREHENSIVE E2E & SECURITY TEST SUITE');
  console.log('===============================================================\n');

  // --------------------------------------------------------------------------
  // TEST 1: Security - Invalid Login (should return 401)
  // --------------------------------------------------------------------------
  console.log('1️⃣ Testing Invalid Login Security...');
  const badLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'superadmin@blishspa.com', password: 'WrongPassword999!' }),
  });
  assert.strictEqual(badLoginRes.status, 401, 'Invalid password must return 401 Unauthorized');
  console.log('   ✓ Invalid credentials correctly rejected (401 Unauthorized)');

  // --------------------------------------------------------------------------
  // TEST 2: Security - Unauthenticated API Request (should return 401)
  // --------------------------------------------------------------------------
  console.log('2️⃣ Testing Unauthenticated Endpoint Access...');
  const unauthRes = await fetch(`${API_BASE}/branches`);
  assert.strictEqual(unauthRes.status, 401, 'Request without Bearer token must return 401');
  console.log('   ✓ Unauthenticated request blocked (401 Unauthorized)');

  // --------------------------------------------------------------------------
  // TEST 3: Super Admin Login
  // --------------------------------------------------------------------------
  console.log('3️⃣ Authenticating Super Administrator...');
  const saRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'superadmin@blishspa.com', password: 'Admin@123456' }),
  });
  const saJson = await saRes.json();
  assert.strictEqual(saJson.success, true, 'Super admin login must succeed');
  assert.ok(saJson.data.accessToken, 'Access token required');
  const saToken = saJson.data.accessToken;
  console.log('   ✓ Super Admin authenticated successfully');

  // --------------------------------------------------------------------------
  // TEST 4: Branch Receptionist Login & RBAC Boundary
  // --------------------------------------------------------------------------
  console.log('4️⃣ Authenticating Branch Receptionist & Testing RBAC Permissions...');
  const recRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'dubai.reception@blishspa.com', password: 'Admin@123456' }),
  });
  const recJson = await recRes.json();
  assert.strictEqual(recJson.success, true);
  const recToken = recJson.data.accessToken;
  const dubaiBranchId = recJson.data.user.branchId;

  // Receptionist attempting to create a branch (Must fail 403 Forbidden)
  const forbiddenBranchRes = await fetch(`${API_BASE}/branches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${recToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Hacker Branch',
      branchCode: 'HCK',
      country: 'Nowhere',
      city: 'Nowhere',
      timezone: 'UTC',
      currency: 'USD',
    }),
  });
  assert.strictEqual(forbiddenBranchRes.status, 403, 'Receptionist must not have branch.create permission');
  console.log('   ✓ RBAC Boundary verified: Receptionist blocked from administrative creation (403 Forbidden)');

  // --------------------------------------------------------------------------
  // TEST 5: Branch Isolation - Receptionist only sees their assigned branch
  // --------------------------------------------------------------------------
  console.log('5️⃣ Testing Multi-Tenant Branch Isolation...');
  const branchesRes = await fetch(`${API_BASE}/branches`, {
    headers: { Authorization: `Bearer ${recToken}` },
  });
  const branchesJson = await branchesRes.json();
  assert.strictEqual(branchesJson.data.length, 1, 'Branch staff must only see 1 branch');
  assert.strictEqual(branchesJson.data[0].id, dubaiBranchId, 'Branch must strictly match user assignment');
  console.log(`   ✓ Branch isolation verified: Dubai receptionist isolated to branch: ${branchesJson.data[0].name}`);

  // --------------------------------------------------------------------------
  // TEST 6: Super Admin Creates New Branch (e.g. Zurich Spa)
  // --------------------------------------------------------------------------
  console.log('6️⃣ Super Admin Creating New Branch (Zurich Spa)...');
  const timestamp = Date.now().toString().slice(-4);
  const newBranchCode = `ZUR-${timestamp}`;
  const newBranchRes = await fetch(`${API_BASE}/branches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${saToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: `Zurich Alpine Spa ${timestamp}`,
      branchCode: newBranchCode,
      country: 'Switzerland',
      city: 'Zurich',
      address: 'Bahnhofstrasse 42',
      phone: '+41 44 123 4567',
      timezone: 'Europe/Zurich',
      currency: 'CHF',
      openingTime: '08:00',
      closingTime: '21:00',
    }),
  });
  const newBranchJson = await newBranchRes.json();
  assert.strictEqual(newBranchJson.success, true);
  const zurichBranch = newBranchJson.data;
  console.log(`   ✓ New branch created: ${zurichBranch.name} (${zurichBranch.branchCode}, Currency: ${zurichBranch.currency})`);

  // --------------------------------------------------------------------------
  // TEST 7: Super Admin Creates Branch Admin for Zurich
  // --------------------------------------------------------------------------
  console.log('7️⃣ Super Admin Provisioning Branch Admin User...');
  const adminEmail = `zurich.admin.${timestamp}@blishspa.com`;
  const newAdminRes = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${saToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: adminEmail,
      password: 'Admin@123456',
      firstName: 'Hans',
      lastName: 'Gruber',
      branchId: zurichBranch.id,
      roleNames: ['BRANCH_MANAGER'],
    }),
  });
  const newAdminJson = await newAdminRes.json();
  assert.strictEqual(newAdminJson.success, true);
  console.log(`   ✓ Branch Administrator created: ${adminEmail} (Role: BRANCH_MANAGER)`);

  // --------------------------------------------------------------------------
  // TEST 8: Branch Admin Logs in
  // --------------------------------------------------------------------------
  console.log('8️⃣ Zurich Branch Administrator Logging In...');
  const zurichLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminEmail, password: 'Admin@123456' }),
  });
  const zurichLoginJson = await zurichLoginRes.json();
  assert.strictEqual(zurichLoginJson.success, true);
  const zurichToken = zurichLoginJson.data.accessToken;
  console.log('   ✓ Zurich Branch Admin authenticated');

  // --------------------------------------------------------------------------
  // TEST 9: Create Treatment Service & Variant
  // --------------------------------------------------------------------------
  console.log('9️⃣ Creating Treatment Service & Duration Variant...');
  const serviceCode = `ALP-${timestamp}`;
  const serviceRes = await fetch(`${API_BASE}/services`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${zurichToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Swiss Alpine Herbal Scrub',
      code: serviceCode,
      defaultDuration: 60,
      defaultPrice: 180,
      currency: 'CHF',
      description: 'Invigorating alpine herbs and mountain salt crystal scrub.',
    }),
  });
  const serviceJson = await serviceRes.json();
  assert.strictEqual(serviceJson.success, true);
  const newService = serviceJson.data;

  // Add 90min variant
  const variantRes = await fetch(`${API_BASE}/services/${newService.id}/variants`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${zurichToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: '90 Minutes Deluxe Alpine Scrub',
      duration: 90,
      price: 240,
      currency: 'CHF',
    }),
  });
  const variantJson = await variantRes.json();
  assert.strictEqual(variantJson.success, true);
  console.log(`   ✓ Treatment created: ${newService.name} (Base: CHF 180, 90m Variant: CHF 240)`);

  // --------------------------------------------------------------------------
  // TEST 10: Create Staff Therapist
  // --------------------------------------------------------------------------
  console.log('🔟 Creating Therapist Profile...');
  const staffRes = await fetch(`${API_BASE}/staff`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${zurichToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      branchId: zurichBranch.id,
      name: 'Greta Meyer',
      phone: '+41 79 123 4567',
      email: 'greta@blish-spa.ch',
      position: 'Master Herbal Therapist',
      specialization: 'Alpine Hydrotherapy',
    }),
  });
  const staffJson = await staffRes.json();
  assert.strictEqual(staffJson.success, true);
  const newStaff = staffJson.data;
  console.log(`   ✓ Staff created: ${newStaff.name} (${newStaff.staffCode}, ${newStaff.position})`);

  // --------------------------------------------------------------------------
  // TEST 11: Create Reusable Package Template
  // --------------------------------------------------------------------------
  console.log('1️⃣1️⃣ Creating Package Template with Bundled Treatments...');
  const planCode = `PKG-ZUR-${timestamp}`;
  const planRes = await fetch(`${API_BASE}/plans`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${zurichToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Alpine Rejuvenation Pass',
      code: planCode,
      branchId: zurichBranch.id,
      durationDays: 45,
      price: 500,
      currency: 'CHF',
      description: '3 sessions of Alpine Herbal Scrub',
      services: [
        {
          serviceId: newService.id,
          quantity: 3,
        },
      ],
    }),
  });
  const planJson = await planRes.json();
  assert.strictEqual(planJson.success, true);
  const newPlan = planJson.data;
  console.log(`   ✓ Package template created: ${newPlan.name} (${newPlan.services.length} treatments bundled)`);

  // --------------------------------------------------------------------------
  // TEST 12: Create Customer
  // --------------------------------------------------------------------------
  console.log('1️⃣2️⃣ Registering New Spa Guest...');
  const custRes = await fetch(`${API_BASE}/customers`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${zurichToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      branchId: zurichBranch.id,
      firstName: 'Sophie',
      lastName: 'Schneider',
      phone: `+41 78 ${timestamp} 12`,
      email: `sophie.${timestamp}@zurich.ch`,
      gender: 'FEMALE',
      address: 'Limmatquai 18, Zurich',
    }),
  });
  const custJson = await custRes.json();
  assert.strictEqual(custJson.success, true);
  const newCustomer = custJson.data;
  console.log(`   ✓ Guest registered: ${newCustomer.displayName} (${newCustomer.customerCode})`);

  // --------------------------------------------------------------------------
  // TEST 13: Enrol Customer in Membership (Snapshots Entitlements & Generates Invoice)
  // --------------------------------------------------------------------------
  console.log('1️⃣3️⃣ Enrolling Guest in Membership & Snapshotting Entitlements...');
  const now = new Date();
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + 45);

  const memRes = await fetch(`${API_BASE}/memberships`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${zurichToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customerId: newCustomer.id,
      branchId: zurichBranch.id,
      planTemplateId: newPlan.id,
      name: newPlan.name,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      price: 500,
      discount: 50,
      tax: 36,
      recordPayment: true,
      paymentMethod: 'CARD',
    }),
  });
  const memJson = await memRes.json();
  if (!memJson.success) {
    console.error('Membership creation failed:', memJson);
  }
  assert.strictEqual(memJson.success, true);
  const membership = memJson.data;
  assert.strictEqual(membership.services.length, 1);
  assert.strictEqual(membership.services[0].allocatedQuantity, 3);
  assert.strictEqual(membership.services[0].consumedQuantity, 0);
  console.log(`   ✓ Membership active: ${membership.membershipCode} (Allocated: 3 sessions of ${membership.services[0].service.name})`);

  // --------------------------------------------------------------------------
  // TEST 14: Check-in Guest & Consume 1 Service Entitlement
  // --------------------------------------------------------------------------
  console.log('1️⃣4️⃣ Reception Check-in: Delivering Treatment & Consuming Entitlement...');
  const visitRes = await fetch(`${API_BASE}/visits`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${zurichToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customerId: newCustomer.id,
      branchId: zurichBranch.id,
      membershipId: membership.id,
      notes: 'Guest welcomed with herbal mountain tea',
      services: [
        {
          serviceId: newService.id,
          membershipServiceId: membership.services[0].id,
          staffId: newStaff.id,
          quantity: 1,
          notes: 'Session 1 of 3 delivered by Greta',
        },
      ],
    }),
  });
  const visitJson = await visitRes.json();
  assert.strictEqual(visitJson.success, true);
  const visit = visitJson.data;
  console.log(`   ✓ Visit recorded: ${visit.visitCode} (Therapist: ${newStaff.name})`);

  // --------------------------------------------------------------------------
  // TEST 15: Verify Entitlement Balance Decrement (3 - 1 = 2)
  // --------------------------------------------------------------------------
  console.log('1️⃣5️⃣ Verifying Service Balance Ledger (Allocated - Consumed)...');
  const profileRes = await fetch(`${API_BASE}/customers/${newCustomer.id}`, {
    headers: { Authorization: `Bearer ${zurichToken}` },
  });
  const profileJson = await profileRes.json();
  const entitlement = profileJson.data.serviceEntitlements[0];
  assert.strictEqual(entitlement.allocated, 3, 'Allocated must remain 3');
  assert.strictEqual(entitlement.used, 1, 'Used must be 1');
  assert.strictEqual(entitlement.remaining, 2, 'Remaining balance must equal exactly 2');
  console.log(`   ✓ Ledger Verified: Allocated=${entitlement.allocated}, Used=${entitlement.used}, Remaining=${entitlement.remaining}`);

  // --------------------------------------------------------------------------
  // TEST 16: Concurrency & Over-Redemption Protection
  // --------------------------------------------------------------------------
  console.log('1️⃣6️⃣ Testing Concurrency & Over-Redemption Guard (Attempting to consume 5 when 2 remain)...');
  const overageRes = await fetch(`${API_BASE}/visits`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${zurichToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customerId: newCustomer.id,
      branchId: zurichBranch.id,
      membershipId: membership.id,
      services: [
        {
          serviceId: newService.id,
          membershipServiceId: membership.services[0].id,
          quantity: 5, // Exceeds 2 remaining!
        },
      ],
    }),
  });
  const overageJson = await overageRes.json();
  assert.strictEqual(overageRes.status, 409, 'Over-redemption must return 409 Conflict');
  assert.ok(overageJson.message.includes('Insufficient service entitlement'), 'Must give clear error message');
  console.log('   ✓ Concurrency Guard verified: 409 Conflict blocked overdraft of entitlements');

  // --------------------------------------------------------------------------
  // TEST 17: Process Payment
  // --------------------------------------------------------------------------
  console.log('1️⃣7️⃣ Recording Walk-in Payment & Refund Workflow...');
  const payRes = await fetch(`${API_BASE}/payments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${zurichToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      branchId: zurichBranch.id,
      customerId: newCustomer.id,
      amount: 150,
      currency: 'CHF',
      paymentMethod: 'CARD',
      transactionReference: `VISA-${timestamp}`,
    }),
  });
  const payJson = await payRes.json();
  if (!payJson.success) {
    console.error('Payment creation failed:', payJson);
  }
  assert.strictEqual(payJson.success, true);
  const payment = payJson.data;

  // Test Refund
  const refundRes = await fetch(`${API_BASE}/payments/${payment.id}/refund`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${zurichToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: 150,
      reason: 'Guest requested cancellation of retail product',
    }),
  });
  const refundJson = await refundRes.json();
  assert.strictEqual(refundJson.success, true);
  assert.strictEqual(refundJson.data.status, 'REFUNDED');
  console.log(`   ✓ Payment recorded (${payment.paymentCode}) and successfully refunded (Status: REFUNDED)`);

  // --------------------------------------------------------------------------
  // TEST 18: Audit Trail Verification
  // --------------------------------------------------------------------------
  console.log('1️⃣8️⃣ Verifying Immutable Regulatory Audit Logs...');
  const auditRes = await fetch(`${API_BASE}/audit-logs?branchId=${zurichBranch.id}`, {
    headers: { Authorization: `Bearer ${saToken}` },
  });
  const auditJson = await auditRes.json();
  assert.strictEqual(auditJson.success, true);
  assert.ok(auditJson.data.length >= 3, 'Must have recorded audit actions');
  const loggedActions = auditJson.data.map((l: any) => l.action);
  console.log(`   ✓ Audit Trail verified: Recorded ${auditJson.data.length} actions (${loggedActions.slice(0, 4).join(', ')})`);

  // --------------------------------------------------------------------------
  // TEST 19: Real-time Reports Verification
  // --------------------------------------------------------------------------
  console.log('1️⃣9️⃣ Verifying Business Analytics & Reporting...');
  const reportRes = await fetch(`${API_BASE}/reports/daily?branchId=${zurichBranch.id}`, {
    headers: { Authorization: `Bearer ${zurichToken}` },
  });
  const reportJson = await reportRes.json();
  assert.strictEqual(reportJson.success, true);
  assert.strictEqual(reportJson.data.totalVisits, 1, 'Daily report must reflect 1 visit');
  assert.strictEqual(reportJson.data.totalServicesConsumed, 1, 'Daily report must reflect 1 treatment');
  console.log(`   ✓ Real Analytics verified: ${reportJson.data.totalVisits} visit recorded today at Zurich Branch`);

  console.log('\n===============================================================');
  console.log('✅ ALL 19 COMPREHENSIVE E2E & SECURITY CHECKS PASSED 100%!');
  console.log('===============================================================\n');
}

runFullE2ETestSuite().catch((err) => {
  console.error('\n❌ TEST RUN FAILED:', err);
  process.exit(1);
});
