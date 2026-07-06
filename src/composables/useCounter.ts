import { ref } from 'vue'

interface CounterOptions {
  min?: number
  max?: number
}

// useCounter encapsulates counter logic with optional boundaries (min/max).
export function useCounter(initialValue = 0, options: CounterOptions = {}) {
  const count = ref(initialValue)

  const increment = (step = 1) => {
    if (options.max !== undefined && count.value + step > options.max) {
      count.value = options.max
    } else {
      count.value += step
    }
  }

  const decrement = (step = 1) => {
    if (options.min !== undefined && count.value - step < options.min) {
      count.value = options.min
    } else {
      count.value -= step
    }
  }

  const reset = () => {
    count.value = initialValue
  }

  return {
    count,
    increment,
    decrement,
    reset,
  }
}
