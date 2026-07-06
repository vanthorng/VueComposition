<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

// 1. Decoupled Route Params as Props
// Because of 'props: true' in the router configuration,
// :userId from /lesson/10/profile/:userId is passed directly as a prop!
const props = defineProps<{
  userId?: string
}>()

const router = useRouter()

// Mock user database
interface UserProfile {
  name: string
  role: string
  bio: string
  avatar: string
}

const mockUsers: Record<string, UserProfile> = {
  'user-1': {
    name: 'Thai Vanthorng',
    role: 'Frontend Architect',
    bio: 'Loves Vue, TypeScript, and crafting premium, sleek user experiences.',
    avatar: '💻',
  },
  'user-2': {
    name: 'Sophia Loren',
    role: 'UX Designer',
    bio: 'Focuses on micro-interactions, aesthetic dark mode themes, and design tokens.',
    avatar: '✨',
  },
  'user-3': {
    name: 'Alex Rivera',
    role: 'Backend Engineer',
    bio: 'Passionate about databases, APIs, and building server structures.',
    avatar: '🛡️',
  },
}

// Stateful counters to demonstrate the component reuse trap
const mountedCount = ref(0)
const watchCount = ref(0)
const currentUser = ref<UserProfile | null>(null)

// Function to simulate loading user data
const loadUserData = () => {
  const user = props.userId ? mockUsers[props.userId] : undefined
  if (user) {
    currentUser.value = user
  } else {
    currentUser.value = null
  }
}

// Trap: onMounted only fires when the component is created
onMounted(() => {
  mountedCount.value++
  loadUserData()
})

// Fix: Watch the prop (or route param) to detect changes during reuse
watch(
  () => props.userId,
  (newId) => {
    watchCount.value++
    loadUserData()
  },
)

const selectUser = (id: string) => {
  router.push(`/lesson/10/profile/${id}`)
}
</script>

<template>
  <div class="lesson-container">
    <header class="lesson-header">
      <span class="badge">Lesson 10</span>
      <h1>Advanced Router Params</h1>
      <p class="subtitle">Decouple route params using props, and master component reuse traps.</p>
    </header>

    <main class="lesson-content">
      <!-- Card 1: Props Toggling -->
      <section class="card">
        <h2>1. Decoupling Params (props: true)</h2>
        <p class="description">
          Instead of using <code>useRoute().params</code> which couples the component tightly to the
          router, setting <code>props: true</code> in the routing configuration automatically passes
          parameters down as standard Vue props.
        </p>

        <div class="demo-box">
          <div class="user-selectors">
            <button
              v-for="id in ['user-1', 'user-2', 'user-3']"
              :key="id"
              @click="selectUser(id)"
              :class="['btn', 'btn-user', { active: userId === id }]"
            >
              {{ id === 'user-1' ? '👤 Thai' : id === 'user-2' ? '👤 Sophia' : '👤 Alex' }}
            </button>
          </div>

          <div class="divider"></div>

          <!-- Profile display -->
          <div v-if="currentUser" class="profile-card">
            <div class="avatar">{{ currentUser.avatar }}</div>
            <div class="info">
              <h3>{{ currentUser.name }}</h3>
              <span class="role">{{ currentUser.role }}</span>
              <p class="bio">{{ currentUser.bio }}</p>
            </div>
          </div>
          <div v-else class="empty-profile">
            No profile loaded. Select a user above to change the URL parameter.
          </div>
        </div>
      </section>

      <!-- Card 2: Component Reuse Trap -->
      <section class="card">
        <h2>2. The Component Reuse Trap</h2>
        <p class="description">
          When navigating between two routes that use the **same component** (e.g. from
          <code>/user-1</code> to <code>/user-2</code>), Vue reuses the active component instance
          for performance. **The component is not re-mounted, so <code>onMounted</code> does not run
          again!**
        </p>

        <div class="demo-box statistics-box">
          <div class="stat-row">
            <span class="stat-label">Times <code>onMounted()</code> executed:</span>
            <span :class="['stat-val', { highlight: mountedCount === 1 }]">{{ mountedCount }}</span>
          </div>

          <div class="stat-row">
            <span class="stat-label">Times <code>watch()</code> executed:</span>
            <span class="stat-val highlight-green">{{ watchCount }}</span>
          </div>

          <p class="hint">
            <strong>Observe:</strong> As you switch between users, <code>onMounted</code> stays at
            <code>1</code>. If we did not use <code>watch()</code> to update the profile, the view
            would remain stuck on the first user clicked!
          </p>
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
  background: linear-gradient(135deg, #14b8a6, #647eff);
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
  background: linear-gradient(to right, #14b8a6, #647eff);
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
  border-color: rgba(20, 184, 166, 0.4);
}

.card h2 {
  font-size: 1.25rem;
  color: #14b8a6;
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
  color: #2dd4bf;
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

.user-selectors {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
}

.divider {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
}

.profile-card {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  text-align: left;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1.25rem 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
}

.avatar {
  font-size: 3rem;
  background: rgba(255, 255, 255, 0.04);
  width: 70px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.info {
  flex-grow: 1;
}

.info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.2rem;
  color: #f8fafc;
}

.role {
  font-size: 0.85rem;
  font-weight: 600;
  color: #14b8a6;
  background: rgba(20, 184, 166, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  display: inline-block;
  margin-bottom: 0.5rem;
}

.bio {
  margin: 0;
  font-size: 0.9rem;
  color: #94a3b8;
  line-height: 1.4;
}

.empty-profile {
  color: #475569;
  font-style: italic;
  padding: 1.5rem 0;
}

.statistics-box {
  align-items: stretch;
  text-align: left;
  gap: 1rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.stat-label {
  font-weight: 500;
  color: #cbd5e1;
}

.stat-val {
  font-family: 'Fira Code', monospace;
  font-weight: 700;
  font-size: 1.15rem;
}

.highlight {
  color: #14b8a6;
}

.highlight-green {
  color: #10b981;
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

.btn-user {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #94a3b8;
}

.btn-user:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.btn-user.active {
  background: rgba(20, 184, 166, 0.15);
  border-color: rgba(20, 184, 166, 0.3);
  color: #14b8a6;
}

.hint {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 0.5rem;
  margin-bottom: 0;
  line-height: 1.45;
}

.hint strong {
  color: #94a3b8;
}
</style>
