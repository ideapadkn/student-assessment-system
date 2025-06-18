<script setup>
import { ref } from 'vue'
import { db } from '../firebase/config'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import BackButton from '../components/ui/BackButton.vue'

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

<template>
  <div class="main-test">
    <div class="main-test_header">
      <h2 class="main-test_title">Создание теста</h2>
      <BackButton />
    </div>
    
    <div v-for="(question, index) in questions" :key="index" class="main-test_question">
      <input v-model="title" type="text" placeholder="Название теста" class="input" />
      <input v-model="question.text" placeholder="Вопрос" class="input" />
      <div v-for="(opt, i) in question.options" :key="i" class="main-test_option">
        <input v-model="question.options[i]" placeholder="Вариант" class="input mr-2" />
        <input type="radio" :name="'correct-' + index" :value="i" v-model="question.correctIndex" />
      </div>
    </div>

    <div class="main-test_actions">
      <button @click="addQuestion" class="btn">➕ Добавить вопрос</button>
      <button @click="saveTest" class="btn mt-4">💾 Сохранить тест</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../styles/_variable';

.main-test {
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
  &_question {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    .input {
      margin-bottom: 10px;
    }
  }
  &_actions {
    display: flex;
    flex-direction: column;
    .btn {
      margin-top: 10px;
    }
  }
}
</style>
