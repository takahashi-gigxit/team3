
<template>
  <div class="container">
    <router-link to="/user/list" class="back">&lt;&lt;戻る</router-link>
    <p class="logout-link"><router-link to="/logout">ログアウト</router-link></p>
    <h2>ユーザー編集画面</h2>

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Pass</th>
          <th>Email</th>
          <th>admin</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><input v-model="form.name" /></td>
          <td><input v-model="form.pass" /></td>
          <td><input v-model="form.email" /></td>
          <td><input type="checkbox" v-model="form.admin" /></td>
        </tr>
      </tbody>
    </table>

    <button @click="confirmUpdate">更新</button>

    <div v-if="showDialog" class="dialog">
      <p>更新しますか</p>
      <button @click="updateUser">はい</button>
      <button @click="cancelDialog">いいえ</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: 'taro',
        pass: '1234',
        email: '',
        admin: false
      },
      showDialog: false
    }
  },
  methods: {
    confirmUpdate() {
      this.showDialog = true
    },
    updateUser() {
      // 保存ロジックをここに追加
      this.cancelDialog()
      alert('更新しました')
    },
    cancelDialog() {
      this.showDialog = false
    }
  }
}
</script>

<style scoped>
.container {
  border: 2px solid green;
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  font-family: sans-serif;
  position: relative;
}
.back {
  display: inline-block;
  margin-bottom: 10px;
}
.logout-link {
  position: absolute;
  right: 20px;
  top: 10px;
  font-size: 14px;
  color: #4a97c8;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
th, td {
  border: 1px solid #ccc;
  padding: 6px;
  text-align: center;
}
input[type="text"], input[type="password"] {
  width: 100%;
}
.dialog {
  background: #fff;
  border: 1px solid #ccc;
  padding: 20px;
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  z-index: 1000;
}
.dialog button {
  margin: 10px;
}
</style>
