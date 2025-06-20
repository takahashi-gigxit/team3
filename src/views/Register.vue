<template>
  <div class="login-container">
    <p class="back-link">
      <router-link to="/">&lt;&lt; 戻る</router-link>
    </p>

    <h2 class="title">新規登録画面</h2>

    <form @submit.prevent="handleRegister">
      <input v-model="username" type="text" placeholder="名前" class="input-box" />
      <input v-model="password" type="password" placeholder="パスワード" class="input-box" />
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <button type="submit" class="login-button">ログイン</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    handleRegister() {
      if (this.username && this.password) {
        alert('登録完了')
        this.$router.push('/')
      } else {
        this.errorMessage = 'エラーメッセージです'
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  width: 300px;
  margin: 100px auto;
  text-align: center;
  font-family: sans-serif;
}
.back-link {
  position: fixed;
  top: 100px;
  left: 100px;
  font-size: 14px;
  color: #376380;
  z-index: 1000;
}

.login-container {
  width: 300px;
  margin: 100px auto;
  text-align: center;
  font-family: sans-serif;
}

.input-box {
  width: 100%;
  height: 35px;
  margin-bottom: 10px;
  border: 1px solid black;
  padding: 5px;
  font-size: 16px;
}

.error-message {
  color: red;
  margin-bottom: 10px;
  font-size: 14px;
}

.login-button {
  padding: 5px 20px;
  border: 1px solid black;
  background-color: white;
  cursor: pointer;
}

</style>
