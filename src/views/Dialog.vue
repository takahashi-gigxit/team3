<template>
  <div class="dialog-overlay" v-if="visible">
    <div class="dialog-box">
      <p>{{ message }}</p>
      <div class="actions">
        <button @click="$emit('confirm')">確認</button>
        <button @click="$emit('cancel')">キャンセル</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dialog',
  props: {
    visible: Boolean,
    message: String
  }
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.dialog-box {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 200px;
  text-align: center;
}
.actions button {
  margin: 10px;
  padding: 5px 10px;
}
</style>