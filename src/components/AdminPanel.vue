<template>
  <div class="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
    <h2 class="text-xl font-bold mb-4">Add Student</h2>
    <form @submit.prevent="addStudent">
      <input
        v-model="name"
        type="text"
        placeholder="Student Name"
        class="border p-2 w-full mb-3 rounded"
        required
      />
      <input
        v-model="grade"
        type="text"
        placeholder="Grade (A, B, C...)"
        class="border p-2 w-full mb-3 rounded"
        required
      />
      <button class="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
    </form>

    <div class="mt-6">
      <h3 class="font-semibold mb-2">📋 All Students</h3>
      <ul>
        <li v-for="student in students" :key="student.id" class="border-b py-2">
          {{ student.name }} — {{ student.grade }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

const name = ref('');
const grade = ref('');
const students = ref([]);

// 📤 Добавление студента
const addStudent = async () => {
  try {
    await addDoc(collection(db, 'students'), {
      name: name.value,
      grade: grade.value,
    });
    name.value = '';
    grade.value = '';
    fetchStudents(); // обновим список
  } catch (e) {
    console.error("Ошибка при добавлении: ", e);
  }
};

// 📥 Загрузка студентов
const fetchStudents = async () => {
  const snapshot = await getDocs(collection(db, 'students'));
  students.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

onMounted(fetchStudents);
</script>
