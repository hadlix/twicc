<script setup>
import { t as $t } from '../../i18n/index.js'

defineProps({ item: { type: Object, default: null } })
function review() { window.dispatchEvent(new CustomEvent('twicc:open-mcp-manager')) }
</script>

<template>
    <div>
        <p>{{ $t("New OAuth requests are temporarily paused. Review the alert in MCP connections.") }}</p>
        <wa-button size="small" variant="brand" @click="review">{{ $t("Review") }}</wa-button>
    </div>
</template>
