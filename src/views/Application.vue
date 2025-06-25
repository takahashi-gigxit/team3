<template>
  <div class="application-page">
    <!-- ヘッダー -->
    <div class="header">
      <router-link class="back-link" :to="`/attendance/${selectdate}`">&lt;&lt; 戻る</router-link>
      <router-link class="logout" to="/logout">ログアウト</router-link>
    </div>

    <h2 class="title">申請画面</h2>
    <p class="date">{{ displaydate }}</p>

    <!-- 申請ボタン -->
    <div class="button-grid">
      <div class="button-row" v-for="type in types" :key="type.key">
        <button
          class="app-btn"
          @click="confirmApply(type.key)"
          :disabled="request[type.key] === 1"
        >
          {{ type.label }}申請
        </button>

        <button 
          v-if="request[type.key] === 1" 
          class="cancel-btn" 
          @click="confirmCancel(type.key)"
          >取消
        </button>
      </div>
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

    <div v-if="showCancelDialog" class="dialog-overlay">
      <div class="dialog-box">
        <h3 class="dialog-title">{{ cancelTypeJapanese }}申請を取り消しますか？</h3>
        <div class="dialog-actions">
          <button class="confirm-button" @click="submitCancel">はい</button>
          <button class="cancel-button" @click="showCancelDialog = false">いいえ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Application',
  props: ['requestId'],
  data() {
    const today = new Date()
    return {
      Requestid:this.$route.params.requestId,
      displaydate:'',
      selectdate:'',
      showDialog: false,
      currentType: '',
      showCancelDialog: false,
      cancelType: '',
      request:{},
      types: [
        { key: 'late', label: '遅刻' },
        { key: 'early', label: '早退' },
        { key: 'absence', label: '欠勤' },
        { key: 'paid', label: '有給' }
      ],
    }
  },
  computed: {
    currentTypeJapanese() {
      return {
        late: '遅刻',
        early: '早退',
        absence: '欠勤',
        paid: '有給'
      }[this.currentType] || '';
    },
    cancelTypeJapanese() {
      return {
        late: '遅刻',
        early: '早退',
        absence: '欠勤',
        paid: '有給'
      }[this.cancelType] || '';
    }
  },
  created() {
    this.fetchRequest();
  },
  methods: {
    fetchRequest() {
      axios.get(`http://localhost:8080/user/request/${this.Requestid}`)
        .then(res => {
          this.request = res.data;
          axios.get(`http://localhost:8080/user/attendance/${this.Requestid}`)
          .then(res => {
            let year, month, day;
                [year, month, day] = res.data.date.split('-')
                this.displaydate =  `${year}年${month}月${day}日`;
                this.selectdate = res.data.date;
          })
        })
        .catch(err => {
          console.error('Request取得エラー', err);
        });
    },
    confirmApply(type) {
      this.currentType = type
      this.showDialog = true
    },
    confirmCancel(type) {
      this.cancelType = type;
      this.showCancelDialog = true;
    },
    submitApplication() {
      const updatedRequest = {
        ...this.request,//requestのコピーを作成
        late: 0,
        early: 0,
        absence: 0,
        paid: 0,
        late_app: 0,
        early_app: 0,
        absence_app: 0,
        paid_app: 0,
      };

      // 押されたボタンの種類のみ 1 をセット
      updatedRequest[this.currentType] = 1;

       axios.put(`http://localhost:8080/user/request/${this.Requestid}`, updatedRequest)
        .then(() => {
          alert(`${this.currentTypeJapanese}申請を送信しました。`);
          this.showDialog = false;
          this.fetchRequest();
        })
        .catch(err => {
          alert('申請に失敗しました');
          console.error(err);
          this.showDialog = false;
        });

      // fetch('http://localhost:8080/api/application', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     userId: 1,
      //     type: this.currentType,
      //     date: new Date().toISOString().split('T')[0]
      //   })
      // })
      //   .then(res => res.json())
      //   .then(() => {
      //     alert(`${this.currentType}申請を送信しました。`)
      //     this.showDialog = false
      //   })
      //   .catch(err => {
      //     alert('申請に失敗しました')
      //     console.error(err)
      //     this.showDialog = false
      //   })
    },
    submitCancel() {
      const updatedRequest = {
        ...this.request,
        late: 0,
        early: 0,
        absence: 0,
        paid: 0,
        late_app: 0,
        early_app: 0,
        absence_app: 0,
        paid_app: 0,
      };
      updatedRequest[this.cancelType] = 0;

      axios.put(`http://localhost:8080/user/request/${this.Requestid}`, updatedRequest)
        .then(() => {
          alert(`${this.cancelTypeJapanese}申請を取り消しました。`);
          this.showCancelDialog = false;
          this.fetchRequest();
        })
        .catch(err => {
          alert('取り消しに失敗しました');
          console.error(err);
          this.showCancelDialog = false;
        });
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  width: 100%; 
  max-width: 320px; 
}

.app-btn, .cancel-btn {
  flex: 1 1 140px;
  padding: 10px 0;
  border: 2px solid black;
  font-size: 14px;
  cursor: pointer;
  box-sizing: border-box;
  text-align: center;
  transition: background-color 0.3s ease;
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

.button-row {
  display: flex;
  justify-content: center;
  gap: 12px;
  width: 60%;
  max-width: 320px; 
}


/* 申請ボタン */
.app-btn {
  background-color: white;
  color: black;
}

.app-btn:disabled {
  background-color: #eee;
  color: #999;
  cursor: not-allowed;
}

.app-btn:not(:disabled):hover {
  background-color: #f0f0f0;
}

/* 取消ボタン */
.cancel-btn {
  background-color: #e74c3c; /* 赤色 */
  color: white;
  border-color: #e74c3c;
}

.cancel-btn:hover {
  background-color: #c0392b; /* 濃い赤 */
}

</style>