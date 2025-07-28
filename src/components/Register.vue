<template>

  <div class="form-container">

    <form class="register-form" @submit.prevent="register">
           <p class="message"> HEY Do the Registeration !!!</p> 
      <v-text-field    v-model="name" label="Full Name" type="name" placeholder="john morris" />

      <v-text-field    v-model="email" label="Email address" type="email" placeholder="johndoe@gmail.com" />
      <v-text-field    v-model="password" label="Password" type="password" />

      <v-btn type="submit" color="primary" block>Register</v-btn>
      
    </form>
    
  </div>



</template>
<style lang="css" scoped>
.message {
  text-align: center;
  font-size: 20px;
  color: #333;
  margin-bottom: 1rem;
}
.form-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f4f4;
} 
.register-form {
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

<script>
import axios from 'axios'

export default {
  data() {
    return {
      name: '',
      email: '',
      password: ''
    }
  },
  methods: {
    async register() {
      try {
        const res = await axios.post('https://chargingstation-backend-td8a.onrender.com/api/auth/register', {
          name: this.name,
          email: this.email,
          password: this.password
        });
        alert(res.data.msg);
        this.$router.push('/');
      } catch (err) {
        alert(err.response?.data?.message || 'Registration failed');
      }
    }
  }
}
</script>
