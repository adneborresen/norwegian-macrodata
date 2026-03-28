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
      className="glass-tag px-2.5 py-1 text-xs font-medium transition-colors hover:bg-[rgba(255,255,255,0.08)]"
      aria-label={locale === 'en' ? 'Switch to Norwegian' : 'Bytt til engelsk'}
    >
      {locale === 'en' ? 'NO' : 'EN'}
    </button>
  )
}
