<!-- <script setup>
import { ref } from 'vue'
import { collection, getDocs, doc, addDoc } from 'firebase/firestore'
import { db, auth } from '../firebase/config'
import BackButton from '../components/ui/BackButton.vue'

const tests = ref([])
const currentTest = ref(null)
const answers = ref([])

const fetchTests = async () => {
  const snapshot = await getDocs(collection(db, 'tests'))
  tests.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}
fetchTests()

const startTest = (test) => {
  currentTest.value = test
  answers.value = Array(test.questions.length).fill(null)
}

const submitAnswers = async () => {
  const correct = currentTest.value.questions.filter((q, i) => q.correctIndex == answers.value[i])
  const percent = Math.round((correct.length / currentTest.value.questions.length) * 100)
  const grade =
    percent >= 90 ? 'отлично' :
    percent >= 75 ? 'хорошо' :
    percent >= 60 ? 'удовлетворительно' : 'неудовлетворительно'

  await addDoc(collection(db, 'results'), {
    testId: currentTest.value.id,
    userId: auth.currentUser.uid,
    email: auth.currentUser.email,
    score: percent,
    grade,
    date: new Date().toISOString()
  })

  alert(`Ваш результат: ${percent}% (${grade})`)
  currentTest.value = null
}
</script>

<template>
  <div class="main-tests">
    <div class="main-tests_header">
      <h2 class="main-tests_title">Выбери тест</h2>
      <BackButton />
    </div>
    <div v-for="test in tests" :key="test.id" class="main-tests_test">
      <h3 class="text-xl">{{ test.title }}</h3>
      <button class="btn mt-2" @click="startTest(test)">Начать</button>
    </div>

    <div v-if="currentTest" class="main-tests_current">
      <h2 class="main-tests_current-title">{{ currentTest.title }}</h2>
      <div v-for="(q, index) in currentTest.questions" :key="index">
        <p class="font-semibold">{{ index + 1 }}. {{ q.text }}</p>
        <div v-for="(opt, i) in q.options" :key="i">
          <label><input type="radio" :name="'q' + index" :value="i" v-model="answers[index]" /> {{ opt }}</label>
        </div>
      </div>
      <button @click="submitAnswers" class="btn mt-4">📩 Отправить</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../styles/_variable.scss";

.main-tests {
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

  &_test {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    .btn {
      height: 34px;
      padding: 0 15px;
    }
  }
}
</style> -->

<script setup>
import { ref } from 'vue'
import { collection, getDocs, addDoc } from 'firebase/firestore'
import { db, auth } from '../firebase/config'
import BackButton from '../components/ui/BackButton.vue'

const tests = ref([])
const currentTest = ref(null)
const answers = ref([])

const fetchTests = async () => {
  const snapshot = await getDocs(collection(db, 'tests'))
  tests.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}
fetchTests()

const startTest = (test) => {
  currentTest.value = test
  answers.value = Array(test.questions.length).fill(null)
}

const goBackToList = () => {
  currentTest.value = null
}

const submitAnswers = async () => {
  const correct = currentTest.value.questions.filter((q, i) => q.correctIndex == answers.value[i])
  const percent = Math.round((correct.length / currentTest.value.questions.length) * 100)
  const grade =
    percent >= 90 ? 'отлично' :
      percent >= 75 ? 'хорошо' :
        percent >= 60 ? 'удовлетворительно' : 'неудовлетворительно'

  await addDoc(collection(db, 'results'), {
    testId: currentTest.value.id,
    userId: auth.currentUser.uid,
    email: auth.currentUser.email,
    score: percent,
    grade,
    date: new Date().toISOString()
  })

  alert(`Ваш результат: ${percent}% (${grade})`)
  currentTest.value = null
}
</script>

<template>
  <div class="tests-wrapper">
    <div class="main-tests">
      <div class="main-tests_header">
        <h2 class="main-tests_title">
          {{ currentTest ? "Прохождение теста" : "Выбери тест" }}
        </h2>
        <BackButton v-if="!currentTest" />
        <BackButton v-if="currentTest" @click="goBackToList" />
      </div>
      <!-- Список тестов -->
      <transition name="fade">
        <div v-if="!currentTest" class="main-tests_list">
          <div v-for="test in tests" :key="test.id" class="main-tests_test-card">
            <div>
              <h3>{{ test.title }}</h3>
              <div class="test-questions-count">{{ test.questions.length }} вопросов</div>
            </div>
            <button class="btn" @click="startTest(test)">Начать</button>
          </div>
        </div>
      </transition>
      <!-- Один тест -->
      <transition name="slide">
        <div v-if="currentTest" class="main-tests_current">
          <h2 class="main-tests_current-title">{{ currentTest.title }}</h2>
          <div class="questions-scroll">
            <div v-for="(q, index) in currentTest.questions" :key="index" class="question-block">
              <div class="question-number">{{ index + 1 }}.</div>
              <p class="question-text">{{ q.text }}</p>
              <div class="options">
                <label v-for="(opt, i) in q.options" :key="i" class="option-label">
                  <input type="radio" :name="'q' + index" :value="i" v-model="answers[index]" />
                  {{ opt }}
                </label>
              </div>
            </div>
          </div>
          <button @click="submitAnswers" class="btn btn-submit mt-4">📩 Отправить</button>
        </div>
      </transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../styles/_variable.scss";

