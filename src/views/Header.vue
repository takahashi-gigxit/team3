<template>
  <header class="global-header">
    <div class="header-inner">
      <h1 class="logo">My App</h1>
      <button @click="showDialog = true" class="logout-link">ログアウト</button>
    </div>

    <!-- ✅ 確認浮窗 -->
    <div v-if="showDialog" class="dialog-overlay">
      <div class="dialog-box">
        <h2 class="dialog-title">本当にログアウトしますか？</h2>
        <div class="dialog-actions">
          <button class="confirm-button" @click="logout">確認</button>
          <button class="cancel-button" @click="showDialog = false">キャンセル</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      showDialog: false
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('loggedIn')
      this.showDialog = false
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.h2 {
  font-size: 24px;
  color: rgb(216, 28, 28);
  margin: 0;
  padding: 20px;
}

.global-header {
  background-color: #333;
  color: white;
  padding: 15px 20px;
}
.header-inner {
  display: flex;
  justify-content: space-between;
}
.logout-link {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  text-decoration: underline;
  font-size: 16px;
}

/* 浮窗樣式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
}
.dialog-box {
  background-color: white;
  padding: 20px;
  width: 280px;
  margin: 200px auto;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
.dialog-title {
  font-size: 16px;
  margin-bottom: 20px;
}
.dialog-actions {
  display: flex;
  justify-content: space-around;
}
.confirm-button {
  background-color: #007acc;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
}
.cancel-button {
  background-color: #ccc;
  color: black;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
}
</style>
