 
 
<template>
  <div class="container">
    <router-link to="/master/home" class="back">&lt;&lt;戻る</router-link>
    <p class="logout-link"><router-link to="/logout">ログアウト</router-link></p>
    <h2>申請</h2>

    <table>
      <thead>
        <tr>
          <th>日付</th>
          <th>名前</th>
          <th>種類</th>
          <th>削除</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in applications" :key="item.id">
          <td>{{ item.date }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.type }}</td>
          <td><button @click="confirmDelete(item.id)">削除</button></td>
        </tr>
      </tbody>
    </table>

    <p class="notice">現在申請はありません</p>

    <div v-if="showDialog" class="dialog">
      <p>削除しますか</p>
      <button @click="deleteApplication">はい</button>
      <button @click="cancelDialog">いいえ</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      applications: [
        { id: 1, date: '6/18', name: 'name', type: '遅刻' }
      ],
      showDialog: false,
      itemToDelete: null
    }
  },
  methods: {
    confirmDelete(id) {
      this.itemToDelete = id
      this.showDialog = true
    },
    deleteApplication() {
      this.applications = this.applications.filter(item => item.id !== this.itemToDelete)
      this.cancelDialog()
    },
    cancelDialog() {
      this.showDialog = false
      this.itemToDelete = null
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
