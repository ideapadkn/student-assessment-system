<template>
  <div class="main-login">
    <div class="main-login_page">
      <h2 class="main-login_title">Вход</h2>
      <form class="main-login_form" @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" class="input" required />
        <input v-model="password" type="password" placeholder="Пароль" class="input" required />
        <button type="submit" class="btn">Войти</button>
      </form>
      <p class="main-login_pretitle">Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link></p>
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
.main-login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

  .main-login_page {
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    width: 300px;
  }

  .main-login_title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .main-login_form {
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
  }

  .main-login_pretitle {
    margin-top: 1rem;
    text-align: center;
  }
}
</style>
