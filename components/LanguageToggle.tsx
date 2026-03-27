'use client'

import { useRouter } from 'next/navigation'

export function LanguageToggle({ locale }: { locale: string }) {
  const router = useRouter()

  function toggle() {
    const next = locale === 'en' ? 'no' : 'en'
    document.cookie = `locale=${next}; path=/; max-age=31536000; SameSite=Lax`
    router.refresh()
  }

  return (
    <button
      onClick={toggle}
      className="rounded-md border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
      aria-label={locale === 'en' ? 'Switch to Norwegian' : 'Bytt til engelsk'}
    >
      {locale === 'en' ? 'NO' : 'EN'}
    </button>
  )
}
