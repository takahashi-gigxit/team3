<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const props = defineProps({
  type: {
    type: String,
    default: 'user'
  }
})

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const login = async () => {
  try {
    const response = await axios.post('http://localhost:8080/login', {
      email: email.value,
      password: password.value,
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log('ログイン成功', response.data)
    localStorage.setItem('user', JSON.stringify(response.data))

    const categoryId = response.data.category_id
    console.log("categoryId");
    console.log(categoryId);
    if (categoryId === 2) {
      router.push('/master/home')
      console.log("categoryadmin");
    } else if (categoryId === 1) {
      router.push(`/admin`)
    } else if (categoryId === 0) {
      router.push(`/main`)
    }
    else {
      alert('不正な権限です')
    }

  } catch (error) {
    console.error('ログイン失敗', error)
    errorMessage.value = 'ログインに失敗しました。メールアドレスとパスワードを確認してください。'
  }
}
</script>


<template>
  <div class="login-container">
    <p class="back-link">
      <router-link to="/">&lt;&lt; 戻る</router-link>
    </p>

    <h2 class="title">ログイン画面</h2>

    <form @submit.prevent="login" class="form">
      <input v-model="email" placeholder="メールアドレス" />
      <input v-model="password" type="password" placeholder="パスワード" />
      <button type="submit">ログイン</button>
    </form>

    <p v-if="errorMessage" style="color: red; margin-top: 10px;">{{ errorMessage }}</p>

    <p class="register-link">
      <router-link to="/register">新規登録はこちら</router-link>
    </p>
  </div>
</template>



<style scoped>
.login-container {
  width: 300px;
  margin: 100px auto;
  text-align: center;
  font-family: sans-serif;
}

.title {
  margin-bottom: 20px;
  font-size: 20px;
}

.input-box {
  width: 100%;
  height: all;
  margin-bottom: 10px;
  border: 1px solid black;
  padding: 5px;
  font-size: 16px;
}

.error-message {
  color: red;
  margin-bottom: 10px;
  font-size: 14px;
}

.login-button {
  padding: 5px 20px;
  border: 1px solid black;
  background-color: white;
  cursor: pointer;
}

.register-link {
  margin-top: 20px;
  font-size: 14px;
}
</style>