<script setup>
import { t as $t } from '../../i18n/index.js'

import { ref, computed } from 'vue'
import { useMcpStore } from '../../stores/mcp'

const store = useMcpStore()
const busy = ref(false)
const protection = computed(() => store.protection)
const enabled = computed(() => store.config.externalMcpEnabled === true)
const minutes = computed(() => Math.max(1, Math.ceil((protection.value.retryAfter || 0) / 60)))

async function act(action) {
    if (busy.value) return
    busy.value = true
    try { await store.act(action) }
    finally { busy.value = false }
}
</script>

<template>
    <div v-if="enabled || protection.incident" class="mcp-protection">
        <wa-callout v-if="protection.incident" :variant="protection.paused ? 'danger' : 'warning'" size="small">
            <strong>{{ $t("Suspected OAuth abuse") }}</strong>
            <p>{{ protection.incident.reason }}.</p>
            <p v-if="!enabled">{{ $t("External MCP access is off. Enable it in Settings to resume.") }}</p>
            <p v-else-if="protection.paused">
                {{ $t("New registrations and authorization requests are paused for about") }} {{ minutes }} {{ $t("more minutes. Existing connections, token renewals, and requests already in progress remain available.") }}
            </p>
            <p v-else>{{ $t("The temporary protection has ended. New connections are available again.") }}</p>
            <p>
                {{ $t("Recorded in the last 5 minutes:") }} {{ protection.registrations || 0 }} {{ $t("registration attempts,") }}
                {{ protection.authorizations || 0 }} {{ $t("authorization attempts,") }}
                {{ protection.rejections || 0 }} {{ $t("refusals,") }} {{ protection.sources || 0 }} {{ $t("network sources.") }}
                <span v-if="protection.sampleLimited">{{ $t("Traffic exceeded the recording limit; counts are lower bounds.") }}</span>
            </p>
            <wa-button v-if="!protection.paused" size="small" :disabled="busy" @click="act('acknowledge_security')">
                {{ $t("Dismiss alert") }}
            </wa-button>
        </wa-callout>
        <template v-if="enabled">
            <wa-button size="small" variant="danger" appearance="outlined" :disabled="busy" @click="act('suspend')">
                {{ $t("Suspend all external access") }}
            </wa-button>
            <span class="setting-group-hint">
                {{ $t("Preserves authorizations. Re-enable external access manually to resume.") }}
            </span>
        </template>
    </div>
</template>

<style scoped>
.mcp-protection { display: flex; flex-direction: column; align-items: flex-start; gap: var(--wa-space-s); }
p { margin: var(--wa-space-xs) 0; }
</style>
