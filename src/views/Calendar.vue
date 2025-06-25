<template>
  <div class="calendar-container">
    <div class="header">
      <!-- ログアウトリンク -->
      <h2 v-if="username">ようこそ {{ username }} さん</h2>
      <h3>勤怠管理</h3>

      <!-- 現在の年月表示 -->
      <h4>{{ year }}年 {{ month + 1 }}月</h4>

      <!-- 月切り替えボタン -->
      <div class="month-control">
        <button @click="prevMonth">＜</button>
        <button @click="nextMonth">＞</button>
      </div>
    </div>

    <!-- カレンダー表 -->
    <table class="calendar">
      <thead>
        <tr>
          <th v-for="day in days" :key="day">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, index) in calendar" :key="index">
          <td
  v-for="date in week"
  :key="date.date"
  :class="[
    { outside: date.outside },
    { startMarked: date.marked.start },
    { endMarked: date.marked.end }
  ]"
  @click="handleDateClick(date)"
>
  {{ date.day }}
</td>
        </tr>
      </tbody>
    </table>
    <!-- 注釈（凡例） -->
<div class="legend">
  <div><span class="box start"></span> 出勤のみ</div>
  <div><span class="box end"></span> 退勤のみ</div>
  <div><span class="box both"></span> 出退勤済み</div>
</div>
<div class="total-time" style="margin-top: 20px;">
  {{ month + 1 }}月の合計勤務時間: <strong>{{ totalWorkHours }}</strong>
</div>

  </div>
</template>

