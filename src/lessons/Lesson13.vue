<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { isAuthenticated } from '../stores/auth'

const route = useRoute()
const router = useRouter()

// --- Part 1: In-component Leave Guard Demo ---
const draftText = ref('')
const hasUnsavedChanges = computed(() => draftText.value.trim().length > 0)

// Guard that triggers before user navigates away from this route component
onBeforeRouteLeave((to, from) => {
  if (hasUnsavedChanges.value) {
    const answer = window.confirm(
      '⚠️ Warning: You have unsaved text in your draft field. If you leave, your draft will be discarded.\n\nAre you sure you want to leave?',
    )
    // returning false cancels the navigation transition
    if (!answer) return false
  }
})

const discardDraft = () => {
  draftText.value = ''
  logTerminal('Draft discarded.')
}

// --- Part 2: Global Auth Guard Demo ---
const redirectedNotice = ref('')
const terminalLogs = ref<string[]>(['System: Navigation Guard console ready.'])

const logTerminal = (message: string) => {
  terminalLogs.value.push(`[${new Date().toLocaleTimeString()}] ${message}`)
  if (terminalLogs.value.length > 5) {
    terminalLogs.value.shift()
  }
}

// Watch query string to detect if router redirected us here
watch(
  () => route.query.redirectedFrom,
  (newVal) => {
    if (newVal) {
      redirectedNotice.value = `🛑 Router Guard: Access denied to "${newVal}". You were redirected here because you are logged out.`
      logTerminal(`Guard: Blocked access to ${newVal} (Redirected)`)
    } else {
      redirectedNotice.value = ''
    }
  },
  { immediate: true },
)

const attemptAdminAccess = async () => {
  logTerminal('Navigating to: /lesson/13/admin')
  const navigationFailure = await router.push({ name: 'lesson13-admin' })

  if (navigationFailure) {
    logTerminal('❌ Navigation aborted by global beforeEach guard.')
  } else {
    logTerminal('✓ Navigation allowed. Entered Admin panel.')
  }
}

const toggleLogin = () => {
  isAuthenticated.value = !isAuthenticated.value
  logTerminal(`Auth: Set isAuthenticated = ${isAuthenticated.value}`)
}
</script>

