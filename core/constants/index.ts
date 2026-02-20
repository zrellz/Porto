export const cookie = {
  CSRF: 'x-csrf-token',
  CALLBACK: 'x-callback-token',
  TOKEN: 'x-access-token',
  HOST: 'x-host-token',
  SETTING: 'x-access-setting',
  ROLE: 'x-role-token',
  GUARD: 'x-guard-token',
}
export const URL_PATHS = {
  ACCOUNT_ACTIVATION: 'auth/activate',
  RESET_PASSWORD: 'auth/reset-password',
  EMAIL_CHANGE: 'auth/email-change',
}

export const DAYS_OF_WEEK: string[] = [
  'Minggu', // 0
  'Senin', // 1
  'Selasa', // 2
  'Rabu', // 3
  'Kamis', // 4
  "Jum'at", // 5
  'Sabtu', // 6
]

export const INVOICE_TIMEOUT = {
  SECOND: 60 * 60,
  MINUTE: 60,
  HOUR: 1,
}
// VAT 11%
export const VAT = 11

export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return ''
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // // reference for render.com
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`
  }

  // assume localhost
  return `http://127.0.0.1:${process.env.PORT ?? 3000}`
}

export const Access = {
  ROLE: {
    READ: { action: 'read', subject: 'role' },
    CREATE: { action: 'create', subject: 'role' },
    UPDATE: { action: 'update', subject: 'role' },
    DELETE: { action: 'delete', subject: 'role' },
  },
  ACCOUNT: {
    READ: { action: 'read', subject: 'user' },
    CREATE: { action: 'create', subject: 'user' },
    UPDATE: { action: 'update', subject: 'user' },
    DELETE: { action: 'delete', subject: 'user' },
  },
  EMPLOYEE: {
    READ: { action: 'read', subject: 'employee' },
    CREATE: { action: 'create', subject: 'employee' },
    UPDATE: { action: 'update', subject: 'employee' },
    DELETE: { action: 'delete', subject: 'employee' },
  },
  DEVICE: {
    READ: { action: 'read', subject: 'device' },
    CREATE: { action: 'create', subject: 'device' },
    UPDATE: { action: 'update', subject: 'device' },
    DELETE: { action: 'delete', subject: 'device' },
  },
  TRACKER: {
    READ: { action: 'read', subject: 'device' },
    CREATE: { action: 'create', subject: 'device' },
    UPDATE: { action: 'update', subject: 'device' },
    DELETE: { action: 'delete', subject: 'device' },
  },
  LAYOUT: {
    READ: { action: 'read', subject: 'layout' },
    CREATE: { action: 'create', subject: 'layout' },
    UPDATE: { action: 'update', subject: 'layout' },
    DELETE: { action: 'delete', subject: 'layout' },
  },
  REPORT: {
    READ: { action: 'read', subject: 'report' },
  },
}

export const OFFLINE_TOLERANCE_DIFF = 20000
