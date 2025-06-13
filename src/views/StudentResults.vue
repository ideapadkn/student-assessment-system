<script setup>
import { onMounted, ref } from 'vue'
import { auth, db } from '@/firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import BackButton from '../components/ui/BackButton.vue'

const results = ref(null)

onMounted(async () => {
  const user = auth.currentUser
  if (user) {
    const resultDoc = await getDoc(doc(db, 'results', user.uid))
    if (resultDoc.exists()) {
      results.value = resultDoc.data()
    }
  }
})
</script>

<template>
  <div class="main-results">
    <div class="main-results_header">
      <h2 class="text-xl font-bold mb-4">Мои результаты</h2>
      <BackButton />
    </div>
    <div v-if="results">
      <ul>
        <li v-for="(value, key) in results" :key="key">
          <strong>{{ key }}:</strong> {{ value }}%
        </li>
      </ul>
    </div>
    <p v-else>Результаты не найдены.</p>
  </div>
</template>

<style scoped>
.main-results {
  padding: 1rem;
  .main-results_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .main-results_title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    margin: 0.5rem 0;
    font-size: 1.2rem;
  }
  strong {
    font-weight: bold;
  }
  p {
    font-size: 1.2rem;
    color: #666;
  }
  .btn {
    background-color: #4a90e2;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.3s;
    &:hover {
      background-color: #357abd;
    }
  }
}

</style>