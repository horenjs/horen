<script setup lang="ts">
import { computed } from 'vue';
const { label, value } = defineProps<{ label: string, value?: string | number | Function }>();
const finalValue = computed(() => {
  return value;
})
</script>

<template>
  <div class="setting-item">
    <div class="label">{{ label }}</div>
    <div class="value">{{ finalValue }}</div>
    <div class="slot">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.setting-item {
  margin: 8px 0;
}
.label,.value {
  display: inline-block;
}
.label {
  width: 120px;
  color: #636364;
}
.slot {
  display: inline-block;
  vertical-align: middle;
}
</style>