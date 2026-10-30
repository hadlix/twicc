<script setup>
import { t as $t } from '../../i18n/index.js'

import { computed } from 'vue'
import AppTooltip from '../ui/AppTooltip.vue'
import { localPresence } from '../../utils/presence'

const props = defineProps({
    status: {
        type: String,
        required: true,
        validator: (value) => ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'].includes(value)
    }
})

const statusConfig = {
    OPEN: { get label() { return $t("Connected") }, color: 'var(--wa-color-success)' },
    CONNECTING: { get label() { return $t("Connecting...") }, color: 'var(--wa-color-warning)' },
    CLOSING: { get label() { return $t("Disconnecting...") }, color: 'var(--wa-color-warning)' },
    CLOSED: { get label() { return $t("Disconnected") }, color: 'var(--wa-color-danger)' }
}

const config = computed(() => {
    const base = statusConfig[props.status] || statusConfig.CLOSED
    // Connected but no human active at this client → blue instead of green, with
    // an "(Away)" hint in the tooltip. Lets you confirm the presence signal (used
    // to suppress auto "mark as read" on an unattended device) is working. Other
    // states keep their own color.
    if (props.status === 'OPEN' && !localPresence.value) {
        return { get label() { return $t("{p0} (Away)", { p0: (base.label) }) }, color: 'var(--wa-color-blue-60)' }
    }
    return base
})
</script>

<template>
    <div id="connection-indicator" class="connection-indicator">
        <span class="indicator-dot" :style="{ backgroundColor: config.color }"></span>
    </div>
    <AppTooltip for="connection-indicator">{{ $t("WebSocket:") }} {{ config.label }}</AppTooltip>
</template>

<style scoped>
.connection-indicator {
    position: fixed;
    top: var(--wa-space-2xs);
    left: var(--wa-space-2xs);
    z-index: 1000;
}

.indicator-dot {
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
}
</style>
