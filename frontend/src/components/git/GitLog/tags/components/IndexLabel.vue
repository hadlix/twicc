<script setup lang="ts">
import { t as $t } from '../../../../../i18n/index.js'

import GitIcon from './GitIcon.vue'
</script>

<template>
  <span class="indexLabel">
    {{ $t("index") }}
  </span>
  <GitIcon />
</template>

<style scoped>
.indexLabel {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
