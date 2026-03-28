import { cookies, headers } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'

function detectLocale(acceptLanguage: string | null): 'no' | 'en' {
  if (!acceptLanguage) return 'en'
  const preferred = acceptLanguage
    .split(',')
    .map((s) => (s.split(';')[0] ?? s).trim().toLowerCase())
  return preferred.some((lang) => lang === 'no' || lang.startsWith('nb') || lang.startsWith('nn'))
    ? 'no'
    : 'en'
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('locale')?.value
  const locale: 'no' | 'en' =
    cookie === 'no' || cookie === 'en'
      ? cookie
      : detectLocale((await headers()).get('accept-language'))

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default as Record<string, unknown>,
  }
})
