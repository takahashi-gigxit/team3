<template>
  <div class="attendance-page">
    <!-- 戻る＆ログアウト -->
    <div class="header">
      <router-link class="back-link" to="/main">&lt;&lt; 戻る</router-link>
      <router-link class="logout" to="/logout">ログアウト</router-link>
    </div>

    <!-- タイトルと日付 -->
    <h2 class="title">勤怠画面</h2>
    <p class="date">{{ today }}</p>

    <!-- 出勤・退勤ボタンと時間 -->
    <div class="time-block">
      <button class="btn" @click="punch('start')">出勤</button>
      <span class="time">{{ startTime || '--:--' }}</span>
    </div>
    <div class="time-block">
      <button class="btn" @click="punch('end')">退勤</button>
      <span class="time">{{ endTime || '未打刻' }}</span>
    </div>

    <!-- 申請状態表示 -->
    <div class="status-block">
      <div>遅刻申請　申請中</div>
      <div>有給申請　承認済み</div>
    </div>

    <router-link to="/application" class="link-button">各種申請へ＞＞</router-link>
  </div>
</template>

<script>
export default {
  name: 'Attendance',
  data() {
    const today = new Date()
    return {
      today: today.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }),
      startTime: '',
      endTime: ''
    }
  },
  methods: {
    punch(type) {
      const now = new Date().toTimeString().slice(0, 5)
      const date = new Date().toISOString().split('T')[0] // yyyy-mm-dd
      const time = now

      fetch('http://localhost:8080/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1, // 必要に応じてログイン情報に置き換え
          type: type === 'start' ? '出勤' : '退勤',
          date: date,
          time: time
        })
      })
        .then(res => res.json())
        .then(() => {
          if (type === 'start') {
            this.startTime = now
          } else {
            this.endTime = now
          }
          alert(`✅ ${type === 'start' ? '出勤' : '退勤'}打刻成功: ${time}`)
        })
        .catch(err => {
          alert('❌ 打刻失敗')
          console.error(err)
        })
    }
  }
}
</script>

<style scoped>
.attendance-page {
  font-family: sans-serif;
  max-width: 320px;
  margin: auto;
  padding: 20px;
  text-align: center;
}

.header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 10px;
}

.title {
  margin: 10px 0;
  font-size: 20px;
}

.date {
  margin-bottom: 20px;
}

.time-block {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.btn {
  border: 2px solid black;
  background: white;
  padding: 5px 15px;
  margin-right: 10px;
  cursor: pointer;
  font-weight: bold;
}

.time {
  font-size: 16px;
}

.status-block {
  margin: 20px 0;
  font-size: 14px;
  line-height: 1.8;
}

.link-button {
  font-size: 14px;
  color: #007acc;
  text-decoration: underline;
}
</style>
