<template>
  <div class="max-w-3xl mx-auto bg-white p-6 rounded">
    <h2 class="text-2xl font-bold mb-4">Test Results</h2>
    <ul>
      <li v-for="res in results" :key="res.id" class="border-b py-2">
        <p><strong>{{ res.user }}</strong> — {{ res.score }} / {{ res.total }}</p>
        <p class="text-gray-500 text-sm">{{ formatDate(res.date) }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

const results = ref([]);

const formatDate = date => new Date(date).toLocaleString();

onMounted(async () => {
  const snapshot = await getDocs(collection(db, 'results'));
  results.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
});
</script>
