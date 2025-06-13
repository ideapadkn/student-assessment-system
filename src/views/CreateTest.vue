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

<template>
  <div class="main-test">
    <h2 class="main-test_title">Создание теста</h2>
    
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

<style scoped>
.main-test {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;

  .main-test_title {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .input {
    width: 60%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .main-test_question {
    margin-bottom: 1.5rem;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;

    .input {
      width: 60%;
      margin-bottom: 0.5rem;
    }

    .main-test_option {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;

      .input {
        width: 100%;
        margin-right: 0.5rem;
      }
    }
  }

  .main-test_actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;

    .btn {
      padding: 0.5rem 1rem;
      background-color: #646cff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: #2563eb;
      }
    }
  }
}
</style>
