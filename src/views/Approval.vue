<template>
  <div>
    <h2>申請承認（総務）</h2>
    <div v-for="req in requests" :key="req.id" class="approval-item">
      <p>{{ req.user }} - {{ req.type }}</p>
      <button @click="approve(req)">承認</button>
      <button @click="reject(req)">却下</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const requests = ref([
  { id: 1, user: '山田太郎', type: '残業', status: '未承認' }
])

function approve(req) {
  req.status = '承認済'
}

function reject(req) {
  req.status = '却下'
}
</script>
