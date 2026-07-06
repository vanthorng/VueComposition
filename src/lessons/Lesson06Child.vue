<script setup lang="ts">
import { ref } from 'vue'

// --- Props Definition (Parent to Child) ---
// defineProps is a compiler macro in <script setup>, so it doesn't need to be imported.
// In TypeScript, we can use generic type definitions to declare props.
const props = withDefaults(
  defineProps<{
    id: number
    title: string
    likes: number
    theme?: 'light' | 'dark'
  }>(),
  {
    theme: 'dark', // Default value for theme prop
  },
)

// --- Emits Definition (Child to Parent) ---
// defineEmits is also a compiler macro.
// It defines the events this child can fire up to the parent.
const emit = defineEmits<{
  (e: 'updateLikes', id: number, newLikes: number): void
  (e: 'deleteCard', id: number): void
  (e: 'addComment', id: number, text: string): void
}>()

const commentText = ref('')

const handleLike = (currentLikes: number) => {
  // Emit event to parent with payload
  emit('updateLikes', props.id, currentLikes + 1)
}

const handleDislike = (currentLikes: number) => {
  emit('updateLikes', props.id, Math.max(0, currentLikes - 1))
}

const sendComment = () => {
  const trimmed = commentText.value.trim()
  if (trimmed) {
    emit('addComment', props.id, trimmed)
    commentText.value = ''
  }
}

const handleDelete = () => {
  emit('deleteCard', props.id)
}
</script>

<template>
  <div class="child-card" :class="theme === 'light' ? 'theme-light' : 'theme-dark'">
    <div class="card-header">
      <h4>{{ title }}</h4>
      <button @click="handleDelete" class="btn-delete" title="Delete Item">×</button>
    </div>

    <div class="card-body">
      <div class="likes-section">
        <span
          >Likes: <strong class="likes-count">{{ likes }}</strong></span
        >
        <div class="likes-actions">
          <button @click="handleDislike(likes)" class="btn-action">👎</button>
          <button @click="handleLike(likes)" class="btn-action">👍</button>
        </div>
      </div>

      <div class="comment-section">
        <input
          type="text"
          v-model="commentText"
          placeholder="Add a comment..."
          @keyup.enter="sendComment"
          class="child-input"
        />
        <button @click="sendComment" class="btn-send">Send</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.child-card {
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.2s ease;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.theme-dark {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f8fafc;
}

.theme-light {
  background: #f8fafc;
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: #0f172a;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  padding-bottom: 0.5rem;
}

.card-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.btn-delete {
  background: transparent;
  border: none;
  color: #ef4444;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 0.25rem;
  transition: transform 0.2s;
}

.btn-delete:hover {
  transform: scale(1.2);
}

.likes-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.likes-count {
  color: #8b5cf6;
}

.theme-light .likes-count {
  color: #6d28d9;
}

.likes-actions {
  display: flex;
  gap: 0.4rem;
}

.btn-action {
  background: rgba(148, 163, 184, 0.15);
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.2s;
}

.btn-action:hover {
  background: rgba(148, 163, 184, 0.3);
}

.comment-section {
  display: flex;
  gap: 0.5rem;
}

.child-input {
  flex-grow: 1;
  padding: 0.4rem 0.75rem;
  font-size: 0.85rem;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s;
}

.theme-dark .child-input {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
}

.theme-dark .child-input:focus {
  border-color: #8b5cf6;
}

.theme-light .child-input {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.15);
  color: #0f172a;
}

.theme-light .child-input:focus {
  border-color: #6d28d9;
}

.btn-send {
  padding: 0.4rem 0.75rem;
  background: #8b5cf6;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-send:hover {
  background: #7c3aed;
}
</style>
