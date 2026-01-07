import { treaty } from '@elysiajs/eden'
import type { App } from '../app/api/[[...slugs]]/route'

// Prefer env override, then current origin (browser), then localhost.
// Normalize by removing any trailing slash to keep treaty path resolution clean.
const normalizeBase = (value?: string) =>
  value ? value.replace(/\/$/, '') : undefined

const apiBase =
  normalizeBase(process.env.NEXT_PUBLIC_API_URL) ||
  (typeof window !== 'undefined' ? normalizeBase(window.location.origin) : undefined) ||
  'http://localhost:3000'

export const client = treaty<App>(apiBase).api
