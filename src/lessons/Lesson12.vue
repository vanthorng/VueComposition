<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const terminalLogs = ref<string[]>([
  'System: Programmatic Navigation console initialized.',
  'System: Click any command button below to run router operations.',
])

const logTerminal = (message: string) => {
  terminalLogs.value.push(`[${new Date().toLocaleTimeString()}] ${message}`)
  // keep last 8 logs
  if (terminalLogs.value.length > 8) {
    terminalLogs.value.shift()
  }
}

// Named routes push
const navByRouteName = async () => {
  logTerminal("Running: router.push({ name: 'lesson1' })")
  await router.push({ name: 'lesson1' })
}

// Push with parameters
const navWithParams = async () => {
  logTerminal("Running: router.push({ name: 'lesson10-profile', params: { userId: 'user-2' } })")
  await router.push({ name: 'lesson10-profile', params: { userId: 'user-2' } })
}

// Replace route
const navWithReplace = async () => {
  logTerminal("Running: router.replace({ name: 'lesson8' })")
  await router.replace({ name: 'lesson8' })
}

// Query parameters push
const navWithQuery = async () => {
  logTerminal("Running: router.push({ name: 'lesson11', query: { q: 'monitor', sort: 'desc' } })")
  await router.push({ name: 'lesson11', query: { q: 'monitor', sort: 'desc' } })
}

// Go backward / forward
const navGoBack = () => {
  logTerminal('Running: router.go(-1)')
  router.go(-1)
}

const navGoForward = () => {
  logTerminal('Running: router.go(1)')
  router.go(1)
}
</script>

<template>
  <div class="lesson-container">
    <header class="lesson-header">
      <span class="badge">Lesson 12</span>
      <h1>Programmatic Navigation</h1>
      <p class="subtitle">
        Redirect users and control browser history programmatically using router methods.
      </p>
    </header>

    <main class="lesson-content">
      <!-- Card 1: Console -->
      <section class="card">
        <h2>1. Navigation Console Terminal</h2>
        <p class="description">
          Execute programmatic routes. **Note:** Since these are real routing operations, executing
          a command will instantly load the matched lesson page!
        </p>

        <div class="demo-box terminal-box">
          <div class="terminal-screen">
            <div v-for="(log, idx) in terminalLogs" :key="idx" class="terminal-line">
              <span class="prompt">></span> {{ log }}
            </div>
          </div>
        </div>
      </section>

      <!-- Card 2: Command list -->
      <section class="card">
        <h2>2. Programmatic Navigation Methods</h2>
        <p class="description">
          Compare different navigation methods using path names, route parameters, and query
          parameters.
        </p>

        <div class="demo-box commands-grid">
          <!-- Command A -->
          <div class="command-card">
            <h3>Named Push (Standard)</h3>
            <p class="hint">
              Navigates to a specific route name. Adds a new entry to the history stack.
            </p>
            <code>router.push({ name: 'lesson1' })</code>
            <button @click="navByRouteName" class="btn btn-primary">Run Command</button>
          </div>

          <!-- Command B -->
          <div class="command-card">
            <h3>Push with Params</h3>
            <p class="hint">Forwards dynamic route parameters to decoupled components.</p>
            <code>router.push({ name: 'lesson10-profile', params: { userId: 'user-2' } })</code>
            <button @click="navWithParams" class="btn btn-primary">Run Command</button>
          </div>

          <!-- Command C -->
          <div class="command-card">
            <h3>Replace State</h3>
            <p class="hint">
              Replaces the active route. User cannot click the Back button to return here.
            </p>
            <code>router.replace({ name: 'lesson8' })</code>
            <button @click="navWithReplace" class="btn btn-toggle">Run Command</button>
          </div>

          <!-- Command D -->
          <div class="command-card">
            <h3>Push with Query</h3>
            <p class="hint">Loads a route directly with pre-populated URL query strings.</p>
            <code>router.push({ name: 'lesson11', query: { q: 'monitor' } })</code>
            <button @click="navWithQuery" class="btn btn-primary">Run Command</button>
          </div>
        </div>
      </section>

      <!-- Card 3: History modification -->
      <section class="card">
        <h2>3. History Manipulation (router.go)</h2>
        <p class="description">
          Navigate backwards or forwards through the user's browser history stack by specific steps.
        </p>

        <div class="demo-box history-box">
          <div class="button-group">
            <button @click="navGoBack" class="btn btn-secondary">⬅️ Go Back (router.go(-1))</button>
            <button @click="navGoForward" class="btn btn-secondary">
              ➡️ Go Forward (router.go(1))
            </button>
          </div>
          <p class="hint">
            Go back acts like the browser Back button. Forward acts like the browser Forward button.
          </p>
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
  background: linear-gradient(135deg, #f43f5e, #647eff);
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
  background: linear-gradient(to right, #f43f5e, #647eff);
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
  border-color: rgba(244, 63, 94, 0.4);
}

.card h2 {
  font-size: 1.25rem;
  color: #f43f5e;
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
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-family: 'Fira Code', monospace;
  font-size: 0.8em;
  color: #fda4af;
  word-break: break-all;
  display: inline-block;
  width: 100%;
  text-align: left;
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

.terminal-box {
  background: #090d16;
  border: 1px solid rgba(244, 63, 94, 0.2);
  align-items: stretch;
}

.terminal-screen {
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  color: #f43f5e;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 140px;
  text-align: left;
}

.prompt {
  color: #64748b;
  user-select: none;
}

.terminal-line {
  color: #cbd5e1;
  animation: scan 0.2s ease-out;
}

@keyframes scan {
  from {
    opacity: 0;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.commands-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  width: 100%;
  background: transparent;
  border: none;
  padding: 0;
}

.command-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  justify-content: space-between;
}

.command-card h3 {
  font-size: 1rem;
  margin: 0;
  color: #f8fafc;
}

.button-group {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.btn-primary {
  background: #f43f5e;
  color: #fff;
}

.btn-primary:hover {
  background: #e11d48;
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
  background: linear-gradient(135deg, #f43f5e, #647eff);
  color: #fff;
}

.btn-toggle:hover {
  opacity: 0.95;
  transform: translateY(-1px);
}

.hint {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

@media (max-width: 640px) {
  .commands-grid {
    grid-template-columns: 1fr;
  }
}
</style>
