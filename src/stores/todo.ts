import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface TodoItem {
  id: number
  text: string
  completed: boolean
}

// 1. Defining a Setup Store using defineStore('id', () => { ... })
export const useTodoStore = defineStore('todo', () => {
  // State: ref() properties
  const todos = ref<TodoItem[]>([
    { id: 1, text: 'Learn Vue 3 Basics', completed: true },
    { id: 2, text: 'Build a Setup Store in Pinia', completed: false },
    { id: 3, text: 'Understand storeToRefs() reactivity', completed: false },
  ])
  const currentFilter = ref<'all' | 'active' | 'completed'>('all')
  const nextId = ref(4)

  // Getters: computed() properties
  const filteredTodos = computed(() => {
    if (currentFilter.value === 'active') {
      return todos.value.filter((t) => !t.completed)
    }
    if (currentFilter.value === 'completed') {
      return todos.value.filter((t) => t.completed)
    }
    return todos.value
  })

  const activeCount = computed(() => {
    return todos.value.filter((t) => !t.completed).length
  })

  const completedCount = computed(() => {
    return todos.value.filter((t) => t.completed).length
  })

  // Actions: standard functions
  const addTodo = (text: string) => {
    const trimmed = text.trim()
    if (trimmed) {
      todos.value.push({
        id: nextId.value++,
        text: trimmed,
        completed: false,
      })
    }
  }

  const toggleTodo = (id: number) => {
    const todo = todos.value.find((t) => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  const deleteTodo = (id: number) => {
    todos.value = todos.value.filter((t) => t.id !== id)
  }

  const clearCompleted = () => {
    todos.value = todos.value.filter((t) => !t.completed)
  }

  // Remember to return state, getters, and actions!
  return {
    todos,
    currentFilter,
    filteredTodos,
    activeCount,
    completedCount,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
  }
})
