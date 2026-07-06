<script setup lang="ts">
import { ref } from 'vue'

// 1. Creating reactive state with ref()
// ref() takes an initial value and returns a reactive, mutable object.
// In <script setup>, we access/modify its value using the '.value' property.
const counter = ref(0)
const textInput = ref('Hello Vue!')
const isAwesome = ref(true)

// Helper functions to modify state
const increment = () => {
  counter.value++
}

const decrement = () => {
  counter.value--
}

const toggleAwesome = () => {
  isAwesome.value = !isAwesome.value
}

const handleInput = (event: Event) => {
  // Accessing the input value from the DOM event and updating our ref
  const target = event.target as HTMLInputElement
  textInput.value = target.value
}
</script>

<template>
  <div class="lesson-container">
    <header class="lesson-header">
      <span class="badge">Lesson 01</span>
      <h1>ref() & Template Binding</h1>
      <p class="subtitle">Learn how to declare reactive state and bind it to the template.</p>
    </header>

    <main class="lesson-content">
      <!-- Card 1: The Counter (Basic ref & Click Events) -->
      <section class="card">
        <h2>1. Basic Reactive State</h2>
        <p class="description">
          Using <code>ref()</code> creates a reactive reference. In templates, Vue automatically
          unwraps the ref, so you don't need to write <code>.value</code>.
        </p>
        <div class="demo-box">
          <div class="counter-display">
            Counter Value: <span class="highlight">{{ counter }}</span>
          </div>
          <div class="button-group">
            <button @click="decrement" class="btn btn-secondary">- Decrement</button>
            <button @click="increment" class="btn btn-primary">+ Increment</button>
          </div>
        </div>
      </section>

      <!-- Card 2: Two-way Data Binding (Attribute and Event binding) -->
      <section class="card">
        <h2>2. Dynamic Attribute & Event Binding</h2>
        <p class="description">
          We use <code>:value</code> (shortcut for <code>v-bind:value</code>) to bind the ref value
          to the input, and <code>@input</code> (shortcut for <code>v-on:input</code>) to handle
          changes.
        </p>
        <div class="demo-box">
          <div class="input-display">
            Current Input: <span class="highlight">{{ textInput || '(empty)' }}</span>
          </div>
          <div class="input-container">
            <input
              type="text"
              :value="textInput"
              @input="handleInput"
              placeholder="Type something..."
              class="text-input"
            />
          </div>
        </div>
      </section>

      <!-- Card 3: Class & Conditional Binding -->
      <section class="card">
        <h2>3. Attribute Binding (v-bind)</h2>
        <p class="description">
          Toggle dynamic CSS classes or styles by binding a boolean ref to attributes.
        </p>
        <div class="demo-box">
          <div
            class="toggle-box"
            :class="{ 'status-active': isAwesome, 'status-inactive': !isAwesome }"
          >
            {{
              isAwesome ? '✨ State is Active & Awesome! ✨' : '💤 State is Inactive & Chilling 💤'
            }}
          </div>
          <button @click="toggleAwesome" class="btn btn-toggle">Toggle Status</button>
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
  background: linear-gradient(135deg, #42d392, #647eff);
  color: #0f172a;
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
  background: linear-gradient(to right, #42d392, #647eff);
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
  border-color: rgba(66, 211, 146, 0.4);
}

.card h2 {
  font-size: 1.25rem;
  color: #42d392;
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
  color: #38bdf8;
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

.counter-display,
.input-display {
  font-size: 1.1rem;
  font-weight: 500;
}

.highlight {
  color: #647eff;
  font-weight: 700;
  font-size: 1.2rem;
}

.button-group {
  display: flex;
  gap: 1rem;
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
  background: #42d392;
  color: #0f172a;
}

.btn-primary:hover {
  background: #33a06f;
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

.btn-toggle {
  background: linear-gradient(135deg, #647eff, #42d392);
  color: #0f172a;
}

.btn-toggle:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.input-container {
  width: 100%;
  max-width: 320px;
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
  border-color: #42d392;
}

.toggle-box {
  width: 100%;
  padding: 1.25rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  transition: all 0.3s ease;
}

.status-active {
  background: rgba(66, 211, 146, 0.15);
  border: 1px solid rgba(66, 211, 146, 0.3);
  color: #42d392;
  box-shadow: 0 0 15px rgba(66, 211, 146, 0.1);
}

.status-inactive {
  background: rgba(148, 163, 184, 0.1);
  border: 1px solid rgba(148, 163, 184, 0.2);
  color: #94a3b8;
}
</style>
