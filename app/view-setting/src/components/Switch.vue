<script setup lang="ts">
import { reactive, computed } from 'vue';
const state = reactive({ toggle: 'off' });
const handleClick = () => {
  if (state.toggle === 'on') state.toggle = 'off';
  else state.toggle = 'on';
}
const left = computed(() => {
  if (state.toggle === 'on') {
    return 19;
  } else {
    return 1;
  }
})
const bgColor = computed(() => {
  if (state.toggle === 'on') {
    return '#1d953f';
  } else {
    return '#919293';
  }
})
</script>

<template>
  <span class="switch" @click="handleClick" :style="`background-color: ${bgColor}`">
    <div class="switch-track" :style="`transform: translateX(${left}px)`"></div>
  </span>
</template>

<style scoped>
.switch {
  display: inline-block;
  width: 38px;
  height: 20px;
  border-radius: 10px;
  cursor: pointer;
}
.switch-track {
  width: 18px;
  height: 18px;
  border-radius: 9px;
  position: relative;
  top: 1px;
  background-color: #f1f2f3;
  transition: all .15s ease-in-out;
}
</style>
