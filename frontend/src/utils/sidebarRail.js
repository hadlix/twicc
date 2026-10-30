
import { t as $t } from '../i18n/index.js'
import { ARTIFACT_ICON } from './artifactBookmark.js'

export const OPEN_SIDEBAR_LABEL = 'Open sidebar (Alt+Shift+B)'
export const CLOSE_SIDEBAR_LABEL = 'Close sidebar (Alt+Shift+B)'

export const RAIL_ITEM_DEFINITIONS = [
    { id: 'home', icon: 'house', label: state => state.mode === 'home' ? $t('Home') : $t("Back to projects list"), group: 'top' },
    { id: 'sessions', icon: 'comments', get label() { return $t("Sessions") }, group: 'top' },
    { id: 'artifacts', icon: ARTIFACT_ICON, get label() { return $t("Artifacts") }, group: 'top' },
    {
        id: 'search',
        requires: state => state.mode === 'sessions',
        icon: 'magnifying-glass',
        label: state => state.isMac ? $t("Full-text search (⌘⇧F)") : $t("Full-text search (Ctrl+Shift+F)"),
        group: 'top',
    },
    { id: 'new-session', icon: 'plus', get label() { return $t("New session") }, group: 'bottom' },
    {
        id: 'palette',
        icon: 'bars-staggered',
        label: state => state.isMac ? $t("Open command palette (⌘K)") : $t("Open command palette (Ctrl+K)"),
        group: 'bottom',
    },
    {
        id: 'inbox',
        icon: 'envelope',
        get label() { return $t("Peer inbox") },
        group: 'bottom',
        requires: state => state.peerConfigured,
        badge: state => state.inboxCount,
    },
    { id: 'settings', icon: 'gear', get label() { return $t("Settings") }, group: 'bottom' },
    {
        id: 'toggle',
        requires: state => state.mode !== 'home',
        icon: 'angles-left',
        label: state => $t(state.sidebarOpen ? CLOSE_SIDEBAR_LABEL : OPEN_SIDEBAR_LABEL),
        group: 'bottom',
    },
]

/** Resolve visible rail items without changing the definitions or state. */
export function resolveRailItems(state, definitions = RAIL_ITEM_DEFINITIONS) {
    const items = definitions
        .filter(definition => {
            const visibleWhen = definition.visibleWhen ?? 'always'
            const visible = visibleWhen === 'always'
                || (visibleWhen === 'open' && state.sidebarOpen)
                || (visibleWhen === 'closed' && !state.sidebarOpen)
            return visible && (!definition.requires || definition.requires(state))
        })
        .map(definition => {
            const { id, icon, label, group, visibleWhen = 'always', disabled = false, badge } = definition
            return {
                id,
                icon: id === 'toggle' ? (state.sidebarOpen ? 'angles-left' : 'angles-right') : icon,
                label: typeof label === 'function' ? label(state) : label,
                group,
                visibleWhen,
                active: ['home', 'sessions', 'artifacts'].includes(id) ? state.mode === id : undefined,
                disabled,
                ...(badge ? { badge: badge(state) } : {}),
            }
        })

    return [
        ...items.filter(item => item.group === 'top' && item.id !== 'toggle'),
        ...items.filter(item => item.group === 'bottom' && item.id !== 'toggle'),
        ...items.filter(item => item.id === 'toggle'),
    ]
}
