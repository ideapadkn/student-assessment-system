<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-6 rounded shadow w-96">
      <h2 class="text-2xl font-bold mb-4">Вход</h2>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" class="input" required />
        <input v-model="password" type="password" placeholder="Пароль" class="input" required />
        <button type="submit" class="btn">Войти</button>
      </form>
      <p class="mt-2 text-sm">Нет аккаунта? <router-link to="/register" class="text-blue-500">Зарегистрироваться</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { useRouter } from 'vue-router';
import { doc, getDoc } from 'firebase/firestore';

const email = ref('');
const password = ref('');
const router = useRouter();

const login = async () => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.value, password.value);

    // Запрашиваем данные пользователя
    const docRef = doc(db, "users", cred.user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      localStorage.setItem('userRole', data.role);
    }

    router.push('/dashboard');
  } catch (error) {
    alert('Ошибка входа: ' + error.message);
  }
};
</script>


<style scoped>
.input {
  @apply w-full p-2 border rounded mb-3;
}
.btn {
  @apply w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700;
}
</style>