<template>
  <div class="lesson-container">
    <header class="lesson-header">
      <span class="badge">Lesson 13</span>
      <h1>Navigation Guards</h1>
      <p class="subtitle">
        Secure routes with global auth checks and protect unsaved user edits with leave guards.
      </p>
    </header>

    <!-- Display different interface if successfully routed to the admin route -->
    <main v-if="route.name === 'lesson13-admin'" class="lesson-content">
      <section class="card secret-panel animate-pulse-border">
        <div class="secret-header">
          <span class="lock-icon">🔒</span>
          <h2>Protected Secret Area</h2>
          <span class="lock-icon">🔒</span>
        </div>
        <p class="description admin-desc">
          Congratulations! You successfully bypassed the <code>beforeEach</code> global guard
          because <code>isAuthenticated</code> was set to <code>true</code>.
        </p>
        <div class="demo-box secret-box">
          <p>This is a simulated secure admin view rendered at <code>/lesson/13/admin</code>.</p>
          <button @click="router.push({ name: 'lesson13' })" class="btn btn-secondary">
            ↩️ Exit Secure Area
          </button>
        </div>
      </section>
    </main>

    <main v-else class="lesson-content">
      <!-- Redirect notification -->
      <div v-if="redirectedNotice" class="alert-banner">
        {{ redirectedNotice }}
      </div>

      <!-- Card 1: In-component Leave Guard -->
      <section class="card">
        <h2>1. Leave Guard (onBeforeRouteLeave)</h2>
        <p class="description">
          Use the <code>onBeforeRouteLeave</code> hook to intercept navigation. If you type inside
          the textarea below, try clicking any other lesson tab (like L01 or L02). The router will
          block the change and show a confirmation popup!
        </p>

        <div class="demo-box">
          <textarea
            v-model="draftText"
            placeholder="Type some draft text here, then try clicking other lesson tabs..."
            class="draft-textarea"
          ></textarea>
          <div class="draft-status">
            <span
              >Status:
              <strong :class="hasUnsavedChanges ? 'text-unsaved' : 'text-saved'">
                {{ hasUnsavedChanges ? '⚠️ Unsaved Draft Active' : '✓ Empty (Safe to Leave)' }}
              </strong>
            </span>
            <button v-if="hasUnsavedChanges" @click="discardDraft" class="btn btn-danger btn-sm">
              Discard Draft
            </button>
          </div>
        </div>
      </section>

      <!-- Card 2: Global auth guard -->
      <section class="card">
        <h2>2. Global Guard & Meta Fields</h2>
        <p class="description">
          A global <code>beforeEach</code> guard checks if the target route requires authentication
          (configured via <code>meta: { requiresAuth: true }</code>). Toggle your auth state and try
          to enter the secure panel.
        </p>

        <div class="demo-box auth-demo-box">
          <!-- Auth Toggle Switch -->
          <div class="auth-control">
            <span class="auth-label">Authentication Status:</span>
            <button @click="toggleLogin" :class="['btn', 'btn-auth', { logged: isAuthenticated }]">
              {{ isAuthenticated ? '🔓 Logged In (Allow Access)' : '🔒 Logged Out (Deny Access)' }}
            </button>
          </div>

          <div class="divider"></div>

          <div class="button-group">
            <button @click="attemptAdminAccess" class="btn btn-primary btn-panel-trigger">
              🔑 Enter Protected Admin Route (/lesson/13/admin)
            </button>
          </div>

          <div class="divider"></div>

          <!-- Console screen -->
          <div class="terminal-screen">
            <div v-for="(log, idx) in terminalLogs" :key="idx" class="terminal-line">
              <span class="prompt">></span> {{ log }}
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
  background: linear-gradient(135deg, #10b981, #f59e0b);
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
  background: linear-gradient(to right, #10b981, #f59e0b);
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

.alert-banner {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  font-size: 0.9rem;
  text-align: left;
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.draft-textarea {
  width: 100%;
  height: 100px;
  padding: 0.75rem 1rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 0.95rem;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s;
}

.draft-textarea:focus {
  border-color: #10b981;
}

.draft-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 0.85rem;
}

.text-unsaved {
  color: #f59e0b;
}

.text-saved {
  color: #10b981;
}

.auth-demo-box {
  align-items: stretch;
}

.auth-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.auth-label {
  font-weight: 600;
  color: #cbd5e1;
  font-size: 0.95rem;
}

.btn-auth {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
  font-size: 0.85rem;
  width: auto;
}

.btn-auth.logged {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.divider {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
}

.btn-panel-trigger {
  width: 100%;
}

.terminal-screen {
  background: #090d16;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  font-family: 'Fira Code', monospace;
  font-size: 0.8rem;
  color: #10b981;
  text-align: left;
  min-height: 110px;
}

.prompt {
  color: #475569;
}

.terminal-line {
  color: #cbd5e1;
  margin-bottom: 0.25rem;
}

/* Secret Admin View styling */
.secret-panel {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(15, 23, 42, 0.9));
  border: 1px solid rgba(16, 185, 129, 0.25);
  text-align: center;
}

.animate-pulse-border {
  animation: border-pulse 4s infinite alternate;
}

@keyframes border-pulse {
  from {
    border-color: rgba(16, 185, 129, 0.25);
  }
  to {
    border-color: rgba(16, 185, 129, 0.65);
    box-shadow: 0 0 15px rgba(16, 185, 129, 0.15);
  }
}

.secret-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.secret-header h2 {
  color: #10b981;
  font-size: 1.5rem;
  margin: 0;
}

.lock-icon {
  font-size: 1.5rem;
}

.admin-desc {
  color: #cbd5e1;
}

.secret-box {
  background: rgba(9, 13, 22, 0.85);
  padding: 2rem;
  border-color: rgba(16, 185, 129, 0.1);
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

.btn-primary:hover {
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

.btn-danger {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.btn-danger:hover {
  background: rgba(239, 68, 68, 0.25);
}

.btn-sm {
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
}
</style>
