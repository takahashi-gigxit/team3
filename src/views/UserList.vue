
<template>
  <div class="container">
    <router-link to="/master/home" class="back">&lt;&lt;戻る</router-link>
    <p class="logout-link"><router-link to="/logout">ログアウト</router-link></p>
    <h2>ユーザー一覧画面</h2>

    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Pass</th>
          <th>Email</th>
          <th>admin</th>
          <th>編集</th>
          <th>削除</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.pass }}</td>
          <td>{{ user.email }}</td>
          <td><input type="checkbox" v-model="user.admin" disabled /></td>
          <td><button @click="editUser(user.id)">編集</button></td>
          <td><button @click="confirmDelete(user.id)">削除</button></td>
        </tr>
      </tbody>
    </table>

    <p class="notice">現在ユーザーはいません<br />IDやPasswordを出す必要があるか。Admin付与はチェックボックスで管理するか。マスターの情報は表示させるか。</p>

    <div v-if="showDialog" class="dialog">
      <p>削除しますか</p>
      <button @click="deleteUser">はい</button>
      <button @click="cancelDialog">いいえ</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [
        { id: 1, name: 'Taro', pass: '1234', email: '', admin: false },
        { id: 2, name: 'Jiro', pass: '5678', email: '', admin: true }
      ],
      showDialog: false,
      userToDelete: null
    }
  },
  methods: {
    editUser(id) {
      this.$router.push({ name: 'UserEdit', query: { id } })
    },
    confirmDelete(id) {
      this.userToDelete = id
      this.showDialog = true
    },
    deleteUser() {
      this.users = this.users.filter(user => user.id !== this.userToDelete)
      this.cancelDialog()
    },
    cancelDialog() {
      this.showDialog = false
      this.userToDelete = null
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
.notice {
  color: #555;
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

