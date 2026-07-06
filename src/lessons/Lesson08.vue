<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTodoStore } from '../stores/todo'

// 1. Instantiate the store
const todoStore = useTodoStore()

// 2. Destructuring reactive state and getters using storeToRefs()
// This ensures they remain reactive refs in our template.
const { filteredTodos, activeCount, completedCount, currentFilter } = storeToRefs(todoStore)

// 3. Actions can be destructured directly since they are plain functions (no reactivity to lose)
const { addTodo, toggleTodo, deleteTodo, clearCompleted } = todoStore

const newTodoText = ref('')

const handleAddTodo = () => {
  if (newTodoText.value.trim()) {
    addTodo(newTodoText.value)
    newTodoText.value = ''
  }
}

// --- Destructuring without storeToRefs Demonstration ---
// We destructure here directly to show the user that changes in the store will NOT reflect in these destructured variables!
const { currentFilter: brokenFilter } = todoStore
</script>

<template>
  <div class="lesson-container">
    <header class="lesson-header">
      <span class="badge">Lesson 08</span>
      <h1>Pinia Setup Store</h1>
      <p class="subtitle">Manage global state with Setup stores and learn about storeToRefs().</p>
    </header>

    <main class="lesson-content">
      <!-- Card 1: Pinia Todo App -->
      <section class="card">
        <h2>1. Global Todo Store Demo</h2>
        <p class="description">
          This todo list uses a global store. Any component in the app could import
          <code>useTodoStore</code> and access/modify the same list of todos.
        </p>

        <div class="demo-box todo-app-box">
          <!-- Add input -->
          <form @submit.prevent="handleAddTodo" class="todo-form">
            <input
              type="text"
              v-model="newTodoText"
              placeholder="What needs to be done?"
              class="text-input"
            />
            <button type="submit" class="btn btn-primary">Add Task</button>
          </form>

          <!-- Filter switcher & Stats -->
          <div class="todo-controls">
            <div class="filter-tabs">
              <button
                v-for="f in ['all', 'active', 'completed'] as const"
                :key="f"
                @click="currentFilter = f"
                :class="['filter-btn', { active: currentFilter === f }]"
              >
                {{ f }}
              </button>
            </div>

            <span class="items-left"> {{ activeCount }} items left </span>
          </div>

          <div class="divider"></div>

          <!-- Todo List -->
          <div class="todo-list" v-if="filteredTodos.length > 0">
            <div
              v-for="todo in filteredTodos"
              :key="todo.id"
              class="todo-item"
              :class="{ completed: todo.completed }"
            >
              <label class="todo-label">
                <input
                  type="checkbox"
                  :checked="todo.completed"
                  @change="toggleTodo(todo.id)"
                  class="todo-checkbox"
                />
                <span class="todo-text">{{ todo.text }}</span>
              </label>
              <button @click="deleteTodo(todo.id)" class="btn-delete">×</button>
            </div>
          </div>
          <div v-else class="empty-list">No items in this category!</div>

          <div class="divider" v-if="completedCount > 0"></div>

          <!-- Clear completed -->
          <button
            v-if="completedCount > 0"
            @click="clearCompleted"
            class="btn btn-danger clear-btn"
          >
            Clear Completed ({{ completedCount }})
          </button>
        </div>
      </section>

      <!-- Card 2: storeToRefs Explanation -->
      <section class="card">
        <h2>2. Reactivity Caveat: Destructuring</h2>
        <p class="description">
          Just like reactive objects, destructuring a Pinia store directly breaks reactivity. You
          must wrap the store in <code>storeToRefs()</code> when destructuring state or getters.
        </p>

        <div class="demo-box">
          <div class="comparison-grid">
            <div class="comp-box">
              <h4>Direct Destructure (Broken)</h4>
              <p><code>const { currentFilter } = todoStore</code></p>
              <p class="preview-text">
                Value: <span class="highlight-red">"{{ brokenFilter }}"</span>
              </p>
              <p class="hint">
                This value stays frozen as whatever it was on creation. Click the filter tabs above;
                this will not change!
              </p>
            </div>

            <div class="comp-box">
              <h4>storeToRefs() (Correct)</h4>
              <p><code>const { currentFilter } = storeToRefs(todoStore)</code></p>
              <p class="preview-text">
                Value: <span class="highlight-green">"{{ currentFilter }}"</span>
              </p>
              <p class="hint">
                This value updates instantly whenever the store filter state changes.
              </p>
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
  background: linear-gradient(135deg, #ec4899, #647eff);
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
  background: linear-gradient(to right, #ec4899, #647eff);
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
  border-color: rgba(236, 72, 153, 0.4);
}

.card h2 {
  font-size: 1.25rem;
  color: #ec4899;
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
  color: #f472b6;
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

.todo-app-box {
  align-items: stretch;
}

.todo-form {
  display: flex;
  gap: 0.5rem;
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
  border-color: #ec4899;
}

.todo-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.filter-tabs {
  display: flex;
  gap: 0.4rem;
}

.filter-btn {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #94a3b8;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.filter-btn.active {
  background: rgba(236, 72, 153, 0.15);
  border-color: rgba(236, 72, 153, 0.3);
  color: #ec4899;
}

.items-left {
  font-size: 0.85rem;
  color: #94a3b8;
}

.divider {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: 0.6rem 1rem;
  border-radius: 8px;
  transition:
    opacity 0.25s,
    transform 0.25s;
}

.todo-item.completed {
  opacity: 0.55;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: #64748b;
}

.todo-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  flex-grow: 1;
}

.todo-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #ec4899;
}

.todo-text {
  font-size: 0.95rem;
  color: #e2e8f0;
}

.btn-delete {
  background: transparent;
  border: none;
  color: #ef4444;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 0.25rem;
  transition: transform 0.2s;
}

.btn-delete:hover {
  transform: scale(1.2);
}

.empty-list {
  text-align: center;
  color: #475569;
  font-style: italic;
  padding: 1.5rem 0;
}

.clear-btn {
  align-self: flex-end;
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

.preview-text {
  font-size: 1.05rem;
  font-weight: 700;
}

.highlight-red {
  color: #ef4444;
}

.highlight-green {
  color: #22c55e;
}

.hint {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 0.75rem;
  margin-bottom: 0;
  line-height: 1.4;
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
  background: #ec4899;
  color: #fff;
}

.btn-primary:hover {
  background: #db2777;
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
  .comparison-grid {
    grid-template-columns: 1fr;
  }
}
</style>
