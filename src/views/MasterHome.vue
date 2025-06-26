<template>
  <div class="master-home">
    <p class="logout-link">
      <router-link to="/logout">ログアウト</router-link>
    </p>

    <h2>ようこそ（{{ master.username }}）さん</h2>

    <div class="link-group">
      <router-link to="/user/list" class="link-button">ユーザー一覧画面へ</router-link>
      <router-link to="/applicationlist" class="link-button">申請一覧画面へ</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const master = ref({})

const getData = async () => {
  try {
    const res = await axios.get('http://localhost:8080/user/list')
    const users = res.data
    console.log("これから探します")

    const foundMaster = users.find(user => user.category_id === 2)
    if (foundMaster) {
      master.value = foundMaster
    } else {
      console.warn('カテゴリーID 2 のマスターユーザーが見つかりませんでした。')
    }

  } catch (error) {
    console.error('データの取得中にエラーが発生しました:', error)
  }
}

onMounted(getData)
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