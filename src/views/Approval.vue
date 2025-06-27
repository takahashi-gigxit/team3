<template>
  <div class="container">
    <router-link to="/admin" class="back">&lt;&lt;戻る</router-link>
    <h2>申請一覧</h2>
    <table>
      <thead>
        <tr>
          <th>日付</th>
          <th>名前</th>
          <th>申請項目</th>
          <th>ステータス</th>
          <th>理由</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="requests.length === 0">
          <td colspan="6">現在データはありません</td>
        </tr>
        <template v-else v-for="req in requests" :key="req.id">
          <tr v-if="req.recordType === 'request' || req.requestType !== '勤怠のみ'" class="approval-req">
            <td>{{ req.date }}</td>
            <td>{{ req.username }}</td>
            <td>{{ req.requestType }}</td>
            <td>{{ req.requestStatus }}</td>
             <td>
            {{ req.reason }}
            </td>
            <td>
              <div>
                <button @click="confirmAction(req, 'approve')" :disabled="req.requestStatus === '承認済み'">
                  承認
                </button>
                <button @click="confirmAction(req, 'reject')" :disabled="req.requestStatus === '却下済み'">
                  却下
                </button>
              </div>
            </td>
         
          </tr>
        </template>
      </tbody>
    </table>

    <div v-if="showConfirmDialog" class="dialog-overlay">
      <div class="dialog-content">
        <p>{{ dialogMessage }}</p>
        <button @click="executeAction">はい</button>
        <button @click="cancelDialog">いいえ</button>
      </div>
    </div>

    <div v-if="showDeleteDialog" class="dialog-overlay">
      <div class="dialog-content">
        <p>選択されたレコードを削除しますか？</p>
        <button @click="deleteApplication">はい</button>
        <button @click="cancelDeleteDialog">いいえ</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const requests = ref([]);
const showConfirmDialog = ref(false); // 承認/却下用
const showDeleteDialog = ref(false); // 削除用

const dialogMessage = ref('');
const selectedRequest = ref(null); // 承認/却下対象のCombinedApplicationDto
const selectedAction = ref(''); // 'approve' or 'reject'

const itemToDelete = ref(null); // 削除対象のアイテム（IDとタイプを保持）

const API_BASE_URL = 'http://localhost:8080';

const fetchAllrequests = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/combined`);
    requests.value = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch (error) {
    console.error('結合された申請データの取得に失敗しました:', error);
    requests.value = [];
  }
};

// 承認または却下ボタンクリック時の確認ダイアログ表示
const confirmAction = (req, action) => {
  selectedRequest.value = req;
  selectedAction.value = action;

  dialogMessage.value = `${req.requestType}申請を${action === 'approve' ? '承認' : '却下'}しますか？`;
  showConfirmDialog.value = true;
};

// 確認ダイアログで「はい」が押された時の処理（承認/却下）
const executeAction = async () => {
  if (!selectedRequest.value || !selectedAction.value) return;

  const requestId = selectedRequest.value.id;
  const action = selectedAction.value;

  let url = '';
  let successMessage = '';
  let errorMessage = '';

  try {
    if (action === 'approve') {
      url = `${API_BASE_URL}/admin/request/${requestId}/approve`;
      successMessage = '申請が承認されました。';
      errorMessage = '申請の承認中にエラーが発生しました。';
    } else { // action === 'reject'
      url = `${API_BASE_URL}/admin/request/${requestId}/reject`;
      successMessage = '申請が却下されました。';
      errorMessage = '申請の却下中にエラーが発生しました。';
    }
    await axios.put(url);
    alert(successMessage);
    await fetchAllrequests(); // リストを再取得して表示を更新
  } catch (error) {
    console.error(errorMessage, error);
    alert(errorMessage);
  } finally {
    cancelDialog();
  }
};

// 確認ダイアログで「いいえ」が押された時の処理（承認/却下）
const cancelDialog = () => {
  showConfirmDialog.value = false;
  selectedRequest.value = null;
  selectedAction.value = '';
};

// 削除ボタンクリック時の確認ダイアログ表示
const confirmDelete = (id, type) => {
  itemToDelete.value = { id, type };
  showDeleteDialog.value = true;
};

// 削除実行
const deleteApplication = async () => {
  if (!itemToDelete.value || !itemToDelete.value.id) {
    alert('削除対象が選択されていません。');
    return;
  }

  const { id, type } = itemToDelete.value;
  let url = '';

  try {
    if (type === 'request') {
      url = `${API_BASE_URL}/application/delete/${id}`; // 既存の申請削除API
      await axios.delete(url);
      alert('申請が正常に削除されました。');
    } else if (type === 'attendance') {
      url = `${API_BASE_URL}/application/attendance/delete/${id}`; // 既存の勤怠削除API
      await axios.delete(url);
      alert('勤怠記録が正常に削除されました。');
    } else {
      alert('不明なタイプのレコードです。');
    }

    await fetchAllrequests(); // 削除後、リストを再取得
  } catch (error) {
    console.error('削除中にエラーが発生しました:', error);
    alert('削除中にエラーが発生しました。詳細はコンソールを確認してください。');
  } finally {
    cancelDeleteDialog();
  }
};

// 削除ダイアログで「いいえ」が押された時の処理
const cancelDeleteDialog = () => {
  showDeleteDialog.value = false;
  itemToDelete.value = null;
};

onMounted(() => {
  fetchAllrequests();
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
