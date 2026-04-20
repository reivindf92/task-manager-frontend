<script setup>
import { ref } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')

const login = async () => {
  const res = await api.post('/login', {
    email: email.value,
    password: password.value
  })

  localStorage.setItem('token', res.data.token)

  router.push('/tasks') // 🔥 AQUÍ
}
</script>

<template>
  <div class="container">

    <h1>Login</h1>

    <div class="form">
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />

      <button @click="login">
        Login
      </button>
    </div>

  </div>
</template>
<style>
.container {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
}
.form {
  max-width: 300px;
  margin: 0 auto;
}
.form input,
.form button {
  width: 100%;
  box-sizing: border-box;
}
</style>