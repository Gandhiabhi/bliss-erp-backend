export function uniqueCode(prefix: string, branchCode?: string | null) {
  const safe = (branchCode || 'MAIN').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8) || 'MAIN';
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${safe}-${stamp}${rand}`;
}
