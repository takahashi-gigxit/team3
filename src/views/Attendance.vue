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
      <button class="btn" @click="clockIn" :disabled="inflag">出勤</button>
      <span class="time" >{{ startTime || '--:--' }}</span>
    </div>
    <div class="time-block">
      <button class="btn" @click="clockOut" :disabled="outflag">退勤</button>
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
import axios from 'axios'
export default {
  name: 'Attendance',
  data() {
    //クリックされた年・月・日、またはその日付を取得
    const year = this.$route.params.year || new Date().getFullYear()
    const month = this.$route.params.month || new Date().getMonth() + 1
    const day = this.$route.params.day || new Date().getDate()
    //DB用に型変換（月・日で一桁のものは０を加える　6月の場合06）
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const displayDate = `${year}年${month}月${day}日`
    return {
      userid: 1,
      attendance: {},
      request: {},
      today: displayDate,        // 画面表示用
      punchDate: formattedDate,  // DB保存用 (yyyy-MM-dd)
      startTime: '',
      endTime: '',
      inflag:false,
      outflag:false
    }
  },
  created(){
    this.fetchatt();
    this.fetchreq();
  },
  methods: {
     // 出勤ボタンのクリックイベント
    clockIn() {
    //   console.log("出勤時刻ositauo");
      // "HH:mm" の形式で送信（Java側に合わせる）
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;
      console.log("出勤時刻:", currentTime);
    //   // 出勤時刻を送信
      axios.post(`http://localhost:8080/user/attendance/clockin/${this.userid}`, { time: currentTime,date: this.punchDate })
        .then(res => {
          this.attendance = res.data;
          this.startTime = currentTime;
          console.log("出勤データ:", this.attendance);
        })
        .catch(error => {
          console.error("出勤エラー:", error);
        });
    },
    // // 退勤ボタンのクリックイベント
    clockOut() {
    //   console.log("退勤時刻ositauo");
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;
      console.log("退勤時刻:", currentTime);
      // 退勤時刻を送信
      axios.post(`http://localhost:8080/user/attendance/clockout/${this.userid}`, { time: currentTime ,date: this.punchDate })
        .then(res => {
          this.attendance = res.data;
          this.endTime = currentTime;
          console.log("退勤データ:", this.attendance);
        })
        .catch(error => {
          console.error("退勤エラー:", error);
        });
    },
    // 出勤・退勤データを取得
    fetchatt() {
      axios.post(`http://localhost:8080/user/attendance/${this.userid}`, { punchDate: this.punchDate })
        .then(res => {
          this.attendance = res.data;
          this.startTime = this.attendance.start_time;
          this.endTime = this.attendance.end_time;
          console.log("Attendance:", this.attendance);
        });
    },
    fetchreq() {
      axios.get(`http://localhost:8080/user/request/${this.userid}`)
        .then(res => {
          this.request = res.data;
          console.log("Request:", this.request);
        });
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
