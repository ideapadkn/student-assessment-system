import { createRouter, createWebHistory } from "vue-router";
import Login from "./components/Auth/Login.vue";
import Register from "./components/Auth/Register.vue";
import Dashboard from "./components/Dashboard.vue";
import AdminPanel from "./components/AdminPanel.vue";
import Quiz from "./components/Quiz.vue";
import { auth } from "./firebase";

const routes = [
  { path: "/", component: Login }, // 👈 по умолчанию
  { path: "/register", component: Register },
  { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true } },
  {
    path: "/admin",
    component: AdminPanel,
    meta: { requiresAuth: true, adminOnly: true },
  },
  {
    path: "/quiz",
    component: Quiz,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🔐 Глобальный навигационный хук
router.beforeEach((to, from, next) => {
  const user = auth.currentUser;
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth);
  const adminOnly = to.matched.some((r) => r.meta.adminOnly);
  const role = localStorage.getItem("role");

  if (requiresAuth && !user) {
    next("/");
  } else if (adminOnly && role !== "teacher") {
    next("/dashboard"); // не учитель — назад!
  } else {
    next();
  }
});

export default router;
