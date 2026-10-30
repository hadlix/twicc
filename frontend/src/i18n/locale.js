// Kept independent of Vue so standalone authentication pages use the same choice.
export const LOCALE_STORAGE_KEY = 'twicc-locale'
export const SUPPORTED_LOCALES = ['en', 'fr']

export function normalizeLocale(value) {
    return typeof value === 'string' && /^fr(?:-|$)/i.test(value) ? 'fr' : 'en'
}

export function detectLocale() {
    try {
        const saved = globalThis.localStorage?.getItem(LOCALE_STORAGE_KEY)
        if (SUPPORTED_LOCALES.includes(saved)) return saved
    } catch { /* Storage can be unavailable in private or sandboxed contexts. */ }
    return normalizeLocale(globalThis.navigator?.language)
}

export function persistLocale(value) {
    const locale = normalizeLocale(value)
    try { globalThis.localStorage?.setItem(LOCALE_STORAGE_KEY, locale) } catch { /* Still apply for this page. */ }
    if (typeof document !== 'undefined') {
        document.documentElement.lang = locale
        document.cookie = `twicc_locale=${locale}; Path=/; SameSite=Lax`
    }
    return locale
}
