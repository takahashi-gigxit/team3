<template>
  <div>
    <h2>ユーザー一覧</h2>
    <table>
      <thead><tr><th>名前</th><th>操作</th></tr></thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>
            <router-link :to="`/admin/user/edit/${user.id}`">編集</router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const users = [
  { id: 1, name: '山田太郎' },
  { id: 2, name: '佐藤花子' }
]
</script>
