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
        <router-link class="link" to="/login">Войти</router-link>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../styles/_variable.scss';

.main-register {
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
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;

    .main-register_title {
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .main-register_form {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;

      .input,
      .select-input {
        margin-bottom: 20px;
        width: 100%;
      }

      .btn {
        padding: 0.75rem;
        background-color: $primary;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-bottom: 20px;
        width: 100%;

        &:hover {
          background-color: darken($primary, 10%);
        }
      }
    }

    .main-register_pretitle {
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