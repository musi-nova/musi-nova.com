export const daysSince = (iso?: string | null) => {
  if (!iso) return null;
  try {
    const then = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return 'Today';
    if (diff === 1) return '1 day ago';
    return `${diff} days ago`;
  } catch (e) {
    return null;
  }
};

export const toShort = (msg: unknown, n = 100) => {
  if (msg === undefined || msg === null) return '';
  const str = String(msg);
  return str.length > n ? str.slice(0, n).trimEnd() + '...' : str;
};
