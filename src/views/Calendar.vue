<template>
  <div class="calendar-container">
    <div class="header">
     
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
            :class="[{ outside: date.outside }, { marked: date.marked }]"
            @click="handleDateClick(date)"
          >
            {{ date.day }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
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
            marked: this.markedDates.includes(dateStr),
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
          year:this.selectedYearForRoute,
          month: this.selectedMonthForRoute,
          day: this.selectedDayForRoute
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
      //     alert(`:チェックマーク_緑: 打刻成功: ${date.date}`)
      //     this.markedDates.push(date.date)
      //   })
      //   .catch(err => {
      //     alert(':x: 打刻失敗')
      //     console.error(err)
      //   })
    },
    // 打刻済みデータを取得（APIから）
    fetchMarkedDates() {
      const yearMonth = `${this.year}-${String(this.month + 1).padStart(2, '0')}`
      fetch(`http://localhost:8080/api/attendance?userId=1&month=${yearMonth}`)
        .then(res => res.json())
        .then(data => {
          this.markedDates = data.map(d => d.date)
        })
        .catch(err => {
          console.error(':赤い丸: 打刻データ取得エラー', err)
        })
    }
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
  color: #4A97C8;
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
  background-color: #004B6B;
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
  background-color: #9BE7A0;
  font-weight: bold;
}
</style>
