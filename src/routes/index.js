import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/components/Login.vue'
import RegisterPage from '@/components/Register.vue'
import DashboardPage from '@/components/Dashboard.vue'

const routes = [
  { path: '/', component: LoginPage },
  { path: '/Register', component: RegisterPage },
  { path: '/dashboard', component: DashboardPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
