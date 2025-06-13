<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-6 rounded shadow w-96">
      <h2 class="text-2xl font-bold mb-4">Регистрация</h2>
      <form @submit.prevent="register">
        <input v-model="email" type="email" placeholder="Email" class="input" required />
        <input v-model="password" type="password" placeholder="Пароль" class="input" required />

        <select v-model="role" class="input" required>
          <option value="">Выберите роль</option>
          <option value="student">Студент</option>
          <option value="teacher">Учитель</option>
        </select>

        <button type="submit" class="btn">Зарегистрироваться</button>
      </form>

      <p class="mt-2 text-sm">Уже есть аккаунт?
        <router-link to="/login" class="text-blue-500">Войти</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { useRouter } from 'vue-router';
import { setDoc, doc } from 'firebase/firestore';

const email = ref('');
const password = ref('');
const role = ref('');
const router = useRouter();

const register = async () => {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.value, password.value);

    // Сохраняем роль в Firestore
    await setDoc(doc(db, "users", cred.user.uid), {
      email: email.value,
      role: role.value,
    });

    // сохраняем локально
    localStorage.setItem('userRole', role.value);

    router.push('/dashboard');
  } catch (error) {
    alert(error.message);
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
