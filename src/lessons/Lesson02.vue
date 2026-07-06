<script setup lang="ts">
import { ref } from 'vue'

// 1. Reactive state
const score = ref(0)
const notifications = ref<string[]>([])
const usernameInput = ref('')
const guestList = ref<string[]>([])

// 2. Methods (Simple JS/TS functions)
// In <script setup>, any declared function acts as a "method" and is available in the template.

// Method with custom argument
const adjustScore = (amount: number) => {
  score.value += amount
}

// Method showing event object access
const handleCustomClick = (message: string, event: MouseEvent) => {
  // We can pass arguments AND access the native event object
  const clientX = event.clientX
  const clientY = event.clientY
  addNotification(`${message} (Coords: X=${clientX}, Y=${clientY})`)
}

// Form submit method with custom logic
const addGuest = () => {
  const trimmed = usernameInput.value.trim()
  if (trimmed) {
    guestList.value.push(trimmed)
    usernameInput.value = ''
    addNotification(`Added guest: "${trimmed}"`)
  }
}

// Helper to push to notification feed
const addNotification = (msg: string) => {
  notifications.value.unshift(`${new Date().toLocaleTimeString()}: ${msg}`)
  if (notifications.value.length > 5) {
    notifications.value.pop() // keep only last 5
  }
}

const claimOneTimeReward = () => {
  score.value += 100
  addNotification('🎉 Claimed 100 points reward! (This button is now disabled/non-clickable)')
}
</script>

<template>
  <div class="lesson-container">
    <header class="lesson-header">
      <span class="badge">Lesson 02</span>
      <h1>Methods & Events</h1>
      <p class="subtitle">Learn how to write component methods and handle complex DOM events.</p>
    </header>

    <main class="lesson-content">
      <!-- Card 1: Methods with Arguments -->
      <section class="card">
        <h2>1. Methods & Custom Arguments</h2>
        <p class="description">
          Methods are plain functions. You can trigger them in templates using
          <code>@click="myMethod"</code> or pass custom parameters directly using
          <code>@click="myMethod(value)"</code>.
        </p>
        <div class="demo-box">
          <div class="score-display">
            Current Score: <span class="highlight">{{ score }}</span>
          </div>
          <div class="button-group">
            <button @click="adjustScore(-5)" class="btn btn-danger">-5</button>
            <button @click="adjustScore(-1)" class="btn btn-secondary">-1</button>
            <button @click="adjustScore(1)" class="btn btn-primary">+1</button>
            <button @click="adjustScore(5)" class="btn btn-success">+5</button>
          </div>
        </div>
      </section>

      <!-- Card 2: Event Modifiers (.prevent, .enter) -->
      <section class="card">
        <h2>2. Event Modifiers</h2>
        <p class="description">
          Vue provides event modifiers like <code>.prevent</code> (stops page reload) and key
          modifiers like <code>.enter</code> (triggers only on Enter keypress).
        </p>
        <div class="demo-box">
          <form @submit.prevent="addGuest" class="form-container">
            <div class="input-row">
              <input
                type="text"
                v-model="usernameInput"
                placeholder="Enter guest name..."
                class="text-input"
              />
              <button type="submit" class="btn btn-primary">Add Guest</button>
            </div>
            <p class="hint">
              Press Enter key or click "Add Guest" to submit. Notice the page doesn't reload!
            </p>
          </form>

          <div class="guest-list-box" v-if="guestList.length > 0">
            <h3>Guest List ({{ guestList.length }})</h3>
            <ul>
              <li v-for="(guest, idx) in guestList" :key="idx">👤 {{ guest }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Card 3: Once Modifier & Native Event Access -->
      <section class="card">
        <h2>3. Once Modifier & $event</h2>
        <p class="description">
          Use the <code>.once</code> modifier to run a method at most once. Use
          <code>$event</code> to pass the native event object inside inline templates.
        </p>
        <div class="demo-box">
          <div class="button-group">
            <!-- Event listener with .once modifier -->
            <button @click.once="claimOneTimeReward" class="btn btn-toggle">
              🎁 Claim One-Time Reward (+100)
            </button>

            <!-- Passing both custom args and event object -->
            <button @click="handleCustomClick('Button clicked!', $event)" class="btn btn-secondary">
              Inspect Click Coordinates
            </button>
          </div>
        </div>
      </section>

      <!-- Activity/Log Feed -->
      <section class="log-section">
        <h3>Activity Log</h3>
        <div class="log-box">
          <div v-if="notifications.length === 0" class="empty-log">
            No events triggered yet. Interact with the elements above!
          </div>
          <div v-else class="log-list">
            <div v-for="(note, idx) in notifications" :key="idx" class="log-item">
              {{ note }}
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
  background: linear-gradient(135deg, #a855f7, #647eff);
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
  background: linear-gradient(to right, #a855f7, #647eff);
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
  border-color: rgba(168, 85, 247, 0.4);
}

.card h2 {
  font-size: 1.25rem;
  color: #a855f7;
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
  color: #c084fc;
}

.demo-box {
  background: rgba(15, 23, 42, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.score-display {
  font-size: 1.1rem;
  font-weight: 500;
}

.highlight {
  color: #a855f7;
  font-weight: 700;
  font-size: 1.2rem;
}

.button-group {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  padding: 0.6rem 1.2rem;
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #a855f7;
  color: #fff;
}

.btn-primary:hover {
  background: #9333ea;
  transform: translateY(-1px);
}

.btn-secondary {
  background: rgba(148, 163, 184, 0.2);
  color: #f8fafc;
}

.btn-secondary:hover {
  background: rgba(148, 163, 184, 0.3);
  transform: translateY(-1px);
}

.btn-success {
  background: #22c55e;
  color: #0f172a;
}

.btn-success:hover {
  background: #16a34a;
  transform: translateY(-1px);
}

.btn-danger {
  background: #ef4444;
  color: #fff;
}

.btn-danger:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

.btn-toggle {
  background: linear-gradient(135deg, #647eff, #a855f7);
  color: #fff;
}

.btn-toggle:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.form-container {
  width: 100%;
}

.input-row {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.text-input {
  flex-grow: 1;
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
  border-color: #a855f7;
}

.hint {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 0.5rem;
  margin-bottom: 0;
  text-align: left;
}

.guest-list-box {
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 1rem;
  text-align: left;
}

.guest-list-box h3 {
  font-size: 1rem;
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #e2e8f0;
}

.guest-list-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.guest-list-box li {
  background: rgba(255, 255, 255, 0.03);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.9rem;
}

/* Log Section */
.log-section {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
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
  border-left: 2px solid #a855f7;
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
