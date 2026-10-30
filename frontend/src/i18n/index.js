import { readonly, ref } from 'vue'
import en from './en.json' with { type: 'json' }
import fr from './fr.json' with { type: 'json' }
import { detectLocale, persistLocale, normalizeLocale, LOCALE_STORAGE_KEY } from './locale.js'

const currentLocale = ref(detectLocale())
export const locale = readonly(currentLocale)
export const messages = { en, fr }
const renderedMessages = new Map()

// Source messages are the keys: English remains byte-for-byte the original text.
// Only supplied parameters are substituted, so literal braces in code examples survive.
export function t(source, parameters = {}) {
    // A default prop or an error may already contain a message rendered earlier.
    if (!Object.hasOwn(en, source) && renderedMessages.has(source)) {
        const original = renderedMessages.get(source)
        source = original.source
        parameters = original.parameters
    }
    const catalog = messages[currentLocale.value]
    const message = Object.hasOwn(catalog, source) ? catalog[source] : source
    const result = String(message).replace(/\{(\w+)\}/g, (token, key) =>
        Object.hasOwn(parameters, key) ? String(parameters[key]) : token)
    if (Object.hasOwn(en, source)) {
        renderedMessages.set(result, { source, parameters })
        if (renderedMessages.size > 3000) renderedMessages.delete(renderedMessages.keys().next().value)
    }
    return result
}

// Refresh only UI text produced by t(), never arbitrary user or provider content.
export function refreshTranslation(value) {
    currentLocale.value
    const original = renderedMessages.get(value)
    return original ? t(original.source, original.parameters) : value
}

export function setLocale(value) {
    currentLocale.value = persistLocale(value)
}

export function getFormatLocale() {
    // Preserve the browser's original English-mode date/number formatting.
    return currentLocale.value === 'fr' ? 'fr-FR' : (globalThis.navigator?.language || 'en')
}

if (typeof document !== 'undefined') document.documentElement.lang = currentLocale.value
if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
        if (event.key === LOCALE_STORAGE_KEY) {
            currentLocale.value = event.newValue ? normalizeLocale(event.newValue) : detectLocale()
            document.documentElement.lang = currentLocale.value
        }
    })
}
