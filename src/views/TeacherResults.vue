<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase/config'
import { collection, getDocs } from 'firebase/firestore'

const results = ref([])
const tests = ref([])

const fetchResults = async () => {
  const snap = await getDocs(collection(db, 'results'))
  results.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

const fetchTests = async () => {
  const snap = await getDocs(collection(db, 'tests'))
  tests.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

const getTestTitle = (id) => {
  const test = tests.value.find(t => t.id === id)
  return test?.title || 'Не найден'
}

const formatDate = (iso) => {
  return new Date(iso).toLocaleString()
}

onMounted(() => {
  fetchResults()
  fetchTests()
})
</script>

<template>
  <div class="main-results">
    <h2 class="main-results_title">Результаты студентов</h2>

    <table class="main-results_table">
      <thead class="bg-gray-200">
        <tr>
          <th class="border px-2 py-1">#</th>
          <th class="border px-2 py-1">Email</th>
          <th class="border px-2 py-1">Тест</th>
          <th class="border px-2 py-1">Оценка</th>
          <th class="border px-2 py-1">Процент</th>
          <th class="border px-2 py-1">Дата</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(result, index) in results" :key="result.id">
          <td class="border px-2 py-1">{{ index + 1 }}</td>
          <td class="border px-2 py-1">{{ result.email }}</td>
          <td class="border px-2 py-1">{{ getTestTitle(result.testId) }}</td>
          <td class="border px-2 py-1">{{ result.grade }}</td>
          <td class="border px-2 py-1">{{ result.score }}%</td>
          <td class="border px-2 py-1">{{ formatDate(result.date) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.main-results {
  padding: 2rem;
  max-width: 800px;
  margin: auto;

  .main-results_title {
    font-size: 2rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  .main-results_table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      text-align: left;
      padding: 0.5rem;
      border: 1px solid #ddd;
    }

    th {
      background-color: hsl(0, 0%, 18%);
    }
  }
}
</style>
