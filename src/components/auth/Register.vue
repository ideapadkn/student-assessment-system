<template>
  <form @submit.prevent="registerUser">
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password"   />

    <!-- 👇 ВЫБОР РОЛИ -->
    <select v-model="role" class="border p-2 rounded w-full mb-3">
      <option value="student">Student</option>
      <option value="teacher">Teacher</option>
    </select>

    <button type="submit" class="...">Register</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const role = ref('student'); // по умолчанию student
const router = useRouter();
const errorMessage = ref('');

const registerUser = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    // ✅ сохраняем роль в Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: email.value,
      role: role.value
    });
    router.push('/dashboard');
  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>
