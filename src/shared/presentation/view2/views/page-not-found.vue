<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="not-found-icon">
        <i class="pi pi-chart-line"></i>
      </div>

      <h1 class="not-found-title">
        Coming Soon
      </h1>

      <p class="not-found-sub">
        This section is under development.
      </p>

      <button
          class="back-btn"
          @click="router.push({ name: 'home' })">
        <i class="pi pi-arrow-left"></i>
        Back to Home
      </button>
    </div>
  </div>
</template>

<style scoped>
.not-found{
  display:flex;
  justify-content:center;
  align-items:center;
  min-height:500px;
}

.not-found-content{
  text-align:center;
  display:flex;
  flex-direction:column;
  gap:16px;
  align-items:center;
}

.not-found-icon{
  width:80px;
  height:80px;
  border-radius:50%;
  background:#eff6ff;
  color:#2563eb;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:30px;
}

.not-found-title{
  margin:0;
  font-size:30px;
  font-weight:800;
  color:#1e293b;
}

.not-found-sub{
  margin:0;
  color:#64748b;
}

.back-btn{
  border:none;
  cursor:pointer;
  padding:10px 20px;
  border-radius:8px;
  background:#2563eb;
  color:white;
  font-weight:600;
}

.back-btn:hover{
  background:#1d4ed8;
}
</style>