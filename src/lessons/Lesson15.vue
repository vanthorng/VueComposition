<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUsersApi } from '../composables/useUsersApi'

// 1. Consume the specialized API Composable
// The component is completely decoupled from URLs, headers, and API methods.
const { users, currentUser, isLoading, error, fetchUsers, fetchUserById, createUser, deleteUser } =
  useUsersApi()

const newName = ref('')
const newEmail = ref('')

onMounted(() => {
  fetchUsers()
})

const handleCreateUser = async () => {
  const name = newName.value.trim()
  const email = newEmail.value.trim()
  if (name && email) {
    await createUser({ name, email })
    newName.value = ''
    newEmail.value = ''
  }
}
</script>

<template>
  <div class="lesson-container">
    <header class="lesson-header">
      <span class="badge">Lesson 15</span>
      <h1>API Service Composables</h1>
      <p class="subtitle">
        Decouple components from endpoints by encapsulating server requests into specialized API
        service hooks.
      </p>
    </header>

    <main class="lesson-content">
      <!-- Card 1: Add new user -->
      <section class="card">
        <h2>1. Entity Service Actions</h2>
        <p class="description">
          Components only call high-level service functions (like <code>createUser()</code>) and let
          the composable manage state updates and request methods.
        </p>

        <div class="demo-box form-box">
          <form @submit.prevent="handleCreateUser" class="user-form">
            <input
              type="text"
              v-model="newName"
              placeholder="Enter name..."
              required
              class="text-input"
            />
            <input
              type="email"
              v-model="newEmail"
              placeholder="Enter email..."
              required
              class="text-input"
            />
            <button type="submit" :disabled="isLoading" class="btn btn-primary">
              ＋ Add User Account
            </button>
          </form>
        </div>
      </section>

      <!-- Grid area: list + details -->
      <div class="dashboard-grid">
        <!-- List card -->
        <section class="card list-section">
          <h2>2. Users Database</h2>

          <div v-if="isLoading && users.length === 0" class="status-message">
            ⏳ Loading database records...
          </div>

          <div v-if="error" class="status-message error">🛑 Database Error: {{ error }}</div>

          <div v-if="users.length > 0" class="users-list-wrapper">
            <div
              v-for="user in users"
              :key="user.id"
              class="user-row"
              :class="{ selected: currentUser?.id === user.id }"
            >
              <div class="user-meta" @click="fetchUserById(user.id)">
                <span class="avatar-sm">👤</span>
                <div class="info-inline">
                  <div class="name">{{ user.name }}</div>
                  <div class="email">{{ user.email }}</div>
                </div>
              </div>
              <button @click="deleteUser(user.id)" class="btn-delete" title="Delete User">×</button>
            </div>
          </div>
        </section>

        <!-- Details Card -->
        <section class="card details-section">
          <h2>3. Account Details</h2>
          <p class="description">
            Loaded dynamically on demand using <code>fetchUserById()</code>.
          </p>

          <div v-if="isLoading && !currentUser" class="details-loading">⏳ Syncing profile...</div>

          <div v-else-if="currentUser" class="profile-card">
            <span class="avatar-lg">👤</span>
            <h3>{{ currentUser.name }}</h3>
            <span class="id-tag">ID: {{ currentUser.id }}</span>

            <div class="profile-details">
              <div class="detail-row">
                <span class="d-label">Email:</span>
                <span class="d-val">{{ currentUser.email }}</span>
              </div>
              <div class="detail-row" v-if="currentUser.phone">
                <span class="d-label">Phone:</span>
                <span class="d-val">{{ currentUser.phone }}</span>
              </div>
              <div class="detail-row" v-if="currentUser.website">
                <span class="d-label">Website:</span>
                <a :href="'https://' + currentUser.website" target="_blank" class="d-val link">{{
                  currentUser.website
                }}</a>
              </div>
              <div class="detail-row" v-if="currentUser.company">
                <span class="d-label">Company:</span>
                <span class="d-val">{{ currentUser.company.name }}</span>
              </div>
            </div>
          </div>

          <div v-else class="empty-details">
            Click on any user in the database list to inspect full details.
          </div>
        </section>
      </div>
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
  background: linear-gradient(135deg, #a855f7, #6366f1);
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
  background: linear-gradient(to right, #a855f7, #6366f1);
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
  border-color: rgba(168, 85, 247, 0.4);
}

.card h2 {
  font-size: 1.25rem;
  color: #a855f7;
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.description {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.demo-box {
  background: rgba(15, 23, 42, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.form-box {
  align-items: stretch;
}

.user-form {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  gap: 0.75rem;
}

.text-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.text-input:focus {
  border-color: #a855f7;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 1.5rem;
}

.status-message {
  padding: 1rem;
  color: #94a3b8;
  font-style: italic;
  font-size: 0.9rem;
}

.status-message.error {
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
}

.users-list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 380px;
  overflow-y: auto;
}

.user-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.user-row:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(168, 85, 247, 0.2);
}

.user-row.selected {
  background: rgba(168, 85, 247, 0.1);
  border-color: rgba(168, 85, 247, 0.3);
}

.user-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-grow: 1;
  cursor: pointer;
}

.avatar-sm {
  font-size: 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

.info-inline {
  text-align: left;
}

.name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #e2e8f0;
}

.email {
  font-size: 0.75rem;
  color: #94a3b8;
  font-family: 'Fira Code', monospace;
}

.btn-delete {
  background: transparent;
  border: none;
  color: #ef4444;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 0.5rem;
  transition: transform 0.2s;
}

.btn-delete:hover {
  transform: scale(1.2);
}

.details-loading,
.empty-details {
  padding: 3rem 0;
  color: #64748b;
  font-style: italic;
  font-size: 0.9rem;
  text-align: center;
}

.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 12px;
}

.avatar-lg {
  font-size: 2.5rem;
  background: rgba(168, 85, 247, 0.1);
  width: 64px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin-bottom: 0.75rem;
  border: 1px solid rgba(168, 85, 247, 0.2);
}

.profile-card h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.15rem;
  color: #f8fafc;
}

.id-tag {
  font-size: 0.75rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.05);
  color: #94a3b8;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  margin-bottom: 1.25rem;
  font-family: 'Fira Code', monospace;
}

.profile-details {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  text-align: left;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 1rem;
}

.detail-row {
  display: flex;
  font-size: 0.85rem;
}

.d-label {
  color: #64748b;
  font-weight: 600;
  min-width: 75px;
}

.d-val {
  color: #cbd5e1;
  word-break: break-all;
}

.d-val.link {
  color: #a855f7;
  text-decoration: none;
}

.d-val.link:hover {
  text-decoration: underline;
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
  background: #a855f7;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #9333ea;
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  .user-form {
    grid-template-columns: 1fr;
  }
}
</style>
