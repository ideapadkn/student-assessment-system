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
            <button class="btn">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
@import '../styles/_variable';

.main-students {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  color: $primary;
  background-color: $background;
  border-radius: $radius;
  height: 85vh;

  &_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      text-align: left;
      padding: 0.5rem;

      .btn {
        background-color: #e3342f;
        padding: 5px 10px;

        &:hover {
          background-color: #cc1f1a;
        }
      }
    }

    th {
      font-weight: bold;
    }
  }
}
</style>