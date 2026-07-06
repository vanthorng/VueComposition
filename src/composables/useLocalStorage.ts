import { ref, watch, onMounted, onUnmounted, type Ref } from 'vue'

// useLocalStorage keeps a reactive Vue Ref fully synchronized with browser localStorage.
// It also listens to the window 'storage' event to keep state in sync across multiple browser tabs!
export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  // Helper to read and parse from localStorage
  const readValue = (): T => {
    try {
      const item = localStorage.getItem(key)
      if (item === null) return defaultValue
      return JSON.parse(item) as T
    } catch {
      // Fallback if parsing fails (e.g., storing a plain unstringified string)
      return (localStorage.getItem(key) as unknown as T) || defaultValue
    }
  }

  // 1. Initialize reactive ref with loaded value
  const state = ref<T>(readValue()) as Ref<T>

  // 2. Watch state and write to localStorage on change
  watch(
    state,
    (newValue) => {
      try {
        if (newValue === null || newValue === undefined) {
          localStorage.removeItem(key)
        } else {
          localStorage.setItem(key, JSON.stringify(newValue))
        }
      } catch (err) {
        console.error(`Failed to write key "${key}" to localStorage:`, err)
      }
    },
    { deep: true },
  )

  // 3. Sync changes across tabs using storage listener
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === key) {
      if (event.newValue === null) {
        state.value = defaultValue
      } else {
        try {
          state.value = JSON.parse(event.newValue) as T
        } catch {
          state.value = event.newValue as unknown as T
        }
      }
    }
  }

  onMounted(() => {
    window.addEventListener('storage', handleStorageChange)
  })

  onUnmounted(() => {
    window.removeEventListener('storage', handleStorageChange)
  })

  return state
}
