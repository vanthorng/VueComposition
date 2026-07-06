import { ref, watch, type Ref } from 'vue'

interface FetchResult<T> {
  data: Ref<T | null>
  error: Ref<string | null>
  isLoading: Ref<boolean>
  refetch: () => Promise<void>
}

// useFetch is a reusable composable that encapsulates loading, error, and data states for async requests.
// It can accept a static URL string or a reactive Ref/getter representing a URL that might change.
export function useFetch<T>(url: string | Ref<string> | (() => string)): FetchResult<T> {
  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<string | null>(null)
  const isLoading = ref(false)

  const fetchData = async () => {
    // Resolve URL value (handles static string, Ref, or getter function)
    const resolvedUrl = typeof url === 'function' ? url() : ref(url).value

    isLoading.value = true
    error.value = null
    data.value = null

    try {
      const response = await fetch(resolvedUrl)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const json = await response.json()
      data.value = json
    } catch (err: any) {
      error.value = err.message || 'An unexpected error occurred'
    } finally {
      isLoading.value = false
    }
  }

  // If URL is reactive (a Ref or getter), re-fetch when it changes
  if (typeof url === 'function' || typeof url === 'object') {
    watch(url, () => {
      fetchData()
    })
  }

  // Fetch immediately on instantiation
  fetchData()

  return {
    data,
    error,
    isLoading,
    refetch: fetchData,
  }
}
