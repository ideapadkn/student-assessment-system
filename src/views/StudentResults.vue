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
}
</style>