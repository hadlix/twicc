import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { computed, nextTick } from 'vue'
import { t, setLocale, locale, messages, refreshTranslation } from './index.js'
import { detectLocale, normalizeLocale, LOCALE_STORAGE_KEY } from './locale.js'
import { resolveRailItems } from '../utils/sidebarRail.js'
import { PROCESS_STATE, DISPLAY_MODE } from '../constants.js'
import { pluralize, aggregatedBackgroundSuffix } from '../utils/backgroundWork.js'
import { editorPhrases } from './editor.js'

test.afterEach(() => setLocale('en'))

test('French covers every English message and English is exactly its original source', () => {
    assert.deepEqual(Object.keys(messages.fr).sort(), Object.keys(messages.en).sort())
    assert.ok(Object.keys(messages.en).length > 2800)
    for (const [source, english] of Object.entries(messages.en)) {
        assert.equal(english, source)
        assert.equal(typeof messages.fr[source], 'string')
        assert.ok(messages.fr[source].length > 0, source)
        const sourceParameters = new Set(source.match(/\{p\d+\}/g) || [])
        for (const token of messages.fr[source].match(/\{p\d+\}/g) || []) {
            assert.ok(sourceParameters.has(token), `${source}: unknown ${token}`)
        }
    }
})

test('language switching updates computed text and navigation without changing protocol identifiers', async () => {
    const text = computed(() => t('Welcome to TwiCC'))
    const navigation = computed(() => resolveRailItems({ mode: 'home', peerConfigured: false, isMac: false }))
    setLocale('en')
    assert.equal(text.value, 'Welcome to TwiCC')
    const englishIds = navigation.value.map(item => item.id)
    setLocale('fr')
    await nextTick()
    assert.equal(text.value, 'Bienvenue dans TwiCC')
    assert.equal(navigation.value.find(item => item.id === 'home').label, 'Accueil')
    assert.deepEqual(navigation.value.map(item => item.id), englishIds)
    assert.equal(PROCESS_STATE.USER_TURN, 'user_turn')
    assert.equal(DISPLAY_MODE.CONVERSATION, 'conversation')
    setLocale('en')
    assert.equal(navigation.value.find(item => item.id === 'home').label, 'Home')
})

test('parameters retain their content and braces not supplied as parameters remain literal', () => {
    setLocale('fr')
    const name = '<script>alert("user text")</script> {p1}'
    assert.equal(t('Goal: {p0}', { p0: name }), 'Objectif : ' + name)
    assert.equal(t('Allowed: {git_root}, {project_name}, {project_basedir}.'),
        'Variables autorisées : {git_root}, {project_name}, {project_basedir}.')
    assert.equal(t('An unknown message with {literal} braces'), 'An unknown message with {literal} braces')
})

test('existing translated toast labels follow a new language but unknown user content stays untouched', () => {
    setLocale('en')
    const title = t('{p0} CLI not authenticated', { p0: 'Codex' })
    setLocale('fr')
    assert.equal(refreshTranslation(title), 'CLI Codex non authentifiée')
    assert.equal(refreshTranslation('My custom project title'), 'My custom project title')
    assert.equal(pluralize(2, 'background shell'), '2 shells en arrière-plan')
    assert.equal(aggregatedBackgroundSuffix({ shells: 2, crons: 3 }),
        ' (2 shells en arrière-plan, 3 tâches planifiées actives)')
    setLocale('en')
    assert.equal(refreshTranslation(title), 'Codex CLI not authenticated')
})

test('an explicit language is persisted and takes precedence over browser detection', () => {
    const oldStorage = globalThis.localStorage
    const values = new Map()
    globalThis.localStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) }
    try {
        setLocale('fr')
        assert.equal(values.get(LOCALE_STORAGE_KEY), 'fr')
        assert.equal(detectLocale(), 'fr')
        setLocale('en')
        assert.equal(detectLocale(), 'en')
        assert.equal(normalizeLocale('fr-CA'), 'fr')
        assert.equal(normalizeLocale('de'), 'en')
        assert.equal(locale.value, 'en')
    } finally { globalThis.localStorage = oldStorage }
})

test('every built-in help page and tip has a French body and the same availability constraints', () => {
    for (const folder of ['help', 'tips']) {
        const base = new URL(`../../public/${folder}/`, import.meta.url)
        for (const file of readdirSync(base).filter(name => name.endsWith('.md') && name !== 'README.md')) {
            const english = readFileSync(new URL(file, base), 'utf8')
            const french = readFileSync(new URL('fr/' + file, base), 'utf8')
            assert.notEqual(french, english, file)
            const metadata = text => text.split('---')[1].split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('title:'))
            assert.deepEqual(metadata(french), metadata(english), file)
            assert.ok(french.split('---')[2].trim().length > 60, file)
        }
    }
})

test('the French terminal translates display labels and keeps the Delete key code unchanged', () => {
    const source = readFileSync(new URL('../components/terminal/TerminalExtraKeysBar.vue', import.meta.url), 'utf8')
    assert.match(source, /\$t\("DEL"\).*?key: ["']Delete["']/)
    assert.doesNotMatch(source, /(?:get key\(\)|key:)\s*.*?\$t\(/)
})

test('editor controls switch languages without translating search content', () => {
    setLocale('fr')
    assert.equal(editorPhrases().Find, t('Find'))
    assert.notEqual(editorPhrases().Find, 'Find')
    assert.equal(editorPhrases()['replace all'], t('replace all'))
    setLocale('en')
    assert.deepEqual(editorPhrases(), {})
})
