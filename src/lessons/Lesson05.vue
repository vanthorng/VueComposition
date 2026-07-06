<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue'

// --- Demo 1: Basic reactive() object ---
// reactive() accepts an object and makes it reactive without needing .value
const formState = reactive({
  username: 'Coder123',
  level: 1,
  stats: {
    strength: 10,
    agility: 12,
  },
})

const levelUp = () => {
  formState.level++ // No .value needed!
  formState.stats.strength += 2
  formState.stats.agility += 2
}

// --- Demo 2: Destructuring reactivity loss ---
const brokenState = reactive({ count: 0 })
// This count variable is just a plain number now. Reactivity is LOST!
let { count } = brokenState

const incrementBroken = () => {
  brokenState.count++
  // brokenState.count changes, but our destructured local variable 'count' does not update!
  console.log(`brokenState.count: ${brokenState.count}, destructured count: ${count}`)
}

// How to fix it: toRefs()
const fixedState = reactive({ count: 0 })
// toRefs() converts a reactive object to a plain object where each property is a Ref pointing to the original
const { count: fixedCount } = toRefs(fixedState)

const incrementFixed = () => {
  fixedState.count++
  // fixedCount is a ref, so it maintains connection!
}

// --- Demo 3: Replacing object issue ---
let replaceableState = reactive({ value: 'Initial Value' })

const tryReplaceBroken = () => {
  // Attempting to replace the whole object breaks reactivity
  replaceableState = reactive({ value: 'Replaced Object' })
  // In the console, the variable is updated, but Vue lost track of it for the UI!
  console.log('Replaced object. UI will NOT update.', replaceableState)
}

const refState = ref({ value: 'Initial Value' })
const replaceWithRef = () => {
  // Replacing a ref's value works perfectly!
  refState.value = { value: 'Replaced Object via Ref' }
}
</script>

<template>
  <div class="lesson-container">
    <header class="lesson-header">
      <span class="badge">Lesson 05</span>
      <h1>reactive() vs ref()</h1>
      <p class="subtitle">
        Learn how to use reactive() for objects and understand its key caveats.
      </p>
    </header>

    <main class="lesson-content">
      <!-- Card 1: Basic reactive() -->
      <section class="card">
        <h2>1. Using reactive()</h2>
        <p class="description">
          Unlike <code>ref()</code>, <code>reactive()</code> makes the object itself reactive. You
          access and mutate its properties directly without writing <code>.value</code>.
        </p>

        <div class="demo-box">
          <div class="profile-card">
            <h3>Player Profile</h3>
            <p><strong>Username:</strong> {{ formState.username }}</p>
            <p><strong>Level:</strong> {{ formState.level }}</p>
            <p><strong>Strength:</strong> {{ formState.stats.strength }}</p>
            <p><strong>Agility:</strong> {{ formState.stats.agility }}</p>
          </div>
          <button @click="levelUp" class="btn btn-primary">Level Up + Boost Stats</button>
        </div>
      </section>

      <!-- Card 2: Destructuring Caveat -->
      <section class="card">
        <h2>2. Caveat: Destructuring Breaks Reactivity</h2>
        <p class="description">
          If you destructure a property from a <code>reactive()</code> object, it becomes a plain
          primitive, losing reactivity. Use <code>toRefs()</code> to keep it connected.
        </p>

        <div class="demo-box">
          <div class="comparison-grid">
            <div class="comp-box">
              <h4>Destructured directly</h4>
              <p>
                State in UI: <span class="highlight-red">{{ count }}</span>
              </p>
              <p>Object state: {{ brokenState.count }}</p>
              <button @click="incrementBroken" class="btn btn-danger">Increment brokenState</button>
              <p class="hint">
                UI does not update because the destructured variable is a plain number.
              </p>
            </div>

            <div class="comp-box">
              <h4>Destructured using toRefs()</h4>
              <p>
                State in UI: <span class="highlight-green">{{ fixedCount }}</span>
              </p>
              <p>Object state: {{ fixedState.count }}</p>
              <button @click="incrementFixed" class="btn btn-success">Increment fixedState</button>
              <p class="hint">
                UI updates properly because toRefs() converted the property to a reactive ref.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Card 3: Replacing object caveat -->
      <section class="card">
        <h2>3. Caveat: Replacing the entire object</h2>
        <p class="description">
          You cannot replace a <code>reactive()</code> object wholesale, as Vue's reactivity tracker
          is tied to the original reference. With <code>ref()</code>, you can safely replace the
          value.
        </p>

        <div class="demo-box">
          <div class="comparison-grid">
            <div class="comp-box">
              <h4>reactive() Replacement</h4>
              <p>
                State in UI: <span class="highlight-red">{{ replaceableState.value }}</span>
              </p>
              <button @click="tryReplaceBroken" class="btn btn-danger">
                Try replacing reactive object
              </button>
              <p class="hint">Clicking this breaks UI updates (check browser console).</p>
            </div>

            <div class="comp-box">
              <h4>ref() Replacement</h4>
              <p>
                State in UI: <span class="highlight-green">{{ refState.value }}</span>
              </p>
              <button @click="replaceWithRef" class="btn btn-success">Replace ref value</button>
              <p class="hint">Updating <code>refState.value = ...</code> works perfectly.</p>
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
  background: linear-gradient(135deg, #f59e0b, #647eff);
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
  background: linear-gradient(to right, #f59e0b, #647eff);
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
  border-color: rgba(245, 158, 11, 0.4);
}

.card h2 {
  font-size: 1.25rem;
  color: #f59e0b;
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
  color: #fde047;
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

.profile-card {
  text-align: left;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem 1.5rem;
  width: 100%;
  max-width: 320px;
}

.profile-card h3 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  color: #e2e8f0;
  font-size: 1.1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 0.4rem;
}

.profile-card p {
  margin: 0.4rem 0;
  font-size: 0.9rem;
  color: #94a3b8;
}

.profile-card strong {
  color: #e2e8f0;
}

.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  width: 100%;
}

.comp-box {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  padding: 1.25rem;
  text-align: left;
}

.comp-box h4 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  color: #f8fafc;
  font-size: 0.95rem;
}

.comp-box p {
  font-size: 0.9rem;
  margin: 0.5rem 0;
  color: #94a3b8;
}

.highlight-red {
  color: #ef4444;
  font-weight: 700;
  font-size: 1.1rem;
}

.highlight-green {
  color: #22c55e;
  font-weight: 700;
  font-size: 1.1rem;
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
  background: #f59e0b;
  color: #0f172a;
}

.btn-primary:hover {
  background: #d97706;
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

.hint {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 0.75rem;
  margin-bottom: 0;
  line-height: 1.4;
}

@media (max-width: 640px) {
  .comparison-grid {
    grid-template-columns: 1fr;
  }
}
</style>
