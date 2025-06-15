import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Dashboard from "../views/Dashboard.vue";
import CreateTest from "../views/CreateTest.vue";
import AvailableTests from "../views/AvailableTests.vue";
import TeacherResults from "../views/TeacherResults.vue";
import StudentResults from "../views/StudentResults.vue";
import TeacherStudents from "../views/TeacherStudents.vue";
import Chat from "@/components/chat/Chat.vue";

const routes = [
  {
    path: "/student-results",
    name: "StudentResults",
    component: StudentResults,
  },
  {
    path: "/teacher/students",
    name: "TeacherStudents",
    component: TeacherStudents,
  },
  {
    path: "/chat",
    name: "Chat",
    component: Chat,
    meta: { requiresAuth: true }, // доступ только авторизованным
  },
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/dashboard", component: Dashboard },
  { path: "/create-test", component: CreateTest },
  { path: "/available-tests", component: AvailableTests },
  { path: "/results", component: TeacherResults },
  // { path: '/my-results', component: MyResults },
];

const router = createRouter({
  history: createWebHistory('#'),
  routes,
});

export default router;
