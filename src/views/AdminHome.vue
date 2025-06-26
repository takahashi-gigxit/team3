<template>
  <div class="admin-home">
    <h2 class="title">マイページ（カレンダー）</h2>

    <div class="summary" v-if="username">
      <p>ようこそ、総務の{{ username }}さん！</p>
      <p>本日は {{ today }} です。</p>
    </div>
    <div>
      <Calendar @select-date="goToAttendance" />
    </div>
    <div>
      <router-link to="/admin/approval" class="link-button">申請承認一覧へ</router-link>
    </div>
    

  </div>
</template>

<script>
import Calendar from './Calendar.vue'

export default {
  name: 'UserMain',
  components: {
    Calendar
  },
  data() {
    return {
      username: '', // 将来：ログインユーザー名を取得
      today: new Date().toLocaleDateString('ja-JP')
    }
  },

  methods: {
    goToAttendance(dateStr) {
      this.$router.push({ path: '/attendance', query: { date: dateStr } })
    }
  },
mounted() {
  const userStr = localStorage.getItem('user');
  const user = JSON.parse(userStr);
  this.username  = user.username;
  console.log(user);
  }
}
</script>

<style scoped>
.user-main {
  padding: 20px;
  font-family: sans-serif;
  background-color: #f9f9f9;
  min-height: 100vh;
}
.title {
  font-size: 24px;
  margin-bottom: 10px;
}
.summary {
  background-color: white;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
}
.link-button {
  display: block;
  margin: 20px auto;
  font-size: 14px;
  color: #4A97C8;
  text-decoration: underline;
}
</style>
