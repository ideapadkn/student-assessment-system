import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import CreateTest from '../views/CreateTest.vue'
import AvailableTests from '../views/AvailableTests.vue'
import TeacherResults from '../views/TeacherResults.vue'
// import MyResults from '../views/MyResults.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard },
  { path: '/create-test', component: CreateTest },
  { path: '/available-tests', component: AvailableTests },
  { path: '/results', component: TeacherResults }
  // { path: '/my-results', component: MyResults },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
