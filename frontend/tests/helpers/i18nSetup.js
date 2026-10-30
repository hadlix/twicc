// Some upstream fixtures execute extracted functions after stripping imports.
// Give those fixtures the real translator; regular modules keep their explicit imports.
import { registerHooks } from 'node:module'
import { t, getFormatLocale } from '../../src/i18n/index.js'

globalThis.$t = t
globalThis.getFormatLocale = getFormatLocale

// Compiled SFC fixtures use data: modules, which have no relative URL base.
// Resolve just the new shared i18n import against its real file location.
const translationUrl = new URL('../../src/i18n/index.js', import.meta.url).href
registerHooks({
    resolve(specifier, context, nextResolve) {
        if (context.parentURL?.startsWith('data:') && /(?:^|\/)i18n\/index\.js$/.test(specifier)) {
            return { url: translationUrl, shortCircuit: true }
        }
        return nextResolve(specifier, context)
    },
})
