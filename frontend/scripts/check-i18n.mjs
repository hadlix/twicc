import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { resolve, relative } from 'node:path'
import { parse as parseSfc } from '@vue/compiler-sfc'
import { parse as parseTemplate } from '@vue/compiler-dom'
import { parse as parseJs } from '@babel/parser'

const root = resolve(import.meta.dirname, '../src')
const en = JSON.parse(readFileSync(resolve(root, 'i18n/en.json'), 'utf8'))
const fr = JSON.parse(readFileSync(resolve(root, 'i18n/fr.json'), 'utf8'))
assert.deepEqual(Object.keys(fr).sort(), Object.keys(en).sort())
for (const [key, value] of Object.entries(en)) assert.equal(value, key, `English changed: ${key}`)

const errors = []
const technical = text => !/[A-Za-z]/.test(text) || /^(?:https?:|ntfy:|\/|\{git_root\}|feature\/)/.test(text) || /^[\w.-]+\.example\.com$/.test(text)
const attributes = new Set(['label', 'title', 'placeholder', 'aria-label', 'alt', 'help-text', 'description', 'summary'])
function checkJs(source, file) {
    let tree
    try { tree = parseJs(source, { sourceType: 'module', plugins: ['typescript'], allowReturnOutsideFunction: true }) }
    catch { return } // SFC expression fragments are checked by Vue's template compiler at build time.
    function walk(node, parent) {
        if (!node || typeof node !== 'object') return
        if (node.type === 'CallExpression' && ['$t', 't'].includes(node.callee?.name)) {
            const message = node.arguments[0]
            if (message?.type === 'StringLiteral' && !Object.hasOwn(en, message.value)) {
                errors.push(`${file}: missing message ${JSON.stringify(message.value)}`)
            }
            if (parent?.type === 'SwitchCase' && parent.test === node) errors.push(`${file}: translated switch identifier`)
        }
        if (node.type === 'ObjectMethod' && node.kind === 'get' && ['key', 'id', 'type', 'value', 'method', 'provider'].includes(node.key?.name)) {
            if (/\$t\(/.test(source.slice(node.start, node.end))) errors.push(`${file}: translated protocol field ${node.key.name}`)
        }
        for (const [key, value] of Object.entries(node)) {
            if (['loc', 'extra', 'comments', 'leadingComments', 'trailingComments', 'innerComments'].includes(key)) continue
            if (Array.isArray(value)) value.forEach(child => walk(child, node))
            else if (value && typeof value === 'object') walk(value, node)
        }
    }
    walk(tree, null)
}
function checkTemplate(source, file) {
    function walk(node, parents = []) {
        if (node.type === 2 && !parents.some(p => ['pre', 'code', 'script', 'style'].includes(p.tag))) {
            const text = node.content.trim()
            if (!technical(text) && !['English', 'Français'].includes(text)) errors.push(`${file}: untranslated text ${JSON.stringify(text)}`)
        }
        if (node.type === 1) for (const prop of node.props) {
            if (prop.type === 6 && attributes.has(prop.name) && prop.value && !technical(prop.value.content)) {
                errors.push(`${file}: untranslated ${prop.name} ${JSON.stringify(prop.value.content)}`)
            }
            if (prop.type === 7 && prop.exp) checkJs('(' + prop.exp.content + ')', file)
        }
        if (node.type === 5) checkJs('(' + node.content.content + ')', file)
        for (const child of node.children || []) walk(child, [...parents, node])
    }
    walk(parseTemplate(source))
}
function scan(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const file = resolve(dir, entry.name)
        if (entry.isDirectory()) { if (entry.name !== 'i18n') scan(file); continue }
        if (!/\.(js|vue)$/.test(file) || file.endsWith('.test.js')) continue
        const source = readFileSync(file, 'utf8'), name = relative(root, file)
        if (file.endsWith('.vue')) {
            const { descriptor } = parseSfc(source)
            if (descriptor.template) checkTemplate(descriptor.template.content, name)
            for (const block of [descriptor.script, descriptor.scriptSetup]) if (block) checkJs(block.content, name)
        } else checkJs(source, name)
    }
}
scan(root)
if (errors.length) {
    console.error(errors.join('\n'))
    process.exitCode = 1
} else console.log(`i18n: ${Object.keys(en).length} messages; matching catalogues; original English preserved; no untranslated template labels or translated protocol fields.`)
