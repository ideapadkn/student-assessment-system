<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

const router = useRouter();
const role = ref(null);

onMounted(() => {
  const storedRole = localStorage.getItem('userRole');
  if (storedRole) {
    role.value = storedRole;
  } else {
    router.push('/login');
  }
});

const logout = async () => {
  await signOut(auth);
  localStorage.clear();
  router.push('/login');
};

const goTo = (path) => {
  router.push('/' + path);
};

const roleLabel = computed(() => {
  if (role.value === 'teacher') return 'учитель';
  if (role.value === 'student') return 'студент';
  return 'пользователь';
});
</script>

<template>
  <div class="main-dash">
    <div class="main-dash_welcome">
      <h1 class="main-dash_welcome-title">👋 Добро пожаловать, {{ roleLabel }}</h1>
      <button class="logout-btn" @click="logout">Выйти</button>
    </div>

    <div v-if="role === 'teacher'" class="main-dash_teacher">
      <button class="btn" @click="goTo('create-test')">📘 Создать тест</button>
      <button class="btn" @click="goTo('results')">📊 Смотреть результаты</button>
      <button class="btn" @click="goTo('students')">👨‍🏫 Управление студентами</button>
    </div>

    <div v-else-if="role === 'student'" class="main-dash_student">
      <button class="btn" @click="goTo('available-tests')">📝 Пройти тест</button>
      <button class="btn" @click="goTo('my-results')">📈 Мои оценки</button>
    </div>

    <div v-else>
      <p class="text-red-600 font-semibold">Ошибка: роль не определена</p>
    </div>
  </div>
</template>

<style scoped>
.main-dash {
  padding: 2rem;
  max-width: 800px;
  margin: auto;
  .main-dash_welcome {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .main-dash_welcome-title {
      font-size: 2.2rem;
      font-weight: bold;
    }
    .logout-btn {
      background-color: #f87171;
      color: white;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: background-color 0.3s;
      &:hover {
        background-color: #ef4444;
      }
    }
  }
  .main-dash_teacher {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .main-dash_student {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
