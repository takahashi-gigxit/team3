<template>
  <div>
    <h2>申請一覧（ユーザーID: {{ userId }}）</h2>
    <div v-if="applications.length === 0">申請がありません。</div>
    <ul>
      <li
        v-for="app in applications"
        :key="app.requestId"
        @click="goToAttendance(app.date)"
        style="cursor:pointer; padding: 10px; border-bottom: 1px solid #ccc;"
      >
        <p>申請内容：{{ app.content }}</p>
        <p>申請日：{{ app.date }}</p>
        <p>状態：{{ app.status }}</p>
        <p>理由：{{ app.reason }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'UserAppList',
  data() {
    return {
      userId: null,
      applications: []
    }
  },
  mounted() {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        this.userId = user.id
        this.fetchApplications()
      } catch (err) {
        console.error('ユーザー情報の解析に失敗しました:', err)
      }
    } else {
      console.warn('ユーザー情報が見つかりません')
    }
  },
  methods: {
    fetchApplications() {
      if (!this.userId) return
      fetch(`http://localhost:8080/user/request/user/details/${this.userId}`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
          return res.json()
        })
        .then(data => {
          // APIから既に必要なデータが整形されているので、そのまま格納
          this.applications = data
          console.log(data);
        })
        .catch(err => {
          console.error('申請一覧取得エラー:', err)
        })
    },
    goToAttendance(date) {
      this.$router.push({ name: 'AttendanceWithDate', params: { date } })
    }
  }
}
</script>

<style scoped>
.attendance-page {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 14px;
}

.back-link, .logout {
  all: unset;
  cursor: pointer;
}

.title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 30px;
}

.loading {
  text-align: center;
  font-size: 16px;
  color: #666;
}

.no-data {
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 20px 0;
}

.request-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.request-item {
  background-color: #fafafa;
  border-radius: 8px;
  padding: 15px 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  transition: box-shadow 0.2s ease;
  cursor: pointer;
  outline: none;
}

.request-item:hover,
.request-item:focus {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.request-item p {
  margin: 6px 0;
  font-size: 15px;
}

.request-item strong {
  color: #333;
}

li:hover {
  background-color: #f0f0f0;
}
</style>