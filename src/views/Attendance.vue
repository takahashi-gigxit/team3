<template>
  <div class="attendance-page">
    <!-- 戻る＆ログアウト -->
    <div class="header">
      <router-link class="back-link" to="/main">&lt;&lt; 戻る</router-link>
      <router-link class="logout" to="/logout">ログアウト</router-link>
    </div>

    <!-- タイトルと日付 -->
    <h2 class="title">勤怠画面</h2>
    <p class="date">{{ date }}</p>

    <!-- 出勤・退勤ボタンと時間 -->
    <div class="time-block">
      <button class="btn" @click="clockIn":disabled="inflag">出勤</button>
      <span class="time" >{{ startTime || '--:--' }}</span>
    </div>
    <div class="time-block">
      <button class="btn" @click="clockOut" :disabled="outflag">退勤</button>
      <span class="time">{{ endTime || '未打刻' }}</span>
    </div>

    <!-- 申請状態表示 -->
    <div class="status-block">
      <p>
        <div v-if="request.late !== 0">遅刻申請  <span>{{ status[request.late_app] }}</span></div>
        </p>
        <p>
        <div v-if="request.early !== 0">早退申請  <span>{{ status[request.early_app] }}</span></div>
        </p>
        <p>
        <div v-if="request.absence !== 0">欠勤申請  <span>{{ status[request.absence_app] }}</span></div>
        </p>
        <p>
        <div v-if="request.paid !== 0">有給申請  <span>{{ status[request.paid_app] }}</span></div>
        </p>
    </div>

    <router-link to="/application" class="link-button">各種申請へ＞＞</router-link>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Attendance',
  
  data(){

    return{
      userid: 1,
      attendance: {},
      request: {},
      date: "2025-06-20",
      startTime: '',
      endTime: '',
      inflag:false,
      status:["申請中","承認済み","拒否"],
outflag:false,
    }
  },
  created(){
    this.fetchatt();
    this.fetchreq();
  },
  methods: {
    // 出勤ボタンのクリックイベント
    clockIn() {
      console.log("出勤時刻ositauo");
      const currentTime = new Date().toLocaleTimeString(); // 現在のローカル時刻を取得
      console.log("出勤時刻:", currentTime);
      // 出勤時刻を送信
      axios.post(`http://localhost:8080/user/attendance/clockin/${this.userid}`, { time: currentTime,date: this.date })
        .then(res => {
          this.attendance = res.data;
          this.inflag = true;
          this.startTime = currentTime;
          console.log("出勤データ:", this.attendance);
        })
        .catch(error => {
          console.error("出勤エラー:", error);
        });
    },

    // 退勤ボタンのクリックイベント
    clockOut() {
      console.log("退勤時刻ositauo");
      const currentTime = new Date().toLocaleTimeString(); // 現在のローカル時刻を取得

      console.log("退勤時刻:", currentTime);
      // 退勤時刻を送信
      axios.post(`http://localhost:8080/user/attendance/clockout/${this.userid}`, { time: currentTime ,date: this.date})
        .then(res => {
          this.attendance = res.data;
          this.endTime = currentTime;
          this.outflag = true;
          console.log("退勤データ:", this.attendance);
        })
        .catch(error => {
          console.error("退勤エラー:", error);
        });
    },

    // 出勤・退勤データを取得
    fetchatt() {
      axios.post(`http://localhost:8080/user/attendance/1`, { date: this.date })
        .then(res => {
          this.attendance = res.data;
          this.startTime = this.attendance.start_time;
          this.endTime = this.attendance.end_time;
          if(this.startTime!==null){
            this.inflag=true;
          }
          if(this.endTime!==null){
            this.outflag=true;
          }
          console.log("Attendance:", this.attendance);
        });
    },

    fetchreq() {
      axios.get(`http://localhost:8080/user/request/1`)
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