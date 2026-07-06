<script setup lang="ts">
import { ref, computed } from 'vue'
import Lesson06Child from './Lesson06Child.vue'

interface CardItem {
  id: number
  title: string
  likes: number
  theme: 'light' | 'dark'
}

// 1. Parent reactive state
const cards = ref<CardItem[]>([
  { id: 1, title: 'Learn Vue Composition API', likes: 10, theme: 'dark' },
  { id: 2, title: 'Mastering Props & Emits', likes: 25, theme: 'light' },
  { id: 3, title: 'Building Premium UIs', likes: 42, theme: 'dark' },
])

const nextId = ref(4)
const newTitle = ref('')
const newTheme = ref<'light' | 'dark'>('dark')
const commentLogs = ref<string[]>([])

// 2. Computed Property (Lesson 03)
const totalLikes = computed(() => {
  return cards.value.reduce((sum, card) => sum + card.likes, 0)
})

// 3. Parent methods to handle Child Emits
const onUpdateLikes = (cardId: number, updatedLikes: number) => {
  const card = cards.value.find((c) => c.id === cardId)
  if (card) {
    card.likes = updatedLikes
  }
}

const onDeleteCard = (cardId: number) => {
  cards.value = cards.value.filter((c) => c.id !== cardId)
  commentLogs.value.unshift(`🗑️ Removed card #${cardId}`)
}

const onAddComment = (cardId: number, text: string) => {
  const card = cards.value.find((c) => c.id === cardId)
  if (card) {
    commentLogs.value.unshift(`💬 [Card: "${card.title}"] added comment: "${text}"`)
  }
}

// Parent action to create a new card
const createCard = () => {
  const title = newTitle.value.trim()
  if (title) {
    cards.value.push({
      id: nextId.value++,
      title,
      likes: 0,
      theme: newTheme.value,
    })
    newTitle.value = ''
  }
}
</script>

<template>
  <div class="lesson-container">
    <header class="lesson-header">
      <span class="badge">Lesson 06</span>
      <h1>Props & Emits</h1>
      <p class="subtitle">
        Communicate between Parent and Child components with one-way data flow and events.
      </p>
    </header>

    <main class="lesson-content">
      <!-- Card 1: Main explanation -->
      <section class="card">
        <h2>1. Parent Component (Container)</h2>
        <p class="description">
          The parent holds the state. It passes data to the children using **Props**
          (<code>:title</code>, <code>:likes</code>) and listens to changes from children using
          **Emits** (<code>@updateLikes</code>, <code>@addComment</code>).
        </p>

        <div class="demo-box parent-box">
          <div class="parent-stats">
            <span
              >Total Cards: <strong class="val">{{ cards.length }}</strong></span
            >
            <span
              >Total Likes: <strong class="val highlight">{{ totalLikes }}</strong></span
            >
          </div>

          <!-- Add new card form -->
          <form @submit.prevent="createCard" class="card-creator">
            <input
              type="text"
              v-model="newTitle"
              placeholder="New card title..."
              class="text-input"
            />
            <div class="creator-actions">
              <select v-model="newTheme" class="theme-select">
                <option value="dark">Dark Theme</option>
                <option value="light">Light Theme</option>
              </select>
              <button type="submit" class="btn btn-primary">Create Card</button>
            </div>
          </form>
        </div>
      </section>

      <!-- Children rendering area -->
      <section class="card">
        <h2>2. Child Components (Rendered List)</h2>
        <p class="description">
          Below are instances of <code>Lesson06Child.vue</code>. They cannot mutate their own props
          directly. Instead, they emit events up to request modifications from the parent.
        </p>

        <div class="demo-box children-grid" v-if="cards.length > 0">
          <Lesson06Child
            v-for="card in cards"
            :key="card.id"
            :id="card.id"
            :title="card.title"
            :likes="card.likes"
            :theme="card.theme"
            @update-likes="onUpdateLikes"
            @delete-card="onDeleteCard(card.id)"
            @add-comment="onAddComment"
          />
        </div>
        <div v-else class="empty-cards-notice">
          All cards deleted! Create one using the form above.
        </div>
      </section>

      <!-- Comment notifications -->
      <section class="log-section">
        <h3>Activity Log (Emitted from children)</h3>
        <div class="log-box">
          <div v-if="commentLogs.length === 0" class="empty-log">
            No activities emitted from child components yet.
          </div>
          <div v-else class="log-list">
            <div v-for="(log, idx) in commentLogs" :key="idx" class="log-item">
              {{ log }}
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.lesson-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    sans-serif;
  color: #f3f4f6;
}

.lesson-header {
  text-align: center;
  margin-bottom: 3rem;
}

.badge {
  background: linear-gradient(135deg, #8b5cf6, #647eff);
  color: #fff;
  font-weight: 700;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-block;
  margin-bottom: 0.75rem;
}

.lesson-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(to right, #8b5cf6, #647eff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #94a3b8;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.lesson-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.card {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2rem;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
}

.card:hover {
  border-color: rgba(139, 92, 246, 0.4);
}

.card h2 {
  font-size: 1.25rem;
  color: #8b5cf6;
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.description {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.demo-box {
  background: rgba(15, 23, 42, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.parent-box {
  align-items: stretch;
}

.parent-stats {
  display: flex;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.02);
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 500;
  color: #cbd5e1;
}

.val {
  color: #fff;
}

.highlight {
  color: #8b5cf6;
}

.card-creator {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.text-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.text-input:focus {
  border-color: #8b5cf6;
}

.creator-actions {
  display: flex;
  gap: 0.5rem;
}

.theme-select {
  padding: 0.5rem 1rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 0.9rem;
  outline: none;
  cursor: pointer;
}

.btn {
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #8b5cf6;
  color: #fff;
  flex-grow: 1;
}

.btn-primary:hover {
  background: #7c3aed;
  transform: translateY(-1px);
}

.children-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.empty-cards-notice {
  text-align: center;
  color: #64748b;
  font-style: italic;
  padding: 2rem;
}

/* Log Section */
.log-section {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: left;
}

.log-section h3 {
  font-size: 1rem;
  margin-top: 0;
  margin-bottom: 1rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.log-box {
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
}

.empty-log {
  color: #475569;
  font-style: italic;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.log-item {
  color: #cbd5e1;
  border-left: 2px solid #8b5cf6;
  padding-left: 0.75rem;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-5px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
