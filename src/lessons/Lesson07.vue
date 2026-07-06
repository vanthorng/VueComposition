<script setup lang="ts">
import { useMouse } from '../composables/useMouse'
import { useCounter } from '../composables/useCounter'

// 1. Consume the mouse tracker composable
const { x, y } = useMouse()

// 2. Consume the counter composable multiple times
// This shows that composable state is INDEPENDENT for each invocation.
const counterA = useCounter(10, { min: 0, max: 20 })
const counterB = useCounter(100, { min: 50, max: 150 })
</script>

<template>
  <div class="lesson-container">
    <header class="lesson-header">
      <span class="badge">Lesson 07</span>
      <h1>Composables</h1>
      <p class="subtitle">Encapsulate and reuse stateful logic across components.</p>
    </header>

    <main class="lesson-content">
      <!-- Card 1: useMouse Composable -->
      <section class="card">
        <h2>1. Event Listener Composable (useMouse)</h2>
        <p class="description">
          Composables can handle lifecycles (like binding events on <code>onMounted</code> and
          cleaning up on <code>onUnmounted</code>) to encapsulate window actions.
        </p>

        <div class="demo-box mouse-box">
          <div class="mouse-tracker">
            <span class="coord-label">Cursor X:</span>
            <span class="coord-val highlight">{{ x }}px</span>
            <span class="coord-label">Cursor Y:</span>
            <span class="coord-val highlight">{{ y }}px</span>
          </div>
          <p class="hint">
            Move your mouse cursor around the browser window to see the coordinates update.
          </p>
        </div>
      </section>

      <!-- Card 2: Independent stateful logic -->
      <section class="card">
        <h2>2. Independent Stateful Logic (useCounter)</h2>
        <p class="description">
          Every time you call a composable function, it gets a completely **fresh, isolated state**.
          Here, we use the same <code>useCounter</code> logic twice, but their counts are
          independent.
        </p>

        <div class="demo-box counters-grid">
          <!-- Counter A -->
          <div class="counter-card">
            <h3>Counter A (Range: 0 - 20)</h3>
            <div class="count-val">{{ counterA.count }}</div>
            <div class="btn-group">
              <button @click="counterA.decrement(2)" class="btn btn-secondary">-2</button>
              <button @click="counterA.decrement(1)" class="btn btn-secondary">-1</button>
              <button @click="counterA.reset()" class="btn btn-danger">Reset</button>
              <button @click="counterA.increment(1)" class="btn btn-primary">+1</button>
              <button @click="counterA.increment(2)" class="btn btn-primary">+2</button>
            </div>
          </div>

          <!-- Counter B -->
          <div class="counter-card">
            <h3>Counter B (Range: 50 - 150)</h3>
            <div class="count-val">{{ counterB.count }}</div>
            <div class="btn-group">
              <button @click="counterB.decrement(10)" class="btn btn-secondary">-10</button>
              <button @click="counterB.decrement(5)" class="btn btn-secondary">-5</button>
              <button @click="counterB.reset()" class="btn btn-danger">Reset</button>
              <button @click="counterB.increment(5)" class="btn btn-primary">+5</button>
              <button @click="counterB.increment(10)" class="btn btn-primary">+10</button>
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
  background: linear-gradient(135deg, #10b981, #647eff);
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
  background: linear-gradient(to right, #10b981, #647eff);
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
  align-items: center;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.mouse-box {
  padding: 2rem;
}

.mouse-tracker {
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.coord-label {
  color: #94a3b8;
  font-size: 1.1rem;
}

.coord-val {
  min-width: 80px;
  text-align: left;
}

.highlight {
  color: #10b981;
}

.counters-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  width: 100%;
  background: transparent;
  border: none;
  padding: 0;
}

.counter-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.counter-card h3 {
  font-size: 0.95rem;
  margin: 0;
  color: #cbd5e1;
}

.count-val {
  font-size: 2.5rem;
  font-weight: 800;
  color: #10b981;
  font-family: 'Fira Code', monospace;
}

.btn-group {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
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

.hint {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 0.5rem;
  margin-bottom: 0;
}

@media (max-width: 640px) {
  .counters-grid {
    grid-template-columns: 1fr;
  }
}
</style>
