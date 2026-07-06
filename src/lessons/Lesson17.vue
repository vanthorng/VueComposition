<script setup lang="ts">
import { useLocalStorage } from '../composables/useLocalStorage'

// 1. Persist a simple string (text area)
const noteDraft = useLocalStorage('lesson17_note_draft', 'Hello LocalStorage!')

// 2. Persist a complex nested object (deep watch demo)
interface ThemeConfig {
  theme: 'dark' | 'light'
  fontSize: 'small' | 'medium' | 'large'
  notifications: boolean
}

const settings = useLocalStorage<ThemeConfig>('lesson17_user_settings', {
  theme: 'dark',
  fontSize: 'medium',
  notifications: true,
})

const resetSettings = () => {
  settings.value = {
    theme: 'dark',
    fontSize: 'medium',
    notifications: true,
  }
}
</script>

<template>
  <div class="lesson-container">
    <header class="lesson-header">
      <span class="badge">Lesson 17</span>
      <h1>Local Storage Composable</h1>
      <p class="subtitle">
        Persist reactive state to localStorage automatically, complete with cross-tab syncing.
      </p>
    </header>

    <main class="lesson-content">
      <!-- Card 1: Text Note Draft -->
      <section class="card">
        <h2>1. Simple String Persistence</h2>
        <p class="description">
          Changes made in the editor below are instantly stringified and saved to browser storage.
          Reload the page to test!
        </p>

        <div class="demo-box">
          <textarea
            v-model="noteDraft"
            placeholder="Type notes here to save..."
            class="note-textarea"
          ></textarea>
          <div class="status-indicator">
            💾 Storage Key: <code class="key-tag">lesson17_note_draft</code>
          </div>
        </div>
      </section>

      <!-- Card 2: Nested settings object -->
      <section class="card">
        <h2>2. Complex Object Persistence</h2>
        <p class="description">
          The composable uses a <code>deep: true</code> watcher internally, allowing it to detect
          and persist modifications inside nested object keys.
        </p>

        <div class="demo-box settings-box">
          <div class="settings-form">
            <!-- Theme selection -->
            <div class="setting-item">
              <span class="label">Color Scheme:</span>
              <div class="toggle-group">
                <button
                  @click="settings.theme = 'dark'"
                  :class="['btn-toggle', { active: settings.theme === 'dark' }]"
                >
                  🌙 Dark
                </button>
                <button
                  @click="settings.theme = 'light'"
                  :class="['btn-toggle', { active: settings.theme === 'light' }]"
                >
                  ☀️ Light
                </button>
              </div>
            </div>

            <!-- Font size -->
            <div class="setting-item">
              <span class="label">Font Display:</span>
              <select v-model="settings.fontSize" class="select-input">
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            <!-- Notifications -->
            <div class="setting-item">
              <span class="label">Sound Notifications:</span>
              <button
                @click="settings.notifications = !settings.notifications"
                :class="['btn-check', { enabled: settings.notifications }]"
              >
                {{ settings.notifications ? '🔔 Enabled' : '🔕 Disabled' }}
              </button>
            </div>
          </div>

          <div class="divider"></div>

          <div class="actions-row">
            <button @click="resetSettings" class="btn btn-secondary">Reset Config</button>
          </div>
        </div>
      </section>

      <!-- Card 3: Cross-tab sync explanation -->
      <section class="card sync-card">
        <h2>3. Cross-Tab Synchronization</h2>
        <p class="description">
          <strong>Wow Factor:</strong> Open this application in two separate browser windows (or
          side-by-side tabs). Try typing in the note editor or toggling settings in Tab A. You will
          see Tab B update **instantly** without a page refresh!
        </p>
        <div class="demo-box monitor-box">
          <div class="monitor-row">
            <span class="label">Raw settings value in Storage:</span>
            <pre class="raw-code">{{ JSON.stringify(settings, null, 2) }}</pre>
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
  background: linear-gradient(135deg, #f59e0b, #e11d48);
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
  background: linear-gradient(to right, #f59e0b, #e11d48);
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
  border-color: rgba(245, 158, 11, 0.4);
}

.card h2 {
  font-size: 1.25rem;
  color: #f59e0b;
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

.note-textarea {
  width: 100%;
  height: 120px;
  padding: 0.75rem 1rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 0.95rem;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s;
}

.note-textarea:focus {
  border-color: #f59e0b;
}

.status-indicator {
  font-size: 0.85rem;
  color: #94a3b8;
  text-align: left;
  width: 100%;
}

.key-tag {
  font-family: 'Fira Code', monospace;
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 6px;
}

.settings-box {
  align-items: stretch;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.setting-item .label {
  font-weight: 600;
  color: #cbd5e1;
  font-size: 0.95rem;
}

.toggle-group {
  display: flex;
  gap: 0.4rem;
}

.btn-toggle {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #cbd5e1;
  padding: 0.45rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-toggle:hover {
  background: rgba(255, 255, 255, 0.06);
}

.btn-toggle.active {
  background: rgba(245, 158, 11, 0.15);
  border-color: rgba(245, 158, 11, 0.35);
  color: #f59e0b;
}

.select-input {
  padding: 0.45rem 1rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 0.9rem;
  outline: none;
  cursor: pointer;
}

.select-input:focus {
  border-color: #f59e0b;
}

.btn-check {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
  padding: 0.45rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-check.enabled {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.divider {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
}

.actions-row {
  display: flex;
  justify-content: flex-end;
}

.sync-card {
  border-color: rgba(245, 158, 11, 0.2);
}

.monitor-box {
  align-items: stretch;
  text-align: left;
}

.monitor-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.monitor-row .label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #94a3b8;
}

.raw-code {
  margin: 0;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  color: #cbd5e1;
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

.btn-secondary {
  background: rgba(148, 163, 184, 0.15);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.btn-secondary:hover {
  background: rgba(148, 163, 184, 0.25);
  transform: translateY(-1px);
}
</style>
