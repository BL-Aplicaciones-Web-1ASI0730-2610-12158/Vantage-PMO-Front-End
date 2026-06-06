<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="not-found-icon">
        <i class="pi pi-wrench"></i>
      </div>
      <h1 class="not-found-title">Coming Soon</h1>
      <p class="not-found-sub">This section is currently under development. Check back soon!</p>
      <button class="back-btn" @click="router.push({ name: 'home' })">
        <i class="pi pi-arrow-left"></i> Back to Home
      </button>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
}

.not-found-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.not-found-icon {
  width: 72px;
  height: 72px;
  background: #eff6ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #2563eb;
}

.not-found-title {
  font-size: 28px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.not-found-sub {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  max-width: 320px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.back-btn:hover {
  background: #1d4ed8;
}
</style>
