<script setup>
</script>

<template>
  <div class="team-capacity-card">
    <div class="capacity-header">
      <h3 class="capacity-title">TEAM CAPACITY</h3>
    </div>

    <div class="capacity-percentage">
      <div class="percentage-circle">
        <span class="percentage-value">94.2%</span>
      </div>
    </div>

    <div class="capacity-info">
      <div class="info-item">
        <i class="pi pi-users"></i>
        <span>18 Active contributors</span>
      </div>
      <div class="info-item">
        <i class="pi pi-check-circle"></i>
        <span>4 Projects nearing delivery</span>
      </div>
    </div>

    <pv-button
      label="RESOURCE MANAGER"
      icon="pi pi-arrow-right"
      icon-pos="right"
      class="resource-button"
    />
  </div>
</template>

<style scoped>
.team-capacity-card {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  color: white;
  min-height: 380px;
  justify-content: space-between;
}

.capacity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.capacity-title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.capacity-percentage {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.percentage-circle {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(255, 255, 255, 0.2);
}

.percentage-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
}

.capacity-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
}

.info-item i {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
}

:deep(.resource-button) {
  background: white !important;
  color: #2563eb !important;
  border-color: white !important;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

:deep(.resource-button:hover) {
  background: rgba(255, 255, 255, 0.9) !important;
}
</style>

