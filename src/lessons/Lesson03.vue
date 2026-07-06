<script setup lang="ts">
import { ref, computed } from 'vue'

// --- Demo 1: Shopping Cart (Basic Read-only Computed) ---
const cart = ref([
  { id: 1, name: 'Premium Mechanical Keyboard', price: 129, quantity: 1 },
  { id: 2, name: 'Ergonomic Wireless Mouse', price: 79, quantity: 1 },
  { id: 3, name: 'UltraWide 34" Monitor', price: 449, quantity: 0 },
])

const taxRate = ref(0.08) // 8% tax rate

// Standard Read-only Computed Property:
// Vue tracks that 'cart' and 'taxRate' are dependencies.
// This only recalculates if cart items, quantity, or taxRate changes!
const subtotal = computed(() => {
  console.log('⚡ Computed subtotal recalculated!')
  return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const taxAmount = computed(() => {
  return subtotal.value * taxRate.value
})

const total = computed(() => {
  return subtotal.value + taxAmount.value
})

// Modifiers for quantity
const updateQuantity = (id: number, delta: number) => {
  const item = cart.value.find((i) => i.id === id)
  if (item) {
    item.quantity = Math.max(0, item.quantity + delta)
  }
}

// Unrelated counter to demonstrate caching vs method execution
const unrelatedCounter = ref(0)

// A method returning the subtotal (for comparison)
const getSubtotalMethod = () => {
  console.log('🔄 Method getSubtotalMethod executed!')
  return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

// --- Demo 2: User Profile (Writable Computed with getter/setter) ---
const firstName = ref('Thai')
const lastName = ref('Vanthorng')

// Writable Computed Property
const fullName = computed({
  // getter
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  // setter
  set(newValue) {
    const names = newValue.split(' ')
    firstName.value = names[0] || ''
    lastName.value = names.slice(1).join(' ')
  },
})
</script>

<template>
  <div class="lesson-container">
    <header class="lesson-header">
      <span class="badge">Lesson 03</span>
      <h1>computed() Properties</h1>
      <p class="subtitle">Understand reactive caching and dynamic derived state.</p>
    </header>

    <main class="lesson-content">
      <!-- Card 1: Shopping Cart & Caching Demo -->
      <section class="card">
        <h2>1. Derived State & Caching</h2>
        <p class="description">
          Computed properties are cached based on their reactive dependencies. They only recalculate
          when their dependencies change. Methods in templates execute on every single render.
        </p>

        <div class="demo-box">
          <div class="cart-items">
            <div v-for="item in cart" :key="item.id" class="cart-item">
              <span class="item-name">{{ item.name }} (${{ item.price }})</span>
              <div class="quantity-controls">
                <button @click="updateQuantity(item.id, -1)" class="btn-qty">-</button>
                <span class="item-qty">{{ item.quantity }}</span>
                <button @click="updateQuantity(item.id, 1)" class="btn-qty">+</button>
              </div>
            </div>
          </div>

          <div class="tax-control">
            <label>Tax Rate: {{ (taxRate * 100).toFixed(0) }}%</label>
            <input type="range" min="0" max="0.25" step="0.01" v-model.number="taxRate" />
          </div>

          <div class="divider"></div>

          <div class="summary-grid">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span class="price-val">${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Tax (computed):</span>
              <span class="price-val">${{ taxAmount.toFixed(2) }}</span>
            </div>
            <div class="summary-row total-row">
              <span>Grand Total:</span>
              <span class="price-val highlight">${{ total.toFixed(2) }}</span>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Caching comparison section -->
          <div class="caching-demo">
            <h3>Caching Comparison</h3>
            <p class="hint">Check the browser console logs when you interact with these buttons!</p>
            <div class="comparison-actions">
              <button @click="unrelatedCounter++" class="btn btn-secondary">
                Trigger Re-render (Counter: {{ unrelatedCounter }})
              </button>
            </div>
            <div class="log-info">
              <div>
                Subtotal via Method: <code>{{ getSubtotalMethod() }}</code> (runs every click)
              </div>
              <div>
                Subtotal via Computed: <code>{{ subtotal }}</code> (cached, runs only on cart
                changes)
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Card 2: Writable Computed -->
      <section class="card">
        <h2>2. Writable Computed Properties</h2>
        <p class="description">
          Computed properties are read-only by default. However, you can provide both a
          <code>get</code> and a <code>set</code> function to make them writable.
        </p>

        <div class="demo-box">
          <div class="profile-inputs">
            <div class="input-field">
              <label>First Name:</label>
              <input type="text" v-model="firstName" class="text-input" />
            </div>
            <div class="input-field">
              <label>Last Name:</label>
              <input type="text" v-model="lastName" class="text-input" />
            </div>
          </div>

          <div class="divider"></div>

          <div class="input-field full-width">
            <label>Full Name (Writable Computed):</label>
            <input type="text" v-model="fullName" class="text-input highlight-border" />
            <p class="hint">
              Try changing the full name directly above (e.g. type "John Doe") and watch First Name
              and Last Name update!
            </p>
          </div>

          <div class="profile-preview">
            Combined Output: <span class="highlight">{{ fullName }}</span>
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
  background: linear-gradient(135deg, #06b6d4, #647eff);
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
  background: linear-gradient(to right, #06b6d4, #647eff);
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
  border-color: rgba(6, 182, 212, 0.4);
}

.card h2 {
  font-size: 1.25rem;
  color: #06b6d4;
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
  color: #22d3ee;
}

.demo-box {
  background: rgba(15, 23, 42, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.cart-items {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.item-name {
  font-weight: 500;
  color: #e2e8f0;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-qty {
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #fff;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 0.2s;
}

.btn-qty:hover {
  background: rgba(255, 255, 255, 0.15);
}

.item-qty {
  font-weight: 700;
  min-width: 20px;
  text-align: center;
}

.tax-control {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
}

.tax-control input[type='range'] {
  flex-grow: 1;
  accent-color: #06b6d4;
}

.divider {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
}

.summary-grid {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  color: #94a3b8;
}

.total-row {
  font-size: 1.15rem;
  color: #fff;
  font-weight: 700;
  margin-top: 0.25rem;
}

.price-val {
  font-family: 'Fira Code', monospace;
}

.highlight {
  color: #06b6d4;
}

.caching-demo {
  width: 100%;
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  text-align: left;
}

.caching-demo h3 {
  font-size: 0.95rem;
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #cbd5e1;
}

.comparison-actions {
  margin-bottom: 0.75rem;
}

.btn {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
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
}

.log-info {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: #94a3b8;
}

.profile-inputs {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.input-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  text-align: left;
}

.input-field.full-width {
  width: 100%;
}

.input-field label {
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 600;
}

.text-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.text-input:focus {
  border-color: #06b6d4;
}

.highlight-border {
  border-color: rgba(6, 182, 212, 0.3);
}

.highlight-border:focus {
  border-color: #06b6d4;
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.15);
}

.profile-preview {
  font-size: 1.1rem;
  font-weight: 600;
}

.hint {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 0.25rem;
  margin-bottom: 0;
  text-align: left;
}
</style>