// Контейнер для всего
.tests-wrapper {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  color: $primary;
  background-color: $background;
  border-radius: $radius;
  height: 85vh;
}

// Белый фон — всё содержимое не выходит за рамки!
.main-tests {
  border-radius: 2rem;
  width: 100%;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

// Header и заголовок
.main-tests_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: .5rem;
}

.main-tests_title {
  font-size: 1.55rem;
  font-weight: 700;
  color: #1a2344;
  letter-spacing: 1px;
}

.btn-back {
  background: transparent;
  border: none;
  font-size: 1.08rem;
  color: #6686fb;
  cursor: pointer;
  transition: color .2s;

  &:hover {
    color: #3251e1;
  }
}

// Список тестов
.main-tests_list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding-top: 1rem;
}

.main-tests_test-card {
  background: #f7f8fa;
  border-radius: 1rem;
  box-shadow: 0 2px 14px 0 rgba(80, 115, 203, 0.05);
  padding: 1.2rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: box-shadow .18s;

  &:hover {
    box-shadow: 0 6px 24px 0 rgba(80, 115, 203, 0.11);
  }

  h3 {
    font-weight: 600;
    margin-bottom: 0.22em;
    color: #1a2344;
  }

  .test-questions-count {
    font-size: .98em;
    color: #7992bb;
    margin-top: 0.08em;
  }

  .btn {
    min-width: 86px;
  }
}

// Текущий тест (вопросы)
.main-tests_current {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  padding-top: 1rem;
  height: 68vh; // Вся зона теста

  .questions-scroll {
    overflow-y: auto;
    max-height: 47vh; // регулируй под себя
    padding-right: 8px;
    margin-bottom: 1.3rem;

    // Скрываем некрасивый скроллбар, оставляя для Win
    scrollbar-width: thin;
    scrollbar-color: #7fb6ff #f3f5fa;

    &::-webkit-scrollbar {
      width: 7px;
      background: #f3f5fa;
      border-radius: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background: #d3e7fa;
      border-radius: 8px;
    }
  }
}

// Вопрос
.question-block {
  background: #f3f5fa;
  border-radius: 1.1rem;
  padding: 1rem 1.1rem;
  box-shadow: 0 1px 5px 0 rgba(80, 115, 203, 0.07);
  margin-bottom: 1.1rem;

  .question-number {
    font-size: 1.09rem;
    font-weight: 600;
    color: #6686fb;
    margin-bottom: .18em;
  }

  .question-text {
    font-size: 1.08rem;
    margin-bottom: .48em;
    color: #2b3452;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 0.38em;
  }

  .option-label {
    font-size: 1.02rem;
    background: #eef2fb;
    border-radius: .7em;
    padding: .34em .72em;
    cursor: pointer;
    display: flex;
    align-items: center;

    input[type='radio'] {
      margin-right: 0.7em;
      accent-color: #6686fb;
    }

    transition: background .13s;

    &:hover {
      background: #dfe6fa;
    }
  }
}

// Кнопки
.btn,
.btn-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 1em;
  background: linear-gradient(90deg, #6686fb 0%, #47d5ff 100%);
  color: #fff;
  font-size: 1.05rem;
  font-weight: 600;
  padding: 0.55em 1.35em;
  box-shadow: 0 2px 8px 0 rgba(60, 119, 223, 0.13);
  transition: background .18s, box-shadow .18s;
  cursor: pointer;

  &:hover {
    background: linear-gradient(90deg, #3251e1 0%, #23a8d6 100%);
    box-shadow: 0 6px 18px 0 rgba(60, 119, 223, 0.21);
  }

  &.mt-4 {
    margin-top: 1.2em;
  }
}

// Анимации (optional, для плавности)
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active {
  transition: all 0.33s cubic-bezier(.4, 2.3, .3, 1);
  transform: translateY(20px);
  opacity: 0;
}

.slide-enter-to {
  transform: none;
  opacity: 1;
}
</style>
