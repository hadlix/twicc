import { locale, t } from './index.js'

const editorMessages = [
    'Find', 'Replace', 'next', 'previous', 'all', 'match case', 'regexp', 'by word',
    'replace', 'replace all', 'close', 'Go to line', 'go', 'current match', 'on line',
    'replaced match on line $', 'replaced $ matches', 'No completions', 'Completions',
    'Fold line', 'Unfold line', 'Folded lines', 'Unfolded lines', 'to', 'folded code',
]

export function editorPhrases() {
    return locale.value === 'fr' ? Object.fromEntries(editorMessages.map(message => [message, t(message)])) : {}
}
