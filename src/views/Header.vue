<template>
  <header class="global-header">
    <div class="header-inner">
      <h1 class="logo">My App</h1>
      <!-- ✅ 無條件顯示 -->
      <router-link to="/logout" class="logout-link">ログアウト</router-link>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style scoped>
.global-header {
  background-color: #333;
  color: white;
  padding: 15px 20px;
  display: flex;
  align-items: center;
}
.header-inner {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.logo {
  font-size: 20px;
}
.logout-link {
  color: #fff;
  text-decoration: underline;
  cursor: pointer;
}
</style>
