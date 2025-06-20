<template>
  <div class="user-main">
    <h2>マイページ（カレンダー）</h2>
    <Calendar />
  </div>
</template>

<script>
import Calendar from './Calendar.vue'

export default {
  name: 'UserMain',
  components: {
    Calendar
  }
}
</script>

<style scoped>
.user-main {
  padding: 20px;
  font-family: sans-serif;
}
</style>