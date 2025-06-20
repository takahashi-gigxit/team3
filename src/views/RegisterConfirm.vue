<template>
  <div class="confirm-container">
    <router-link to="/register" class="back-link">« 戻る</router-link>

    <h2 class="title">登録確認画面</h2>

    <div class="info-box">
      <p>名前</p>
      <p>パスワード</p>
    </div>

    <p class="confirm-text">以上の内容で登録しますか？</p>

    <button @click="showDialog = true" class="confirm-button">完了</button>

    <!-- 登録完了ダイアログ -->
    <div v-if="showDialog" class="dialog-overlay">
      <div class="dialog-box">
        <p class="dialog-title">登録完了しました！</p>
        <button @click="goToLogin" class="ok-button">確認</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showDialog: false
    }
  },
  methods: {
    goToLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.confirm-container {
  width: 300px;
  margin: 50px auto;
  text-align: center;
  font-family: sans-serif;
}
.back-link {
  display: block;
  text-align: left;
  margin-bottom: 10px;
  font-size: 13px;
}
.title {
  font-size: 18px;
  margin-bottom: 20px;
}
.info-box p {
  font-size: 16px;
  margin: 10px 0;
}
.confirm-text {
  margin-top: 20px;
  font-size: 14px;
}
.confirm-button {
  margin-top: 15px;
  padding: 5px 20px;
  border: 1px solid black;
  background-color: white;
  cursor: pointer;
}

/* 登録完了ダイアログ */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
}
.dialog-box {
  background-color: white;
  border: 2px solid black;
  width: 250px;
  margin: 150px auto;
  padding: 20px;
  text-align: center;
}
.dialog-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
}
.ok-button {
  background-color: #007acc;
  color: white;
  border: none;
  padding: 6px 16px;
  cursor: pointer;
}
</style>
