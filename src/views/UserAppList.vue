<template>
  <div class="attendance-page">
    <h2 class="title">申請一覧</h2>
    <div class="header">
      <router-link class="back-link" to="/main">&lt;&lt; 戻る</router-link>
      <router-link class="logout" to="/logout">ログアウト</router-link>
    </div>

    <div v-if="applications.length === 0">申請がありません。</div>
    <div class="filters">
      <!-- 申請内容セレクト -->
      <label>
        申請内容：
        <select v-model="selectedFilter">
          <option value="全て">全て</option>
          <option v-for="type in filterTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </label>

      <!-- 月セレクト -->
      <label>
        申請月：
        <select v-model="selectedMonth">
          <option value="全て">全て</option>
          <option v-for="m in 12" :key="m" :value="String(m).padStart(2, '0')">{{ m }}月</option>
        </select>
      </label>
    </div>
    <ul class="no-bullet">
      <li
        v-for="app in filteredApplications"
        :key="app.requestId"
        @click="goToAttendance(app.date)"
        style="cursor:pointer; padding: 10px; border-bottom: 1px solid #ccc;"
      >
        <p>申請内容：{{ app.content }}</p>
        <p>申請日：{{ app.date }}</p>
        <p>状態：{{ app.status }}</p>
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
      applications: [],
      selectedFilter: '全て',
      selectedMonth: '全て',
      filterTypes: ['有給', '欠勤', '遅刻', '早退'],
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
  computed: {
    filteredApplications() {
      return this.applications.filter(app => {
        const contentMatch =
          this.selectedFilter === '全て' || app.content.includes(this.selectedFilter);

        const monthMatch =
          this.selectedMonth === '全て' ||
          (app.date && app.date.slice(5, 7) === this.selectedMonth); // dateが"2025-03-15" → "03"

          return contentMatch && monthMatch;
      });
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
  text-decoration: none;
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

.title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.no-bullet {
  list-style: none;
  padding: 0;
  margin: 0 auto;
  max-width: 600px;
}

.header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 10px;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  font-size: 14px;
}

.filters label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filters select {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  font-size: 14px;
  font-family: inherit;
  color: #333;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.filters select:focus {
  outline: none;
  box-shadow: 0 0 3px rgba(0, 123, 255, 0.3);
}
</style>