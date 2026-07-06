<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'

// --- Demo 1: API / Mock Search (Asynchronous Side Effect) ---
const searchQuery = ref('')
const searchResult = ref('')
const isLoading = ref(false)

// Watch a single ref
// We can access both the new value and old value
watch(searchQuery, (newQuery, oldQuery) => {
  if (!newQuery.trim()) {
    searchResult.value = ''
    return
  }

  isLoading.value = true
  searchResult.value = 'Searching...'

  // Simulating an asynchronous API fetch (debounced/delayed)
  const timer = setTimeout(() => {
    // Make sure search query hasn't changed during the delay
    if (newQuery === searchQuery.value) {
      searchResult.value = `✨ Found results for "${newQuery}" (Simulated data)`
      isLoading.value = false
    }
  }, 800)

  // Cleaning up previous timers (Vue's onCleanup argument can also do this, but keeping it simple)
  return () => clearTimeout(timer)
})

// --- Demo 2: Local Storage Persistence (Immediate Watcher) ---
// Initialize from localStorage if it exists
const savedNotes = ref(localStorage.getItem('lesson04_notes') || '')

// Watch with { immediate: true }
// immediate: true runs the handler immediately upon initialization
watch(
  savedNotes,
  (newNotes) => {
    localStorage.setItem('lesson04_notes', newNotes)
  },
  { immediate: false }, // We can explain how changing this to true affects initialization
)

// --- Demo 3: Deep Watching & watchEffect ---
const settings = ref({
  theme: 'dark',
  notifications: true,
})

const changeLog = ref<string[]>([])

// Deep watcher
// Without { deep: true }, changes to nested properties (like settings.value.theme) won't trigger this!
watch(
  settings,
  (newVal) => {
    changeLog.value.unshift(
      `Deep watch triggered: Theme is now "${newVal.theme}", Notifications is ${newVal.notifications}`,
    )
  },
  { deep: true },
)

// watchEffect: Automatically registers dependencies used inside its callback
// Runs immediately on start, and runs whenever settings.value.theme changes
const effectLogs = ref<string[]>([])
watchEffect(() => {
  // It automatically tracks `settings.value.theme` because we access it inside the effect
  effectLogs.value.unshift(`watchEffect: Theme switched to "${settings.value.theme}"`)
})
</script>

<template>
  <div class="lesson-container">
    <header class="lesson-header">
      <span class="badge">Lesson 04</span>
      <h1>watch() & watchEffect()</h1>
      <p class="subtitle">
        Perform asynchronous tasks and side effects in response to state changes.
      </p>
    </header>

    <main class="lesson-content">
      <!-- Card 1: Async search watcher -->
      <section class="card">
        <h2>1. Watcher for Asynchronous Tasks</h2>
        <p class="description">
          Use <code>watch()</code> when you need to perform side effects (like network calls,
          timers, or logging) when state changes.
        </p>

        <div class="demo-box">
          <div class="input-field full-width">
            <label>Search (triggers simulated API call):</label>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Type to search..."
              class="text-input"
            />
          </div>

          <div class="search-result-box">
            <span v-if="isLoading" class="spinner">⏳ Processing...</span>
            <span v-else class="result-text">{{ searchResult || 'Waiting for query...' }}</span>
          </div>
        </div>
      </section>

      <!-- Card 2: Local Storage & immediate option -->
      <section class="card">
        <h2>2. Side Effects & LocalStorage</h2>
        <p class="description">
          Watchers are perfect for saving state automatically. Any changes made in the textarea
          below are instantly saved to <code>localStorage</code>. Try refreshing the page to verify!
        </p>

        <div class="demo-box">
          <textarea
            v-model="savedNotes"
            placeholder="Write some notes to save to localStorage..."
            class="note-textarea"
          ></textarea>
          <div class="status-indicator">
            💾 Auto-saved to LocalStorage: <span class="highlight">lesson04_notes</span>
          </div>
        </div>
      </section>

      <!-- Card 3: Deep Watch vs watchEffect -->
      <section class="card">
        <h2>3. Deep Watch vs watchEffect()</h2>
        <p class="description">
          Use <code>{ deep: true }</code> to watch changes inside nested properties of an object.
          Alternatively, use <code>watchEffect()</code> which automatically tracks dependencies.
        </p>

        <div class="demo-box">
          <div class="settings-controls">
            <button
              @click="settings.theme = settings.theme === 'dark' ? 'light' : 'dark'"
              class="btn btn-secondary"
            >
              Toggle Theme (Current: {{ settings.theme }})
            </button>
            <button
              @click="settings.notifications = !settings.notifications"
              class="btn btn-secondary"
            >
              Toggle Notifications (Current: {{ settings.notifications }})
            </button>
          </div>

          <div class="logs-grid">
            <div class="log-column">
              <h4>deep: true watch Logs</h4>
              <div class="log-list">
                <div v-for="(log, idx) in changeLog.slice(0, 3)" :key="idx" class="log-item purple">
                  {{ log }}
                </div>
              </div>
            </div>
            <div class="log-column">
              <h4>watchEffect Logs</h4>
              <div class="log-list">
                <div v-for="(log, idx) in effectLogs.slice(0, 3)" :key="idx" class="log-item cyan">
                  {{ log }}
                </div>
              </div>
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
  background: linear-gradient(135deg, #e11d48, #647eff);
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
  background: linear-gradient(to right, #e11d48, #647eff);
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
  border-color: rgba(225, 29, 72, 0.4);
}

.card h2 {
  font-size: 1.25rem;
  color: #e11d48;
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.description {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

code {
  background: rgba(15, 23, 42, 0.6);
  padding: 0.2rem 0.4rem;
  border-radius: 6px;
  font-family: 'Fira Code', monospace;
  font-size: 0.85em;
  color: #fda4af;
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

.input-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  text-align: left;
}

.input-field.full-width {
  width: 100%;
}

.input-field label {
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 600;
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
  border-color: #e11d48;
}

.search-result-box {
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  min-height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.result-text {
  color: #e2e8f0;
}

.spinner {
  color: #e11d48;
}

.note-textarea {
  width: 100%;
  height: 120px;
  padding: 0.75rem 1rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s ease;
}

.note-textarea:focus {
  border-color: #e11d48;
}

.status-indicator {
  font-size: 0.85rem;
  color: #94a3b8;
}

.highlight {
  color: #e11d48;
  font-weight: bold;
}

.settings-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  width: 100%;
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

.btn-secondary {
  background: rgba(148, 163, 184, 0.15);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.btn-secondary:hover {
  background: rgba(148, 163, 184, 0.25);
  transform: translateY(-1px);
}

.logs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  width: 100%;
  margin-top: 1rem;
  text-align: left;
}

.log-column h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #cbd5e1;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-family: 'Fira Code', monospace;
  font-size: 0.75rem;
}

.log-item {
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.02);
}

.log-item.purple {
  border-left: 2px solid #a855f7;
  color: #d8b4fe;
}

.log-item.cyan {
  border-left: 2px solid #06b6d4;
  color: #a5f3fc;
}

@media (max-width: 640px) {
  .logs-grid {
    grid-template-columns: 1fr;
  }
}
</style>
