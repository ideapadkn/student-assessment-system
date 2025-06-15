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

<template>
  <div class="main-login">
    <div class="main-login_page">
      <h2 class="main-login_title">Вход</h2>
      <form class="main-login_form" @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" class="input" required />
        <input v-model="password" type="password" placeholder="Пароль" class="input" required />
        <button type="submit" class="btn">Войти</button>
      </form>
      <p class="main-login_pretitle">Нет аккаунта? <router-link class="link" to="/register">Зарегистрироваться</router-link></p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../styles/_variable.scss';

.main-login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 95vh;
  color: $primary;

  &_page {
    width: 100%;
    max-width: 300px;
    padding: 2rem;
    background-color: $background;
    border-radius: $radius;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;

    .main-login_title {
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .main-login_form {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;

      .input {
        margin-bottom: 20px;
        width: 100%;
      }

      .btn {
        background-color: $primary;
        padding: 0.75rem;
        border-radius: 4px;
        cursor: pointer;
        margin-bottom: 20px;
        width: 110%;

        &:hover {
          background-color: darken($primary, 10%);
        }
      }
    }

    .main-login_pretitle {
      margin-top: 1rem;
      font-size: 1rem;
      color: black;

      .link {
        color: $primary;
        text-decoration: underline;

        &:hover {
          color: darken($primary, 10%);
        }
      }
    }
  }
}
</style>
