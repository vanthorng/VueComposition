<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

// 1. Get the current route object (contains path, params, query)
const route = useRoute()

// 2. Get the global router instance (used to navigate programmatically)
const router = useRouter()

// Programmatic navigation actions
const goToLesson = (lessonNumber: number) => {
  router.push(`/lesson/${lessonNumber}`)
}

const goToRandomUser = () => {
  const users = ['Thai', 'Emma', 'John', 'Sophia']
  const randomUser = users[Math.floor(Math.random() * users.length)]
  router.push(`/lesson/9/user/${randomUser}`)
}

const addQueryParam = (key: string, value: string) => {
  // Update query parameters while staying on the same page
  router.push({
    path: route.path,
    query: {
      ...route.query,
      [key]: value,
    },
  })
}

const clearQueryParams = () => {
  router.push({ path: route.path, query: {} })
}
</script>

<template>
  <div class="lesson-container">
    <header class="lesson-header">
      <span class="badge">Lesson 09</span>
      <h1>Router Basics</h1>
      <p class="subtitle">Navigate single-page applications dynamically using Vue Router.</p>
    </header>

    <main class="lesson-content">
      <!-- Card 1: Route Inspector -->
      <section class="card">
        <h2>1. Active Route Inspector</h2>
        <p class="description">
          The <code>useRoute()</code> hook returns the active route object. Inspect its reactive
          properties below:
        </p>

        <div class="demo-box inspector-box">
          <div class="inspector-item">
            <span class="label">Full Path (route.path):</span>
            <code class="val path">{{ route.path }}</code>
          </div>

          <div class="inspector-item">
            <span class="label">Route Params (route.params):</span>
            <pre class="val-block">{{ JSON.stringify(route.params, null, 2) }}</pre>
          </div>

          <div class="inspector-item">
            <span class="label">Query Params (route.query):</span>
            <pre class="val-block">{{ JSON.stringify(route.query, null, 2) }}</pre>
          </div>
        </div>
      </section>

      <!-- Card 2: Declarative Navigation -->
      <section class="card">
        <h2>2. Declarative Navigation (RouterLink)</h2>
        <p class="description">
          Use the <code>&lt;RouterLink&gt;</code> component to navigate between pages without
          triggering a browser refresh.
        </p>

        <div class="demo-box">
          <div class="link-grid">
            <div class="link-group">
              <h4>Dynamic Parameters (:username)</h4>
              <div class="buttons-layout">
                <!-- Links that change route params -->
                <RouterLink to="/lesson/9/user/alex" class="nav-link">👤 Profile: Alex</RouterLink>
                <RouterLink to="/lesson/9/user/jane" class="nav-link">👤 Profile: Jane</RouterLink>
              </div>
            </div>

            <div class="link-group">
              <h4>Query Parameters (?key=value)</h4>
              <div class="buttons-layout">
                <!-- Links that change query params -->
                <RouterLink
                  :to="{ path: '/lesson/9', query: { theme: 'dark', sort: 'desc' } }"
                  class="nav-link"
                >
                  ⚙️ Dark Mode & Sort
                </RouterLink>
                <RouterLink
                  :to="{ path: '/lesson/9', query: { category: 'tutorials' } }"
                  class="nav-link"
                >
                  📂 Tutorials Category
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Card 3: Programmatic Navigation -->
      <section class="card">
        <h2>3. Programmatic Navigation (useRouter)</h2>
        <p class="description">
          Navigate programmatically inside the JavaScript script using the
          <code>useRouter()</code> hook.
        </p>

        <div class="demo-box">
          <div class="button-group">
            <button @click="goToLesson(1)" class="btn btn-secondary">⏮️ Go to Lesson 01</button>
            <button @click="goToLesson(8)" class="btn btn-secondary">⏮️ Go to Lesson 08</button>
            <button @click="goToRandomUser" class="btn btn-primary">🎲 Random User Param</button>
          </div>

          <div class="divider"></div>

          <div class="button-group">
            <button @click="addQueryParam('time', Date.now().toString())" class="btn btn-toggle">
              ⏱️ Set Query timestamp
            </button>
            <button @click="clearQueryParams" class="btn btn-danger">❌ Clear Query Params</button>
            <button @click="router.go(-1)" class="btn btn-secondary">
              ↩️ Go Back (router.go(-1))
            </button>
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
  background: linear-gradient(135deg, #3b82f6, #647eff);
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
  background: linear-gradient(to right, #3b82f6, #647eff);
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
  border-color: rgba(59, 130, 246, 0.4);
}

.card h2 {
  font-size: 1.25rem;
  color: #3b82f6;
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

.inspector-box {
  text-align: left;
  align-items: stretch;
  gap: 1.25rem;
}

.inspector-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #94a3b8;
}

code.val.path {
  font-family: 'Fira Code', monospace;
  font-size: 1.05rem;
  color: #60a5fa;
  background: rgba(59, 130, 246, 0.1);
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.val-block {
  margin: 0;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  color: #cbd5e1;
  overflow-x: auto;
}

.link-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  width: 100%;
  text-align: left;
}

.link-group h4 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  color: #cbd5e1;
}

.buttons-layout {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-link {
  display: block;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #94a3b8;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #fff;
  border-color: rgba(59, 130, 246, 0.3);
}

.button-group {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  justify-content: center;
}

.divider {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
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
  background: #3b82f6;
  color: #fff;
}

.btn-primary:hover {
  background: #2563eb;
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

.btn-toggle {
  background: linear-gradient(135deg, #3b82f6, #647eff);
  color: #fff;
}

.btn-toggle:hover {
  opacity: 0.95;
  transform: translateY(-1px);
}

.btn-danger {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.btn-danger:hover {
  background: rgba(239, 68, 68, 0.25);
}

@media (max-width: 640px) {
  .link-grid {
    grid-template-columns: 1fr;
  }
}
</style>
