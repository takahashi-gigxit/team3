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
          <td><input v-model="form.username" /></td>
          <td><input v-model="form.password" type="password" /></td>
          <td><input v-model="form.email" type="email" /></td>
          <td><input type="checkbox" v-model="form.isAdmin" /></td>
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

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const userId = ref(null)
const form = ref({
  username: '',
  password: '',
  email: '',
  isAdmin: false
})
const showDialog = ref(false)

const getData = async () => {
  userId.value = route.params.id
  try {
    const res = await axios.get(`http://localhost:8080/master/home/${userId.value}`)
    const userData = res.data

    form.value.username = userData.username
    form.value.password = userData.password
    form.value.email = userData.email
    form.value.isAdmin = userData.category_id === 2
  } catch (error) {
    console.error('ユーザーデータの取得中にエラーが発生しました:', error)
    alert('ユーザーデータの読み込みに失敗しました。')
    router.push('/user/list') 
  }
}

const confirmUpdate = () => {
  showDialog.value = true
}

const updateUser = async () => {
  try {
    const payload = {
      id: userId.value,
      username: form.value.username,
      password: form.value.password,
      email: form.value.email,
      category_id: form.value.isAdmin ? 2 : 0
    }
    await axios.put(`http://localhost:8080/user/edit/${userId.value}`, payload)
    showDialog.value = false
    alert('ユーザー情報が正常に更新されました。')
    router.push('/user/list')
  } catch (error) {
    console.error('ユーザーの更新中にエラーが発生しました:', error)
    alert('ユーザーの更新に失敗しました。')
    if (error.response) {
      console.error('エラーレスポンスデータ:', error.response.data)
      console.error('エラーレスポンスステータス:', error.response.status)
    }
  }
}

const cancelDialog = () => {
  showDialog.value = false
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
  border: 1px solid gray;
  padding: 6px;
  text-align: center;
}
input[type="text"], input[type="password"] {
  width: 100%;
}
.dialog {
  background: gray;
  border: 1px solid gray;
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
