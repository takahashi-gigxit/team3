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
      <div>遅刻申請　申請中</div>
      <div>有給申請　承認済み</div>
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
.attendance {
  padding: 20px;
  font-family: sans-serif;
}
</style>
