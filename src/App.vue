<script setup lang="ts">
import { ref } from 'vue'
import Lesson01 from './lessons/Lesson01.vue'
import Lesson02 from './lessons/Lesson02.vue'
import Lesson03 from './lessons/Lesson03.vue'
import Lesson04 from './lessons/Lesson04.vue'
import Lesson05 from './lessons/Lesson05.vue'
import Lesson06 from './lessons/Lesson06.vue'
import Lesson07 from './lessons/Lesson07.vue'

const currentLesson = ref(7) // Default to the newest lesson
</script>

<template>
  <div class="app-container">
    <nav class="navigation-bar">
      <span class="nav-title">Vue 3 Composition API Course</span>
      <div class="tab-group">
        <button @click="currentLesson = 1" :class="['tab-btn', { active: currentLesson === 1 }]">
          Lesson 01: ref()
        </button>
        <button @click="currentLesson = 2" :class="['tab-btn', { active: currentLesson === 2 }]">
          Lesson 02: Methods
        </button>
        <button @click="currentLesson = 3" :class="['tab-btn', { active: currentLesson === 3 }]">
          Lesson 03: computed()
        </button>
        <button @click="currentLesson = 4" :class="['tab-btn', { active: currentLesson === 4 }]">
          Lesson 04: watch()
        </button>
        <button @click="currentLesson = 5" :class="['tab-btn', { active: currentLesson === 5 }]">
          Lesson 05: reactive()
        </button>
        <button @click="currentLesson = 6" :class="['tab-btn', { active: currentLesson === 6 }]">
          Lesson 06: Props & Emits
        </button>
        <button @click="currentLesson = 7" :class="['tab-btn', { active: currentLesson === 7 }]">
          Lesson 07: Composables
        </button>
      </div>
    </nav>

    <div class="content-container">
      <Lesson01 v-if="currentLesson === 1" />
      <Lesson02 v-else-if="currentLesson === 2" />
      <Lesson03 v-else-if="currentLesson === 3" />
      <Lesson04 v-else-if="currentLesson === 4" />
      <Lesson05 v-else-if="currentLesson === 5" />
      <Lesson06 v-else-if="currentLesson === 6" />
      <Lesson07 v-else-if="currentLesson === 7" />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 4rem 0;
}

.navigation-bar {
  width: 100%;
  max-width: 900px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.nav-title {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: linear-gradient(135deg, #42d392, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.tab-group {
  display: flex;
  gap: 0.5rem;
}

.tab-btn {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #94a3b8;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.tab-btn.active {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.05);
}

.content-container {
  width: 100%;
  max-width: 800px;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .navigation-bar {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
}
</style>
