import { ref, onMounted, onUnmounted } from 'vue'

// useMouse is a standard composable that tracks the user's cursor position.
// It sets up event listeners on mount and cleans them up on unmount.
export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  const update = (event: MouseEvent) => {
    x.value = event.clientX
    y.value = event.clientY
  }

  // Hook into component lifecycles to bind events
  onMounted(() => {
    window.addEventListener('mousemove', update)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', update)
  })

  // Return reactive properties to be consumed by components
  return { x, y }
}
