<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFetch } from '../composables/useFetch'

// --- Part 1: Raw Inline Fetching Demo ---
interface User {
  id: number
  name: string
  email: string
  company: { name: string }
}

const users = ref<User[] | null>(null)
const inlineLoading = ref(false)
const inlineError = ref<string | null>(null)

const fetchUsersInline = async () => {
  inlineLoading.value = true
  inlineError.value = null
  users.value = null

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    users.value = await response.json()
  } catch (err: any) {
    inlineError.value = err.message || 'Error fetching users'
  } finally {
    inlineLoading.value = false
  }
}

// --- Part 2: Composable Fetching with Reactive URL ---
interface Post {
  id: number
  title: string
  body: string
}

const selectedUserId = ref(1)

// Reactive URL computed from the selectedUserId ref
const postsUrl = computed(() => {
  return `https://jsonplaceholder.typicode.com/posts?userId=${selectedUserId.value}`
})

// useFetch automatically watches postsUrl and re-fetches when it changes!
const {
  data: posts,
  error: postsError,
  isLoading: postsLoading,
  refetch,
} = useFetch<Post[]>(postsUrl)
</script>

<template>
  <div class="lesson-container">
    <header class="lesson-header">
      <span class="badge">Lesson 14</span>
      <h1>API Data Fetching</h1>
      <p class="subtitle">
        Manage async operations, loading states, errors, and encapsulate API logic into clean
        composables.
      </p>
    </header>

    <main class="lesson-content">
      <!-- Card 1: Raw Fetching -->
      <section class="card">
        <h2>1. Inline API Fetching (Basic)</h2>
        <p class="description">
          Basic fetching handles asynchronous states manually. Click the button to trigger a
          standard <code>fetch()</code> block using <code>try / catch / finally</code>.
        </p>

        <div class="demo-box inline-fetch-box">
          <button @click="fetchUsersInline" :disabled="inlineLoading" class="btn btn-primary">
            {{ inlineLoading ? '⏳ Fetching Users...' : '📥 Fetch Users List' }}
          </button>

          <!-- Loading state -->
          <div v-if="inlineLoading" class="status-box loading">
            <span class="spinner">⏳</span> Loading users from public JSONPlaceholder API...
          </div>

          <!-- Error state -->
          <div v-if="inlineError" class="status-box error">🛑 Error: {{ inlineError }}</div>

          <!-- Data state -->
          <div v-if="users" class="users-list">
            <div v-for="user in users.slice(0, 4)" :key="user.id" class="user-item">
              <span class="u-name">{{ user.name }}</span>
              <span class="u-email">{{ user.email }}</span>
              <span class="u-company">🏢 {{ user.company.name }}</span>
            </div>
            <p v-if="users.length > 4" class="hint">Showing 4 of {{ users.length }} mock users.</p>
          </div>
        </div>
      </section>

      <!-- Card 2: useFetch Composable -->
      <section class="card">
        <h2>2. Stateful Composable (useFetch)</h2>
        <p class="description">
          Encapsulating request states into a custom <code>useFetch</code> composable makes your
          code clean and reusable. By passing a computed URL ref, the composable automatically
          re-fetches when dependencies change!
        </p>

        <div class="demo-box composable-box">
          <div class="user-filter">
            <label>Filter Posts by User ID:</label>
            <select v-model="selectedUserId" class="select-input">
              <option v-for="i in 5" :key="i" :value="i">User {{ i }}</option>
            </select>
            <button @click="refetch" class="btn btn-secondary btn-refresh" title="Refetch data">
              🔄 Force Refetch
            </button>
          </div>

          <div class="divider"></div>

          <!-- Loading state -->
          <div v-if="postsLoading" class="status-box loading">
            <span class="spinner">⏳</span> Fetching posts for User {{ selectedUserId }}...
          </div>

          <!-- Error state -->
          <div v-if="postsError" class="status-box error">🛑 Error: {{ postsError }}</div>

          <!-- Data state -->
          <div v-if="posts" class="posts-list">
            <div v-for="post in posts" :key="post.id" class="post-item">
              <h4 class="p-title">{{ post.title }}</h4>
              <p class="p-body">{{ post.body }}</p>
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
  background: linear-gradient(135deg, #10b981, #3b82f6);
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
  background: linear-gradient(to right, #10b981, #3b82f6);
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
  border-color: rgba(16, 185, 129, 0.4);
}

.card h2 {
  font-size: 1.25rem;
  color: #10b981;
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

.inline-fetch-box {
  align-items: center;
}

.status-box {
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: left;
  width: 100%;
}

.status-box.loading {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #93c5fd;
}

.status-box.error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}

.spinner {
  display: inline-block;
  animation: rotation 2s infinite linear;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(350deg);
  }
}

.users-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
  text-align: left;
}

.user-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.u-name {
  font-weight: 700;
  color: #f1f5f9;
}

.u-email {
  font-size: 0.85rem;
  color: #38bdf8;
  font-family: 'Fira Code', monospace;
}

.u-company {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-top: 0.25rem;
}

.user-filter {
  display: flex;
  gap: 1rem;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
}

.user-filter label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #cbd5e1;
}

.select-input {
  padding: 0.6rem 1rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 0.9rem;
  outline: none;
  cursor: pointer;
}

.select-input:focus {
  border-color: #10b981;
}

.divider {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  text-align: left;
  max-height: 380px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

/* Scrollbar styling for post list */
.posts-list::-webkit-scrollbar {
  width: 6px;
}
.posts-list::-webkit-scrollbar-track {
  background: transparent;
}
.posts-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}
.posts-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

.post-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  padding: 1.25rem;
}

.p-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.05rem;
  color: #f1f5f9;
  text-transform: capitalize;
}

.p-body {
  margin: 0;
  font-size: 0.9rem;
  color: #94a3b8;
  line-height: 1.45;
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
  background: #10b981;
  color: #0f172a;
}

.btn-primary:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
}

.btn-secondary {
  background: rgba(148, 163, 184, 0.15);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.btn-secondary:hover {
  background: rgba(148, 163, 184, 0.25);
  transform: translateY(-1px);
}

.btn-refresh {
  font-size: 0.85rem;
  padding: 0.5rem 1rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hint {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 0.5rem;
  margin-bottom: 0;
}

@media (max-width: 640px) {
  .users-list {
    grid-template-columns: 1fr;
  }
  .user-filter {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
}
</style>
