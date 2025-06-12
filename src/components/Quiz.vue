<template>
  <div class="max-w-xl mx-auto bg-white p-6 rounded">
    <h2 class="text-xl font-bold mb-4">Quiz</h2>
    <div v-if="currentQuestion < questions.length">
      <p class="mb-2">{{ questions[currentQuestion].question }}</p>
      <div v-for="option in questions[currentQuestion].options" :key="option">
        <label class="block mb-1">
          <input type="radio" :value="option" v-model="selectedAnswer" />
          {{ option }}
        </label>
      </div>
      <button @click="submitAnswer" class="mt-3 bg-blue-500 text-white px-4 py-2 rounded">Next</button>
    </div>
    <div v-else>
      <h3 class="text-lg font-semibold">You scored {{ score }} / {{ questions.length }}</h3>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const questions = ref([]);
const currentQuestion = ref(0);
const selectedAnswer = ref('');
const score = ref(0);

onMounted(async () => {
  const res = await fetch('/test.json');
  questions.value = await res.json();
});

const submitAnswer = () => {
  if (selectedAnswer.value === questions.value[currentQuestion.value].answer) {
    score.value++;
  }
  selectedAnswer.value = '';
  currentQuestion.value++;
};
</script>
