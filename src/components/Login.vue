<template>

  <div class="form-container">
    <form class="login-form" @submit.prevent="login">
      <v-text-field   v-model="email" label="Email address" type="email" placeholder="johndoe@gmail.com" />
      <v-text-field  v-model="password" label="Password" type="password" />
       <p @click="goToRegister" class="Register">Register..?</p>
      <v-btn type="submit" color="primary" block>Login</v-btn>
      
    </form>
    
  </div>



</template>
<style lang="css" scoped>
.Register {
  text-align: right;
  font-size: 14px;
  color: #007bff;
  cursor: pointer;
}
.form-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f4f4;
} 
.login-form {
  width: 50%;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
<script setup>


import { ref } from 'vue';
import API from '@/services/api';
import { useRouter } from 'vue-router'



const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

const goToRegister = () => {
  router.push('/Register')
}

const login = async () => {
  try {
    const res = await API.post('/auth/login', { email: email.value, password: password.value });
    localStorage.setItem('token', res.data.token);
    router.push('/Dashboard');
  } catch (err) {
    error.value = 'Invalid credentials';
    alert('invalid credentials ... please try again !! , or register if you are new');
  }
};
</script>
