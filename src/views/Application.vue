<template>
  <div class="application-page">
    <!-- ヘッダー -->
    <div class="header">
      <router-link class="back-link" to="/attendance">&lt;&lt; 戻る</router-link>
      <router-link class="logout" to="/logout">ログアウト</router-link>
    </div>

    <h2 class="title">申請画面</h2>
    <p class="date">{{ today }}</p>

    <!-- 申請ボタン -->
    <div class="button-grid">
      <button class="app-btn" @click="confirmApply('遅刻')">遅刻申請</button>
      <button class="app-btn" @click="confirmApply('早退')">早退申請</button>
      <button class="app-btn" @click="confirmApply('欠勤')">欠勤申請</button>
      <button class="app-btn" @click="confirmApply('有給')">有給申請</button>
    </div>

    <!-- ダイアログ -->
    <div v-if="showDialog" class="dialog-overlay">
      <div class="dialog-box">
        <h3 class="dialog-title">{{ currentType }}申請をしますか？</h3>
        <div class="dialog-actions">
          <button class="confirm-button" @click="submitApplication">はい</button>
          <button class="cancel-button" @click="showDialog = false">いいえ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Application',
  data() {
    const today = new Date()
    return {
      today: today.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }),
      showDialog: false,
      currentType: ''
    }
  },
  methods: {
    confirmApply(type) {
      this.currentType = type
      this.showDialog = true
    },
    submitApplication() {
      fetch('http://localhost:8080/api/application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          type: this.currentType,
          date: new Date().toISOString().split('T')[0]
        })
      })
        .then(res => res.json())
        .then(() => {
          alert(`${this.currentType}申請を送信しました。`)
          this.showDialog = false
        })
        .catch(err => {
          alert('申請に失敗しました')
          console.error(err)
          this.showDialog = false
        })
    }
  }
}
</script>

<style scoped>
.application-page {
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

.button-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 30px;
}

.app-btn {
  border: 2px solid black;
  background: white;
  padding: 10px;
  cursor: pointer;
  font-size: 14px;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-box {
  background: white;
  padding: 20px;
  width: 240px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.dialog-title {
  font-size: 16px;
  margin-bottom: 20px;
}

.dialog-actions {
  display: flex;
  justify-content: space-around;
}

.confirm-button {
  background-color: #007acc;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
}

.cancel-button {
  background-color: #ccc;
  color: black;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
}
</style>
