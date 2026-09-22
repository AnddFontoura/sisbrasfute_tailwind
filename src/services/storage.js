// Resolves a stored file path (e.g. "team_uniforms/abc.jpg") to a full URL.
// Mirrors the convention used across the app (see TeamPlayerEdit.vue):
// - if the value is already an absolute URL, return it as-is;
// - otherwise build `${base}/storage/${path}` from the API/image base env.
export function resolveStorageUrl(pathOrUrl) {
  if (!pathOrUrl) return null

  if (typeof pathOrUrl === 'string' && pathOrUrl.startsWith('http')) {
    return pathOrUrl
  }

  const imgBase = import.meta.env.VITE_IMG_BASE_URL
  const apiBase = import.meta.env.VITE_API_BASE_URL || ''
  // Prefer the dedicated image base; fall back to API base minus "/api".
  const base = (imgBase || apiBase.replace(/\/api\/?$/, '')).replace(/\/$/, '')

  const cleanPath = String(pathOrUrl).replace(/^\/+/, '')
  return `${base}/storage/${cleanPath}`
}