<script>
const user_id = localStorage.getItem('userId');
export default {
  name: 'Calendar',
  data() {
    const today = new Date()
    return {
      days: ['日', '月', '火', '水', '木', '金', '土'], // 曜日表示
      year: today.getFullYear(),
      month: today.getMonth(), // 0 = 1月
      username: localStorage.getItem('username') || 'ゲスト',
      markedDates: [], // 打刻済みの日付
      totalWorkHours: 0,
      //クリックされた日付、月を保存してリンクに出す用の変数
      selectedYearForRoute: null,
      selectedMonthForRoute: null,
      selectedDayForRoute: null
    }
  },
  computed: {
    calendar() {
      const firstDay = new Date(this.year, this.month, 1)
      const startDay = firstDay.getDay()
      const daysInMonth = new Date(this.year, this.month + 1, 0).getDate()
      const prevMonthDays = new Date(this.year, this.month, 0).getDate()
      const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7
      
      const result = []
      let day = 1
      let nextMonthDay = 1

      for (let i = 0; i < totalCells; i++) {
        const row = Math.floor(i / 7)
        if (!result[row]) result[row] = []

        if (i < startDay) {
          const d = prevMonthDays - startDay + i + 1
          result[row].push({ day: d, outside: true, marked: false, date: `${this.year}-${this.month}-${d}` })
        } else if (day <= daysInMonth) {
          const dateStr = `${this.year}-${String(this.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          result[row].push({
            day: day,
            outside: false,
            marked: this.getMarkedState(dateStr),
            date: dateStr
          })
          day++
        } else {
          const d = nextMonthDay++
          result[row].push({ day: d, outside: true, marked: false, date: `${this.year}-${this.month + 2}-${d}` })
        }
      }

      return result
    }
  },
  methods: {
    // 前の月へ
    prevMonth() {
      if (this.month === 0) {
        this.month = 11
        this.year--
      } else {
        this.month--
      }
      this.fetchMarkedDates()
    },

    // 次の月へ
    nextMonth() {
      if (this.month === 11) {
        this.month = 0
        this.year++
      } else {
        this.month++
      }
      this.fetchMarkedDates()
    },

    // 日付クリック時の処理
    handleDateClick(date) {
      if (date.outside || this.markedDates.includes(date.date)) {
        alert('この日は既に打刻済みです')
        return
      }
console.log( date.date)
console.log( "date.date")
      // 日付を分割して月・日をセット
      const [yearStr, monthStr, dayStr] = date.date.split('-')
      //↑　クリックされた日付をのYYYY-MM-DDで取得しそれを「-」ごとに分けて配列に挿入
      this.selectedMonthForRoute = parseInt(monthStr, 10)
      //　
      this.selectedDayForRoute = parseInt(dayStr, 10)
      this.selectedYearForRoute = parseInt(yearStr,10)
         this.$router.push({
        name: 'AttendanceWithDate',
         params: {
          date: date.date // "YYYY-MM-DD" 形式のまま渡す
        }
      })

      // fetch('http://localhost:8080/api/attendance', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     userId: 1,
      //     date: date.date,
      //     type: '打刻'
      //   })
      // })
      //   .then(res => res.json())
      //   .then(() => {
      //     alert(`✅ 打刻成功: ${date.date}`)
      //     this.markedDates.push(date.date)
      //   })
      //   .catch(err => {
      //     alert('❌ 打刻失敗')
      //     console.error(err)
      //   })
    },

    // 打刻済みデータを取得（APIから）
    fetchMarkedDates() {
       const userStr = localStorage.getItem('user');
  if (!userStr) {
    console.error('ユーザー情報が見つかりません');
    return;
  }

  const user = JSON.parse(userStr);
  const user_id = user.id;
  this.username = user.username;
  console.log(user_id);
  console.log(user);

  const yearMonth = `${this.year}-${String(this.month + 1).padStart(2, '0')}`
  fetch(`http://localhost:8080/user/attendance/month/${user_id}?month=${yearMonth}`)
    .then(res => res.json())
    .then(data => {
      this.markedDates = data.map(d => ({
        date: d.date,
        start: d.start,
        end: d.end,
        start_time: d.start_time, // ← APIから取得できること前提
        end_time: d.end_time
      }))
      this.calculateTotalHours()
    })
    .catch(err => {
      console.error('🔴 打刻データ取得エラー', err)
    })
},
    getMarkedState(dateStr) {
  const record = this.markedDates.find(d => d.date === dateStr)
    console.log(record);
  return record ? { start: record.start, end: record.end } : { start: false, end: false }

},
calculateTotalHours() {
  let totalMinutes = 0;

  this.markedDates.forEach(entry => {
    // 出勤・退勤の両方が済んでいて、時刻が存在することを確認
    if (entry.start && entry.end && entry.start_time && entry.end_time) {
      const [sh, sm] = entry.start_time.split(':').map(Number)
      const [eh, em] = entry.end_time.split(':').map(Number)

      const start = sh * 60 + sm
      const end = eh * 60 + em

      if (end > start) {
        totalMinutes += end - start
      }
    }
  });

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  this.totalWorkHours = `${hours}時間 ${minutes}分`
},
  },
  mounted() {
    this.fetchMarkedDates()
  }
}
</script>

<style scoped>
.calendar-container {
  font-family: sans-serif;
  max-width: 320px;
  margin: auto;
  text-align: center;
}

.logout-link {
  text-align: right;
  font-size: 14px;
  color: #4a97c8;
}

.month-control button {
  margin: 4px;
  padding: 4px 10px;
  font-size: 14px;
}

.calendar {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.calendar th {
  background-color: #004b6b;
  color: white;
  padding: 5px;
}

.calendar td {
  padding: 8px;
  border: 1px solid #ccc;
  background-color: #eee;
  cursor: pointer;
}

.calendar td.outside {
  background-color: #ddd;
  color: #aaa;
  cursor: default;
}

.calendar td.marked {
  background-color: #9be7a0; /* 打刻済みの日付の背景色 */
  font-weight: bold;
}
.calendar td.startMarked {
  background-color: #ffe082; /* 出勤済み → 薄いオレンジ */
}

.calendar td.endMarked {
  background-color: #80d8ff; /* 退勤済み → 薄い水色 */
}

.calendar td.startMarked.endMarked {
  background-color: #a5d6a7; /* 出退勤両方 → 緑色 */
}
.legend {
  margin-top: 20px;
  font-size: 14px;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.box {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 6px;
  border: 1px solid #999;
  vertical-align: middle;
}

.box.start {
  background-color: #ffe082; /* 出勤のみ：黄色 */
}

.box.end {
  background-color: #80d8ff; /* 退勤のみ：水色 */
}

.box.both {
  background-color: #a5d6a7; /* 出退勤両方：緑 */
}
.calendar td:nth-child(1):not(.outside):not(.startMarked):not(.endMarked) {
  background-color: #ffe0e0; /* 日曜：薄ピンク */
}

.calendar td:nth-child(7):not(.outside):not(.startMarked):not(.endMarked) {
  background-color: #e0f7fa; /* 土曜：薄水色 */
}
</style>
