<template>
  <div class="attendance-page">
    <!-- 戻る＆ログアウト -->
    <div class="header">
      <router-link class="back-link" to="/main">&lt;&lt; 戻る</router-link>
      <router-link class="logout" to="/logout">ログアウト</router-link>
    </div>

    <!-- タイトルと日付 -->
    <div class="title-date-container">
      <h2 class="title">勤怠画面</h2>

      <div class="date-nav">
        <button @click="goPrevDate">＜</button>
        <p class="date">{{ today }}</p>
        <button @click="goNextDate">＞</button>
      </div>
    </div>

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

    <router-link v-if="request.id" 
    :to="{ name: 'Application', params: { requestId: attendance.requestid } }" class="link-button"
    >各種申請へ＞＞</router-link>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Attendance',
  data() {
    //クリックされた年・月・日、またはその日付を取得
    //(paramsの中にクリックした日付のデータが入ってるので取り出す)
    const dateParam = this.$route.params.date
    let year, month, day
    //paramの日付を取得できていれば-で区切って代入
    if (dateParam) {
    [year, month, day] = dateParam.split('-')
    year = parseInt(year)
    month = parseInt(month)
    day = parseInt(day)
  } else {
    // なければ今日の日付を使用
    const now = new Date()
    year = now.getFullYear()
    month = now.getMonth() + 1
    day = now.getDate()
  }
    // console.log(year);
    // console.log(month);
    // console.log(day);


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
      status:["申請中","承認済み","拒否"],
      inflag:false,
      outflag:false
    }
  },
  created(){
    this.fetchatt();
    this.fetchreq();
    this.checkAndFetch();
  },
  watch: {
    // ルートパラメータの日付が変わったら画面更新
    '$route.params.date'(newDate) {
      if (newDate) {
        const [year, month, day] = newDate.split('-').map(Number)
        this.punchDate = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`
        this.today = `${year}年${month}月${day}日`
      } else {
        // パラメータが無ければ今日に戻す
        const now = new Date()
        const year = now.getFullYear()
        const month = now.getMonth() + 1
        const day = now.getDate()
        this.punchDate = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`
        this.today = `${year}年${month}月${day}日`
      }
      // 日付更新したら再取得
      this.inflag = false
      this.outflag = false
      this.startTime = ''
      this.endTime = ''
      this.attendance = {}
      this.request = {}
      this.fetchatt()
      this.fetchreq()
      this.checkAndFetch()
    }
  },
  methods: {
     // 出勤ボタンのクリックイベント
    clockIn() {
    //   console.log("出勤時刻ositauo");
      // "HH:mm" の形式で送信（Java側に合わせる）
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2,'0');
      const currentTime = `${hours}:${minutes}:${seconds}`;
      console.log("出勤時刻:", currentTime);
    //   // 出勤時刻を送信
      axios.post(`http://localhost:8080/user/attendance/clockin/${this.userid}`, { time: currentTime,date: this.punchDate })
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
    // // 退勤ボタンのクリックイベント
    clockOut() {
    //   console.log("退勤時刻ositauo");
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2,'0');
    const currentTime = `${hours}:${minutes}:${seconds}`;
      console.log("退勤時刻:", currentTime);
      // 退勤時刻を送信
      axios.post(`http://localhost:8080/user/attendance/clockout/${this.userid}`, { time: currentTime ,date: this.punchDate })
        .then(res => {
           this.outflag = true;
          this.attendance = res.data;
          this.endTime = currentTime;
          console.log("退勤データ:", this.attendance);
        })
        .catch(error => {
          console.error("退勤エラー:", error);
        });
    },
    goPrevDate() {
      const current = new Date(this.punchDate);
      current.setDate(current.getDate() - 1);
      this.navigateToDate(current);
    },

  // 次日へ遷移
    goNextDate() {
      const current = new Date(this.punchDate);
      current.setDate(current.getDate() + 1);
      this.navigateToDate(current);
    },
    // 日付を文字列化しルーター遷移
  navigateToDate(dateObj) {
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    this.$router.push({ name: 'AttendanceWithDate', params: { date: dateStr } });
  },
    async checkAndFetch() {
      try {
        await axios.post(`http://localhost:8080/user/check/${this.userid}`, { punchDate: this.punchDate });
        this.fetchatt(); // checkで必要ならrequest作成 → その後取得
      } catch (e) {
        console.error("check失敗", e);
      }
    },
    // 出勤・退勤データを取得
    fetchatt() {
//       console.log(this.punchDate);
// console.log(this.punchDate);
// console.log(this.punchDate);
// console.log(this.punchDate);
// console.log(this.punchDate);

      axios.post(`http://localhost:8080/user/attendance/${this.userid}`, { punchDate: this.punchDate })
        .then(res => {
          this.attendance = res.data;
          
console.log(res);
console.log(this.attendance);

          this.startTime = this.attendance.start_time;
          this.endTime = this.attendance.end_time;
          if (this.startTime) {
            this.inflag = true;
          }
          if (this.endTime) {
            this.outflag = true;
          }
          console.log("Attendance:", this.attendance);
          
          if (this.attendance.requestid) {
            this.fetchreq(this.attendance.requestid);
          } else {
            console.warn("requestid が取得できません");
          }
        });
    },

    fetchreq(requestId) {
      axios.get(`http://localhost:8080/user/request/${requestId}`)
        .then(res => {
          this.request = res.data;
          console.log("Request:", this.request);
        })
        .catch(err => {
          console.error("申請データ取得エラー", err);
        });
    }
  }
}
</script>

<style scoped>
.title{
  text-align: center;
}

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
  margin-top: 20px;
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

.title-date-container {
  display: flex;
  align-items: center;
  justify-content: center; /* ← 親全体を中央寄せ */
  gap: 1em;
  flex-wrap: wrap;
  position: relative;
}

/* 日付ナビを右寄せ */
.date-nav {
  margin-left: auto; /* これで右端に寄せる */
  display: flex;
  align-items: center;
  gap: 0.5em;
}

/* .title-date-container .title {
  margin: 0;
} */

.date-nav .date {
  margin: 0;
  font-weight: bold;
  min-width: 140px; /* 日付の幅を多少固定 */
  text-align: center;
}

.date-nav button {
  border: 1.5px solid #333;
  background-color: #f9f9f9;
  color: #333;
  font-weight: bold;
  padding: 5px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.date-nav button:hover {
  background-color: #333;
  color: #fff;
}
</style>
