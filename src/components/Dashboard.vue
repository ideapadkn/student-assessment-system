<template>
  <button @click="logout" class="mb-4 bg-red-500 text-white px-4 py-1 rounded float-right">Logout</button>
  <div class="max-w-3xl mx-auto bg-white p-6 rounded shadow">
    <h2 class="text-2xl font-bold mb-4">Student List</h2>
    <div v-if="students.length === 0">Загрузка данных...</div>
    <ul v-else class="divide-y divide-gray-200">
      <li v-for="student in students" :key="student.id" class="py-2">
        <strong>{{ student.name }}</strong> — Grade: {{ student.grade }}
      </li>
      <li v-for="student in students" :key="student.id" class="py-2 flex justify-between">
        <div>
          <strong>{{ student.name }}</strong> —
          <input v-model="student.grade" class="border rounded px-2 py-1 w-16" />
        </div>
        <button @click="saveGrade(student)" class="text-green-600 hover:underline">Save</button>
      </li>

    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { auth } from '../firebase';

const students = ref([]);
onMounted(async () => {
  const response = await fetch('/students.json');
  students.value = await response.json();
});

const saveGrade = (student) => {
  alert(`Saved grade for ${student.name}: ${student.grade}`);
  // В реальности можно отправить PUT-запрос или обновить Firebase
};

const router = useRouter();
const logout = async () => {
  await signOut(auth);
  router.push('/');
};

</script>
