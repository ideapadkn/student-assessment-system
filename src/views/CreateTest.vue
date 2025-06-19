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

<!-- <template>
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
</template> -->

<template>
  <div class="main-test">
    <div class="main-test__container">
      <div class="main-test__header">
        <h2 class="main-test__title">Создание теста</h2>
        <BackButton />
      </div>
      <!-- Скроллируемая область -->
      <div class="main-test__scroll-area">
        <div v-for="(question, index) in questions" :key="index" class="main-test__question">
          <input v-model="title" type="text" placeholder="Название теста" class="input" />
          <input v-model="question.text" placeholder="Вопрос" class="input" />
          <div v-for="(opt, i) in question.options" :key="i" class="main-test__option-row">
            <input v-model="question.options[i]" placeholder="Вариант" class="input mr-2" />
            <input type="radio" :name="'correct-' + index" :value="i" v-model="question.correctIndex" />
          </div>
        </div>
      </div>
      <div class="main-test__actions">
        <button @click="addQuestion" class="btn">➕ Добавить вопрос</button>
        <button @click="saveTest" class="btn">💾 Сохранить тест</button>
      </div>
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

  &__container {
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.07);
    padding: 2.5rem 2rem;
    width: 100%;
    min-height: 70vh;
    max-height: 95vh; // Не больше высоты экрана
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-shrink: 0;
  }

  &__scroll-area {
    flex: 1 1 auto;
    overflow-y: auto;
    min-height: 0; // Для корректной работы flex
    margin-bottom: 2rem;
    padding-right: 8px; // Для скролла, чтобы не перекрывал input
  }

  &__question {
    margin-bottom: 1.5rem;
    background: #f7faff;
    border-radius: 16px;
    padding: 1.5rem 1rem 1rem 1rem;
    box-shadow: 0 2px 8px rgba(66, 133, 244, 0.05);
    display: flex;
    flex-direction: column;

    .input {
      margin-bottom: 10px;
      border-radius: 12px;
      border: 1px solid #ececec;
      padding: 0.7rem 1.1rem;
      font-size: 1.06rem;
      outline: none;
      transition: border .18s;
      background: #fff;

      &:focus {
        border-color: #4285f4;
      }
    }
  }

  &__option-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 7px;

    .input {
      flex: 1 1 auto;
      margin-bottom: 0;
    }

    input[type="radio"] {
      margin-left: 10px;
      accent-color: #4285f4;
      width: 18px;
      height: 18px;
    }
  }

  &__actions {
    margin-top: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;

    .btn {
      width: 100%;
      padding: 1rem 0;
      background: #539cff;
      color: #fff;
      border: none;
      border-radius: 16px;
      font-size: 1.17rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: background 0.15s;

      &:hover {
        background: #4285f4;
      }

      &:active {
        background: #2c6ad9;
      }
    }
  }
}
</style>
