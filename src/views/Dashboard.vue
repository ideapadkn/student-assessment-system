<template>
  <div class="p-6 min-h-screen bg-gray-50">
    <h1 class="text-3xl font-bold mb-6">👋 Добро пожаловать, {{ roleLabel }}</h1>

    <div v-if="role === 'teacher'" class="space-y-4">
      <button class="btn" @click="goTo('create-test')">📘 Создать тест</button>
      <button class="btn" @click="goTo('results')">📊 Смотреть результаты</button>
      <button class="btn" @click="goTo('students')">👨‍🏫 Управление студентами</button>
    </div>

    <div v-else-if="role === 'student'" class="space-y-4">
      <button class="btn" @click="goTo('available-tests')">📝 Пройти тест</button>
      <button class="btn" @click="goTo('my-results')">📈 Мои оценки</button>
    </div>

    <div v-else>
      <p class="text-red-600 font-semibold">Ошибка: роль не определена</p>
    </div>

    <button class="mt-10 underline text-blue-600" @click="logout">Выйти</button>
  </div>
</template>

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

<style scoped>
.btn {
  @apply w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700;
}
</style>
