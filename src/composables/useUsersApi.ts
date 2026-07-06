import { ref } from 'vue'

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  website?: string
  company?: { name: string }
}

const BASE_URL = 'https://jsonplaceholder.typicode.com/users'

// useUsersApi encapsulates all API interactions related to Users.
// It exposes read-only reactive states and action functions to mutate or query them.
export function useUsersApi() {
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 1. Action: Get all users
  const fetchUsers = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(BASE_URL)
      if (!response.ok) throw new Error('Failed to fetch users list')
      users.value = await response.json()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch users'
    } finally {
      isLoading.value = false
    }
  }

  // 2. Action: Get user by ID
  const fetchUserById = async (id: number) => {
    isLoading.value = true
    error.value = null
    currentUser.value = null
    try {
      const response = await fetch(`${BASE_URL}/${id}`)
      if (!response.ok) throw new Error(`Failed to fetch user #${id}`)
      currentUser.value = await response.json()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch user details'
    } finally {
      isLoading.value = false
    }
  }

  // 3. Action: Create user (Simulated POST request)
  const createUser = async (newUserData: Omit<User, 'id'>) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserData),
      })
      if (!response.ok) throw new Error('Failed to create user')
      const createdUser = (await response.json()) as User

      // Update local state to reflect creation immediately in UI
      users.value.unshift({
        ...createdUser,
        id: users.value.length + 1, // Simulated new ID
      })
    } catch (err: any) {
      error.value = err.message || 'Failed to create user'
    } finally {
      isLoading.value = false
    }
  }

  // 4. Action: Delete user (Simulated DELETE request)
  const deleteUser = async (id: number) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete user')

      // Remove from local state
      users.value = users.value.filter((u) => u.id !== id)
      if (currentUser.value?.id === id) {
        currentUser.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete user'
    } finally {
      isLoading.value = false
    }
  }

  return {
    // Expose read-only state refs
    users,
    currentUser,
    isLoading,
    error,
    // Expose actions
    fetchUsers,
    fetchUserById,
    createUser,
    deleteUser,
  }
}
