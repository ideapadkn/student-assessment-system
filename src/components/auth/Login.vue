<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">🔐 Login</h2>

      <form @submit.prevent="loginUser" class="space-y-4">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
          required
        />
        <button
          type="submit"
          class="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>

      <p class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>

      <div class="text-center mt-6 text-sm text-gray-600">
        Нет аккаунта?
        <router-link to="/register" class="text-blue-600 hover:underline font-medium">
          Зарегистрироваться
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const loginUser = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/dashboard');
  } catch (error) {
    console.error(error.code, error.message);
    errorMessage.value = error.message;
  }
};
</script>
