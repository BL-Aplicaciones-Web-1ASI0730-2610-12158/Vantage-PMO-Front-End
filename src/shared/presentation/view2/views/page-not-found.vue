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
      <h1 class="not-found-title">Enterprise Module Under Construction</h1>
      <p class="not-found-sub">This strategic section is currently being optimized for the Enterprise/Owner dashboard.</p>
      <button class="back-btn" @click="router.push({ name: 'home' })">
        <i class="pi pi-arrow-left"></i> Back to Dashboard
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
  background: #f3e8ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #7c3aed;
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
  background: #7c3aed;
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
  background: #6d28d9;
}
</style>