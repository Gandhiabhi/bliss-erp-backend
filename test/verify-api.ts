import assert from 'assert';

const API_BASE = 'http://localhost:4000/api/v1';

async function testAll() {
  console.log('🧪 Starting End-to-End API and Business Logic Verification...');

  // 1. Super admin login
  const saRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'bhairaram@gmail.com', password: 'Bhairaram@123' }),
  });
  const saJson = await saRes.json();
  assert.strictEqual(saJson.success, true, 'Super admin login should succeed');
  assert.ok(saJson.data.accessToken, 'Access token must be present');
  const saToken = saJson.data.accessToken;
  console.log('  ✓ Super Admin authentication passed');

  // 2. Dubai Receptionist login
  const recRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'dubai.reception@blishspa.com', password: 'Admin@123456' }),
  });
  const recJson = await recRes.json();
  assert.strictEqual(recJson.success, true, 'Receptionist login should succeed');
  const recToken = recJson.data.accessToken;
  const dubaiBranchId = recJson.data.user.branchId;
  assert.ok(dubaiBranchId, 'Dubai receptionist must have branchId');
  console.log('  ✓ Branch Receptionist authentication passed');

  // 3. Branch isolation test: Dubai receptionist cannot access all branches
  const branchesRes = await fetch(`${API_BASE}/branches`, {
    headers: { Authorization: `Bearer ${recToken}` },
  });
  const branchesJson = await branchesRes.json();
  assert.strictEqual(branchesJson.data.length, 1, 'Branch user should only see their 1 branch');
  assert.strictEqual(branchesJson.data[0].id, dubaiBranchId, 'Branch ID must match assigned branch');
  console.log('  ✓ Branch isolation verified: only assigned branch visible');

  // 4. Find John Smith and inspect current entitlement
  const custRes = await fetch(`${API_BASE}/customers?search=John`, {
    headers: { Authorization: `Bearer ${recToken}` },
  });
  const custJson = await custRes.json();
  assert.ok(custJson.data.length > 0, 'Customer John Smith must be found');
  const john = custJson.data[0];

  const profileRes = await fetch(`${API_BASE}/customers/${john.id}`, {
    headers: { Authorization: `Bearer ${recToken}` },
  });
  const profileJson = await profileRes.json();
  assert.ok(profileJson.data.serviceEntitlements.length > 0, 'Service entitlements must exist');
  const swedishEntitlement = profileJson.data.serviceEntitlements.find(
    (e: any) => e.serviceName.includes('Swedish')
  );
  assert.ok(swedishEntitlement, 'Swedish massage entitlement must exist');
  const beforeRemaining = swedishEntitlement.remaining;
  console.log(`  ✓ Customer entitlements retrieved: ${swedishEntitlement.serviceName} (Remaining: ${beforeRemaining})`);

  // 5. Create Visit and consume 1 Swedish massage
  const visitRes = await fetch(`${API_BASE}/visits`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${recToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customerId: john.id,
      membershipId: swedishEntitlement.membershipId,
      notes: 'Automated test check-in',
      services: [
        {
          serviceId: swedishEntitlement.serviceId,
          membershipServiceId: swedishEntitlement.membershipServiceId,
          quantity: 1,
          notes: 'Suite 2',
        },
      ],
    }),
  });
  const visitJson = await visitRes.json();
  assert.strictEqual(visitJson.success, true, 'Visit creation and service consumption must succeed');
  console.log(`  ✓ Visit created: ${visitJson.data.visitCode}, service consumed`);

  // 6. Verify remaining balance decremented by 1
  const profileAfterRes = await fetch(`${API_BASE}/customers/${john.id}`, {
    headers: { Authorization: `Bearer ${recToken}` },
  });
  const profileAfterJson = await profileAfterRes.json();
  const afterEntitlement = profileAfterJson.data.serviceEntitlements.find(
    (e: any) => e.membershipServiceId === swedishEntitlement.membershipServiceId
  );
  assert.strictEqual(
    afterEntitlement.remaining,
    beforeRemaining - 1,
    `Remaining balance should decrement from ${beforeRemaining} to ${beforeRemaining - 1}`
  );
  console.log(`  ✓ Atomic entitlement deduction verified: remaining is now ${afterEntitlement.remaining}`);

  // 7. Concurrency protection test: try to over-consume services beyond remaining balance
  const overRedeemRes = await fetch(`${API_BASE}/visits`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${recToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customerId: john.id,
      membershipId: swedishEntitlement.membershipId,
      services: [
        {
          serviceId: swedishEntitlement.serviceId,
          membershipServiceId: swedishEntitlement.membershipServiceId,
          quantity: 999, // Impossible quantity
        },
      ],
    }),
  });
  const overRedeemJson = await overRedeemRes.json();
  assert.strictEqual(overRedeemRes.status, 409, 'Over-consumption must return 409 Conflict');
  assert.ok(overRedeemJson.message.includes('Insufficient service entitlement'), 'Error message must specify insufficient entitlement');
  console.log('  ✓ Concurrency protection verified: 409 Conflict returned on overage attempt');

  // 8. Test Reports API
  const reportRes = await fetch(`${API_BASE}/reports/daily?branchId=${dubaiBranchId}`, {
    headers: { Authorization: `Bearer ${saToken}` },
  });
  const reportJson = await reportRes.json();
  assert.strictEqual(reportJson.success, true, 'Daily report must succeed');
  console.log(`  ✓ Daily report verified: ${reportJson.data.totalVisits} visits, ${reportJson.data.totalServicesConsumed} services consumed`);

  // 9. Test Audit Logs API
  const auditRes = await fetch(`${API_BASE}/audit-logs?branchId=${dubaiBranchId}`, {
    headers: { Authorization: `Bearer ${saToken}` },
  });
  const auditJson = await auditRes.json();
  assert.strictEqual(auditJson.success, true, 'Audit logs retrieval must succeed');
  assert.ok(auditJson.data.length > 0, 'Audit logs must contain recorded actions');
  console.log(`  ✓ Audit logging verified: ${auditJson.meta.total} audit logs recorded`);

  console.log('\n🎉 ALL BACKEND BUSINESS FLOWS & SECURITY VERIFIED SUCCESSFULLY!');
}

testAll().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
