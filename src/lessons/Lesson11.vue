<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Static list of products to filter
const products = [
  { id: 1, name: 'Apple MacBook Pro M3', category: 'Laptops', price: 1999 },
  { id: 2, name: 'Sony WH-1000XM5 Headphones', category: 'Audio', price: 399 },
  { id: 3, name: 'iPad Pro 11-inch', category: 'Tablets', price: 999 },
  { id: 4, name: 'Keychron Q1 Mechanical Keyboard', category: 'Keyboards', price: 189 },
  { id: 5, name: 'Logitech MX Master 3S Mouse', category: 'Accessories', price: 99 },
  { id: 6, name: 'Dell UltraSharp 32" 4K Monitor', category: 'Monitors', price: 849 },
]

// 1. Reactive states synced with query parameters
const searchQuery = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')
const selectedCategory = ref<string>('all')

// 2. Initialize state from URL queries on mount
onMounted(() => {
  searchQuery.value = (route.query.q as string) || ''
  sortOrder.value = (route.query.sort as 'asc' | 'desc') || 'asc'
  selectedCategory.value = (route.query.category as string) || 'all'
})

// 3. Watch local controls and push updates to URL queries
// We use router.replace to avoid polluting browser history on every keystroke
watch([searchQuery, sortOrder, selectedCategory], ([q, sort, category]) => {
  router.replace({
    path: route.path,
    query: {
      q: q.trim() || undefined, // undefined removes key from query string
      sort: sort !== 'asc' ? sort : undefined, // default asc omitted
      category: category !== 'all' ? category : undefined,
    },
  })
})

// 4. Watch route query changes (handles browser Back/Forward navigation)
watch(
  () => route.query,
  (newQuery) => {
    searchQuery.value = (newQuery.q as string) || ''
    sortOrder.value = (newQuery.sort as 'asc' | 'desc') || 'asc'
    selectedCategory.value = (newQuery.category as string) || 'all'
  },
)

// 5. Computed filtered and sorted products (Lesson 03)
const filteredProducts = computed(() => {
  let list = [...products]

  // Filter by search query
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter((p) => p.name.toLowerCase().includes(q))
  }

  // Filter by category
  if (selectedCategory.value !== 'all') {
    list = list.filter((p) => p.category === selectedCategory.value)
  }

  // Sort by price
  list.sort((a, b) => {
    return sortOrder.value === 'asc' ? a.price - b.price : b.price - a.price
  })

  return list
})
</script>

<template>
  <div class="lesson-container">
    <header class="lesson-header">
      <span class="badge">Lesson 11</span>
      <h1>Router Query Parameters</h1>
      <p class="subtitle">
        Filter catalogs and preserve user settings directly in URL query parameters.
      </p>
    </header>

    <main class="lesson-content">
      <!-- Controls card -->
      <section class="card">
        <h2>1. Filter & Search Controls</h2>
        <p class="description">
          Any adjustment made below instantly syncs with the browser's URL query string. Share the
          URL or refresh the page, and your filter settings will persist!
        </p>

        <div class="demo-box search-controls-box">
          <div class="controls-row">
            <!-- Search input -->
            <div class="control-field search-field">
              <label>Search Products:</label>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Type to filter..."
                class="text-input"
              />
            </div>

            <!-- Category filter -->
            <div class="control-field">
              <label>Category:</label>
              <select v-model="selectedCategory" class="select-input">
                <option value="all">All Categories</option>
                <option value="Laptops">Laptops</option>
                <option value="Audio">Audio</option>
                <option value="Tablets">Tablets</option>
                <option value="Keyboards">Keyboards</option>
                <option value="Monitors">Monitors</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <!-- Sort dropdown -->
            <div class="control-field">
              <label>Sort Price:</label>
              <select v-model="sortOrder" class="select-input">
                <option value="asc">Lowest to Highest</option>
                <option value="desc">Highest to Lowest</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <!-- Results Grid -->
      <section class="card">
        <h2>2. Dynamic Products Grid ({{ filteredProducts.length }})</h2>
        <div class="demo-box result-list-box">
          <div v-if="filteredProducts.length > 0" class="products-grid">
            <div v-for="p in filteredProducts" :key="p.id" class="product-card">
              <div class="p-category">{{ p.category }}</div>
              <h3 class="p-name">{{ p.name }}</h3>
              <div class="p-price">${{ p.price }}</div>
            </div>
          </div>
          <div v-else class="empty-results">No products match your filters!</div>
        </div>
      </section>

      <!-- Active query inspector -->
      <section class="card">
        <h2>3. Active Query String Inspector</h2>
        <div class="demo-box inspector-box">
          <div class="url-bar">
            <span class="url-label">Browser URL:</span>
            <code class="url-text">http://localhost:5174{{ route.fullPath }}</code>
          </div>
          <div class="inspector-raw">
            <span class="label">Raw route.query Object:</span>
            <pre class="raw-code">{{ JSON.stringify(route.query, null, 2) }}</pre>
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
  background: linear-gradient(135deg, #0ea5e9, #647eff);
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
  background: linear-gradient(to right, #0ea5e9, #647eff);
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
  border-color: rgba(14, 165, 233, 0.4);
}

.card h2 {
  font-size: 1.25rem;
  color: #0ea5e9;
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

.search-controls-box {
  align-items: stretch;
}

.controls-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
}

.control-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  text-align: left;
}

.control-field label {
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 600;
}

.text-input,
.select-input {
  width: 100%;
  padding: 0.7rem 0.9rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.text-input:focus,
.select-input:focus {
  border-color: #0ea5e9;
}

.products-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
}

.product-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 1rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.p-category {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #38bdf8;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.p-name {
  margin: 0;
  font-size: 1rem;
  color: #f1f5f9;
  font-weight: 600;
  flex-grow: 1;
}

.p-price {
  font-family: 'Fira Code', monospace;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0ea5e9;
  margin-top: 0.25rem;
}

.empty-results {
  color: #475569;
  font-style: italic;
  padding: 2rem 0;
  width: 100%;
}

.inspector-box {
  align-items: stretch;
  text-align: left;
  gap: 1.25rem;
}

.url-bar {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.url-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #94a3b8;
}

.url-text {
  font-family: 'Fira Code', monospace;
  font-size: 0.95rem;
  color: #38bdf8;
  background: rgba(14, 165, 233, 0.1);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(14, 165, 233, 0.15);
  word-break: break-all;
}

.inspector-raw {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

@media (max-width: 640px) {
  .controls-row {
    grid-template-columns: 1fr;
  }
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
