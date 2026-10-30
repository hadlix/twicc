
import { t as $t } from '../../../i18n/index.js'
// Shared, Vue-free metadata for the dockable layout UI (labels, placement options, edges).
// The pure geometry/rules live in utils/layoutResolver.js; this is presentation-only.

import { DOCKS } from '../../../utils/layoutResolver'
import { resolvePublicAssetUrl } from '../../../utils/publicAsset'

export const CENTER = 'center'

export const DOCK_LABELS = {
    get center() { return $t("Main area") },
    get 'left-top'() { return $t("Left top") },
    get 'left-bottom'() { return $t("Left bottom") },
    get 'right-top'() { return $t("Right top") },
    get 'right-bottom'() { return $t("Right bottom") },
    get 'bottom-left'() { return $t("Bottom left") },
    get 'bottom-right'() { return $t("Bottom right") },
}

// Custom position-hinting icons (PyCharm-style: layout frame + a filled bar where the panel docks).
// Local SVGs in public/icons/docks/, consumed via `<wa-icon src>`. One per placement, unlike the old
// single shared FA glyph that couldn't distinguish the positions.
export const DOCK_ICONS = {
    center: resolvePublicAssetUrl('icons/docks/center.svg'),
    'left-top': resolvePublicAssetUrl('icons/docks/left-top.svg'),
    'left-bottom': resolvePublicAssetUrl('icons/docks/left-bottom.svg'),
    'right-top': resolvePublicAssetUrl('icons/docks/right-top.svg'),
    'right-bottom': resolvePublicAssetUrl('icons/docks/right-bottom.svg'),
    'bottom-left': resolvePublicAssetUrl('icons/docks/bottom-left.svg'),
    'bottom-right': resolvePublicAssetUrl('icons/docks/bottom-right.svg'),
}

// Order shown in the per-tab placement menu: Center first, then the six docks.
export const PLACEMENT_OPTIONS = [CENTER, ...DOCKS]

// Which edge gutter a dock collapses to.
export function edgeOfDock(dockId) {
    if (dockId.startsWith('left-')) return 'left'
    if (dockId.startsWith('right-')) return 'right'
    if (dockId.startsWith('bottom-')) return 'bottom'
    return null
}
