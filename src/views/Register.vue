<template>
  <div class="main-register">
    <div class="main-register_page">
      <h2 class="main-register_title">Регистрация</h2>
      <form class="main-register_form" @submit.prevent="register">
        <input v-model="email" type="email" placeholder="Email" class="input" required />
        <input v-model="password" type="password" placeholder="Пароль" class="input" required />

        <select v-model="role" class="select-input" required>
          <option value="">Выберите роль</option>
          <option value="student">Студент</option>
          <option value="teacher">Учитель</option>
        </select>

        <button type="submit" class="btn">Зарегистрироваться</button>
      </form>

      <p class="main-register_pretitle">Уже есть аккаунт?
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
.main-register {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

  .main-register_page {
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    width: 300px;
  }

  .main-register_title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .main-register_form {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .input {
      padding: 1rem;
      border: 1px solid #646cff;
      border-radius: 4px;
      outline: none;
      transition: border-color 0.3s;
    }

    .select-input {
      appearance: none;
      background-color: #242424;
      border: 2px solid #646cff;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 16px;
      color: #fff;
      width: 100%;
      max-width: 400px;
      cursor: pointer;
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
      font-family: 'Segoe UI', sans-serif;

      &:hover {
        border-color: #2563eb;
      }

      &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
      }

      option {
        background-color: #fff;
        color: #111827;
      }
    }

  }

  .main-register_pretitle {
    margin-top: 1rem;
    text-align: center;
  }
}
</style>