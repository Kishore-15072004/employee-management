export function formatRole(role = '') {
  return role.toLowerCase().replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function initials(value = '') {
  return value.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

// APIs may return a bare array or a wrapper such as Spring's Page ({ content: [...] }).
export function toList(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];
  for (const key of ['content', 'data', 'items', 'records', 'results', 'rows']) {
    if (Array.isArray(payload[key])) return payload[key];
  }
  return [];
}

const ISO_DATETIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

// Turns any API value into something safe and readable inside a table cell.
export function displayValue(value) {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (typeof value === 'string') {
    if (ISO_DATETIME.test(value)) {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
    }
    return value;
  }
  if (Array.isArray(value)) return value.length ? value.map(displayValue).join(', ') : '—';
  if (typeof value === 'object') return value.name ?? value.title ?? value.label ?? value.username ?? JSON.stringify(value);
  return String(value);
}
