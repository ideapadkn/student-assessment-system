<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase/config'
import { collection, getDocs } from 'firebase/firestore'
import BackButton from '../components/ui/BackButton.vue'

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
    <div class="main-results_header">
      <h2 class="main-results_title">Результаты студентов</h2>
      <BackButton />
    </div>

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

<style lang="scss" scoped>
@import '../styles/_variable';

.main-results {
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

  &_table {
    width: 100%;
    border-collapse: collapse;

    th, td {
      text-align: left;
      padding: 8px;
      border-bottom: 1px solid #ddd;
      margin-bottom: 5px;
    }

    th {
      background-color: #f2f2f2;
    }
  }
}
</style>
