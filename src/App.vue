<template>
  <div class="app">
    <editor-layout />
  </div>
</template>

<script>
import EditorLayout from './layouts/EditorLayout.vue';

export default {
  name: 'App',
  components: {
    EditorLayout
  }
};
</script>

<style>
/* 全局样式已在 assets/main.css 中定义 */
</style>