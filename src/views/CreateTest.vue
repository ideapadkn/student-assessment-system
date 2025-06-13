<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Создание теста</h2>

    <input v-model="title" type="text" placeholder="Название теста" class="input" />

    <div v-for="(question, index) in questions" :key="index" class="mb-4">
      <input v-model="question.text" placeholder="Вопрос" class="input" />
      <div v-for="(opt, i) in question.options" :key="i" class="flex mb-1">
        <input v-model="question.options[i]" placeholder="Вариант" class="input mr-2" />
        <input type="radio" :name="'correct-' + index" :value="i" v-model="question.correctIndex" />
      </div>
    </div>

    <button @click="addQuestion" class="btn">➕ Добавить вопрос</button>
    <button @click="saveTest" class="btn mt-4">💾 Сохранить тест</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { db } from '../firebase/config'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const title = ref('')
const questions = ref([
  { text: '', options: ['', '', '', ''], correctIndex: 0 }
])

const addQuestion = () => {
  questions.value.push({ text: '', options: ['', '', '', ''], correctIndex: 0 })
}

const saveTest = async () => {
  const test = {
    title: title.value,
    questions: questions.value,
    createdAt: serverTimestamp()
  }

  await addDoc(collection(db, 'tests'), test)
  alert('Тест сохранён!')
}
</script>

<style scoped>
.input {
  @apply w-full border p-2 rounded mb-2;
}
.btn {
  @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700;
}
</style>
