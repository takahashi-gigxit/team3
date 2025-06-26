<template>
  <div class="container">
    <router-link to="/master/home" class="back">&lt;&lt;戻る</router-link>
    <p class="logout-link"><router-link to="/logout">ログアウト</router-link></p>
    <h2>申請</h2> <table>
      <thead>
        <tr>
          <th>日付</th>
          <th>名前</th>
          <th>種類</th>
          <th>理由</th>
          <th>削除</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="applications.length === 0">
          <td colspan="5">現在データはありません</td>
        </tr>
        <tr v-else v-for="item in applications" :key="item.id">
          <td>{{ item.date }}</td>
          <td>{{ item.username }}</td>
          <td>
            {{ item.requestType }}
            </td>
          <td>{{ item.reason }}</td>
          <td><button @click="confirmDelete(item.deleteId, item.recordType)">削除</button></td>
        </tr>
      </tbody>
    </table>

    <div v-if="showDialog" class="dialog">
      <p>削除しますか</p>
      <button @click="deleteApplication">はい</button>
      <button @click="cancelDialog">いいえ</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const applications = ref([]);
const showDialog = ref(false);
const itemToDelete = ref(null);

const API_BASE_URL = 'http://localhost:8080';

const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/list`);
    return response.data;
  } catch (error) {
    console.error('ユーザーの取得中にエラーが発生しました:', error);
    return [];
  }
};

const fetchAttendances = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/application/attendance`);
    return response.data;
  } catch (error) {
    console.error('勤怠記録の取得中にエラーが発生しました:', error);
    return [];
  }
};

const fetchRequests = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/application/request`);
    return response.data;
  } catch (error) {
    console.error('申請記録の取得中にエラーが発生しました:', error);
    return [];
  }
};

const fetchAllApplications = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/application/combined`);
    applications.value = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch (error) {
    console.error('結合された申請データの取得に失敗しました:', error);
    applications.value = [];
  }
};

const getApplicationType = (item) => {
  const types = [];
  if (item.paid === 1) types.push('有給');
  if (item.early === 1) types.push('早退');
  if (item.absence === 1) types.push('欠勤');
  if (item.late === 1) types.push('遅刻');
  return types.length > 0 ? types.join(', ') : '情報なし';
};

const confirmDelete = (id, type) => {
  itemToDelete.value = { id, type };
  showDialog.value = true;
};

const deleteApplication = async () => {
  if (!itemToDelete.value || !itemToDelete.value.id) {
    alert('削除対象が選択されていません。');
    return;
  }

  const { id, type } = itemToDelete.value;
  let url = '';

  try {
    if (type === 'request') {
      url = `${API_BASE_URL}/application/delete/${id}`;
      await axios.delete(url);
      alert('申請が正常に削除されました。');

      applications.value = applications.value.filter(item => !(item.recordType === 'request' && item.deleteId === id));

    } else if (type === 'attendance') {

      url = `${API_BASE_URL}/application/attendance/delete/${id}`;
      await axios.delete(url);
      alert('勤怠記録が正常に削除されました。');
      applications.value = applications.value.filter(item => !(item.recordType === 'attendance' && item.deleteId === id));

    } else {
      alert('不明なタイプのレコードです。');
    }

    fetchAllApplications();

  } catch (error) {
    console.error('削除中にエラーが発生しました:', error);
    alert('削除中にエラーが発生しました。詳細はコンソールを確認してください。');
    if (error.response) {
      console.error("エラーレスポンスデータ:", error.response.data);
      console.error("エラーレスポンスステータス:", error.response.status);
    }
  } finally {
    showDialog.value = false;
    itemToDelete.value = null;
  }
};
const cancelDialog = () => {
  showDialog.value = false;
  itemToDelete.value = null;
};

onMounted(() => {
  fetchAllApplications();
});
</script>

<style scoped>
.container {
  border: 2px solid green;
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  font-family: sans-serif;
  position: relative;
}
.back {
  display: inline-block;
  margin-bottom: 10px;
}
.logout-link {
  position: absolute;
  right: 20px;
  top: 10px;
  font-size: 14px;
  color: #4a97c8;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
th, td {
  border: 1px solid gray;
  padding: 6px;
  text-align: center;
}
.notice {
  color: #555;
}
.dialog {
  background: gray;
  border: 1px solid gray;
  padding: 20px;
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  z-index: 1000;
}
.dialog button {
  margin: 10px;
}
</style>