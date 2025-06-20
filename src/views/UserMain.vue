<template>
  <div class="admin-home">

    <h2>{{ username }} さん、ようこそ</h2>
    <h3>勤怠管理</h3>

    <!-- ログアウトリンク -->
    <router-link to="/logout" class="logout-link">ログアウト</router-link>



    <!-- カレンダーコンポーネント -->
    <Calendar @select-date="goToAttendance" />

    <!-- 申請承認リンク -->
    <router-link to="/admin/approval" class="link-button">申請承認一覧へ＞＞</router-link>
  </div>
</template>

<script>
import Calendar from './Calendar.vue'

export default {
  name: 'AdminHome',
  components: {
    Calendar
  },
  data() {
    return {
      username: localStorage.getItem('username') || 'ゲスト'
    }
  },
  methods: {
    goToAttendance(dateStr) {
      if (!dateStr) return
      this.$router.push({ path: '/attendance', query: { date: dateStr } })
    }
  }
}
</script>


<style scoped>
.admin-home {
  font-family: sans-serif;
  max-width: 320px;
  margin: auto;
  text-align: center;
}
.logout-link {
  text-align: right;
  font-size: 14px;
  color: #4a97c8;
  display: block;
}
.link-button {
  margin-top: 20px;
  display: inline-block;
  font-size: 14px;
  color: #007acc;
  text-decoration: underline;
}
</style>
