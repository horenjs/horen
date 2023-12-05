<script setup lang="ts">
import SettingItem from './SettingItem.vue';
import Switch from './Switch.vue';
</script>

<template>
  <h2>Setting</h2>
  <h3>This is a setting page example</h3>
  <SettingItem label="name" value="my name" />
  <SettingItem label="run at start">
    <Switch />
  </SettingItem>
</template>

<style scoped>
</style>
