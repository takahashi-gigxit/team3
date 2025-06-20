<template>
  <div class="master-home">
    <!-- 登出連結 -->
    <p class="logout-link">
      <router-link to="/logout">ログアウト</router-link>
    </p>

    <!-- 歡迎語 -->
    <h2>ようこそ（{{ username }}）さん</h2>

    <!-- 功能入口 -->
    <div class="link-group">
      <router-link to="/user/edit" class="link-button">ユーザー編集画面へ</router-link>
      <router-link to="/application/delete" class="link-button">申請削除画面へ</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MasterHome',
  data() {
    return {
      username: localStorage.getItem('username') || 'マスター'
    }
  }
}
</script>

<style scoped>
.master-home {
  border: 2px solid green;
  max-width: 300px;
  margin: 20px auto;
  padding: 20px;
  font-family: sans-serif;
  text-align: center;
}

.logout-link {
  text-align: right;
  font-size: 14px;
  color: #4A97C8;
  margin-bottom: 10px;
}

.link-group {
  margin-top: 30px;
}

.link-button {
  display: block;
  margin: 20px auto;
  font-size: 14px;
  color: #4A97C8;
  text-decoration: underline;
}
</style>
