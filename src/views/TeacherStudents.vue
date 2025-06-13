<script setup>
import { onMounted, ref } from 'vue'
import { db } from '@/firebase/config'
import { collection, getDocs } from 'firebase/firestore'
import BackButton from '../components/ui/BackButton.vue'

const students = ref([])

onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, 'users'))
  students.value = querySnapshot.docs
    .filter(doc => doc.data().role === 'student')
    .map(doc => ({ id: doc.id, ...doc.data() }))
})
</script>

<template>
  <div class="main-students">
    <div class="main-students_header">
      <h2 class="text-xl font-bold mb-4">Управление студентами</h2>
      <BackButton />
    </div>
    <table class="w-full border">
      <thead>
        <tr class="bg-gray-100">
          <th class="border px-4 py-2">Имя</th>
          <th class="border px-4 py-2">Email</th>
          <th class="border px-4 py-2">Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student.id">
          <td class="border px-4 py-2">{{ student.name || '—' }}</td>
          <td class="border px-4 py-2">{{ student.email }}</td>
          <td class="border px-4 py-2">
            <button class="bg-red-500 text-white px-2 py-1 rounded">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.main-students {
  padding: 1rem;

  .main-students_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .main-students_title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    border: 1px solid #ccc;
    padding: 0.5rem;
    text-align: left;
  }

  th {
    background-color: #242424;
  }

  td {
    background-color: #242424;
  }

  button {
    background-color: #e3342f;
    color: white;
    padding: 0.25rem 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #cc1f1a;
    }
  }
}
</style>