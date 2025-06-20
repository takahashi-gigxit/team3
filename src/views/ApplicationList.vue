<template>
  <div>
    <h2>申請一覧</h2>
    <ul>
      <li v-for="req in requests" :key="req.id">
        {{ req.user }} - {{ req.type }} - {{ req.status }}
      </li>
    </ul>
  </div>
</template>

<script setup>
const requests = [
  { id: 1, user: '山田太郎', type: '休暇', status: '未承認' },
  { id: 2, user: '佐藤花子', type: '遅刻', status: '承認済' }
]
</script>
