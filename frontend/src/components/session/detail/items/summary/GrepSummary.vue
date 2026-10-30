<script setup>
import { t as $t } from '../../../../../i18n/index.js'

defineProps({
    pattern: { type: String, default: null },
    fileType: { type: String, default: null },
    path: { type: String, default: null },
    pathIconSrc: { type: String, default: null },
})
</script>

<template>
    <span class="items-details-summary-description grep-summary">
        <code v-if="pattern">{{ pattern }}</code>
        <span v-if="fileType"><span class="grep-connector">{{ $t("in") }}</span> <code>{{ fileType }}</code> <span class="grep-connector">{{ $t("files") }}</span></span>
        <span v-if="path"><span class="grep-connector">{{ $t("in") }}</span>
            <span v-if="pathIconSrc" class="items-details-summary-file">
                <img :src="pathIconSrc" class="items-details-summary-file-icon" loading="lazy" width="16" height="16" />
                <span>{{ path }}</span>
            </span>
            <span v-else>{{ path }}</span>
        </span>
    </span>
</template>

<style scoped>
.grep-summary {
    display: inline-flex;
    align-items: center;
    gap: var(--wa-space-xs);
    flex-wrap: wrap;
    & > span {
        display: inline-flex;
        align-items: center;
        gap: var(--wa-space-xs);
    }
    code {
        font-size: 1em;
        background: var(--wa-color-neutral-fill-quiet);
        border-radius: var(--wa-border-radius-s);
    }
}
.grep-connector {
    white-space: nowrap;
    flex-shrink: 0;
}
</style>
