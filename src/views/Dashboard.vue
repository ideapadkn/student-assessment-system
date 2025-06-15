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
      <h1 class="main-dash_welcome-title">Добро пожаловать, {{ roleLabel }}</h1>
      <button class="logout-btn" @click="logout">Выйти</button>
    </div>

    <div v-if="role === 'teacher'" class="main-dash_teacher">
      <button class="btn" @click="goTo('create-test')">📘 Создать тест</button>
      <button class="btn" @click="goTo('results')">📊 Смотреть результаты</button>
      <button class="btn" @click="goTo('teacher/students')">👨‍🏫 Управление студентами</button>
    </div>

    <div v-else-if="role === 'student'" class="main-dash_student">
      <button class="btn" @click="goTo('available-tests')">📝 Пройти тест</button>
      <button class="btn" @click="goTo('student-results')">📈 Мои оценки</button>
    </div>

    <div v-else>
      <p class="text-red-600 font-semibold">Ошибка: роль не определена</p>
    </div>

    <div class="btn-ai">
      <router-link to="/chat" class="btn-chat-ai">💬 Чат с ИИ</router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../styles/_variable.scss";

.main-dash {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  color: $primary;
  background-color: $background;
  border-radius: $radius;
  height: 85vh;

  &_welcome {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 2rem;

    &-title {
      font-size: 2rem;
      margin-bottom: 1rem;
      margin-top: 8px;

      @media (max-width: 400px) {
        font-size: 16px;
      }
    }

    .logout-btn {
      background-color: $danger;
      color: white;
      padding: 5px 10px;
      border-radius: $radius;
      border: none;
      cursor: pointer;
      max-height: 50px;

      &:hover {
        background-color: darken($danger, 10%);
      }

      @media (max-width: 400px) {
        max-height: 25px;
        margin-top: 13px;
      }
    }
  }

  .main-dash_teacher, .main-dash_student {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;  

    .btn {
      background-color: $primary;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: $radius;
      border: none;
      cursor: pointer;
      transition: $transition ease;

      &:hover {
        background-color: darken($primary, 10%);
      }
    }
  }

  .btn-ai {
    position: absolute;
    right: 13%;
    bottom: 9%;

    .btn-chat-ai {
      background-color: $primary;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: $radius;
      text-decoration: none;
      transition: $transition ease;

      &:hover {
        background-color: darken($primary, 10%);
      }
    }
  }
}
</style>
