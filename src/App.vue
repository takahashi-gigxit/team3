<script setup>
import Header from './views/Header.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <Header />           <!-- ✅ 全局 Header -->
    <main class="page-content">
      <RouterView />     <!-- ✅ 這裡會根據路由動態切換內容 -->
    </main>
  </div>
</template>

<style scoped>
.app-container {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px;
}
</style>
