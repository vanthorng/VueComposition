<script setup lang="ts">
// In a routed Vue app, we don't need to import all the lesson views here.
// They are dynamically resolved and rendered by the <RouterView /> component.
</script>

<template>
  <div class="app-container">
    <nav class="navigation-bar">
      <span class="nav-title">Vue 3 Composition API Course</span>
      <div class="tab-group">
        <RouterLink to="/lesson/15" class="tab-btn" active-class="active"
          >L15: API Composable</RouterLink
        >
      </div>
    </nav>

    <!-- RouterView acts as a slot where the active route's component is loaded -->
    <div class="content-container">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 4rem 0;
}

.navigation-bar {
  width: 100%;
  max-width: 950px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.nav-title {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: linear-gradient(135deg, #42d392, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.tab-group {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.tab-btn {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #94a3b8;
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.tab-btn.active {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.05);
}

.content-container {
  width: 100%;
  max-width: 800px;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 900px) {
  .navigation-bar {
    flex-direction: column;
    gap: 1.25rem;
    align-items: center;
  }
}
</style>
