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
        <tr v-if="users.length === 0">
          <td colspan="7">現在ユーザーはいません</td>
        </tr>
        <tr v-else v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.password }}</td>
          <td>{{ user.email }}</td>
          <td><input type="checkbox" :checked="user.category_id === 1" disabled /></td>
          <td><button><router-link :to="'/user/edit/' + user.id">編集</router-link></button></td>
          <td><button @click="confirmDelete(user.id)">削除</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const users = ref([])
const showDialog = ref(false)
const userIdToDelete = ref(null)
const router = useRouter()

const getData = async () => {
  try {
    const res = await axios.get('http://localhost:8080/user/list')
    users.value = res.data
  } catch (error) {
    console.error(error)
  }
}

const confirmDelete = (id) => {
  const confirmed = window.confirm("本当に削除しますか？");
  if (confirmed) {
    userIdToDelete.value = id;
    deleteUser();
  }
}

const deleteUser = async () => {
  try {
    const url = `http://localhost:8080/user/delete/${userIdToDelete.value}`
    await axios.delete(url)
    showDialog.value = false
    getData()
  } catch (error) {
    console.error("削除中にエラーが発生しました(削除するユーザーが申請を出している可能性があります):", error)
    if (error.response) {
      console.error("エラーレスポンスデータ:", error.response.data)
      console.error("エラーレスポンスステータス:", error.response.status)
    }
  }
}

const cancelDialog = () => {
  showDialog.value = false
}

const editUser = (id) => {
  router.push(`/user/edit/${id}`)
}

onMounted(getData)
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
