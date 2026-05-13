<template>
  <div class="project-card">
    <div class="header">
      <span class="status" :class="statusClass">{{ statusLabel }}</span>
      <h3>{{ project.name }}</h3>
      <p>{{ project.description }}</p>
    </div>
    <div class="progress-section">
      <span>PROGRESS</span>
      <div class="progress-bar">
        <div class="progress" :style="{ width: project.progress + '%' }"></div>
      </div>
      <span>{{ project.progress }}%</span>
    </div>
    <div class="milestones">
      <span>UPCOMING MILESTONES</span>
      <ul>
        <li v-for="milestone in project.milestones" :key="milestone.id">
          <span>{{ milestone.name }}</span>
          <span>{{ milestone.date }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  project: Object
});

const statusClass = computed(() => {
  if (project.status === 'critical') return 'critical';
  if (project.status === 'healthy') return 'healthy';
  if (project.status === 'at-risk') return 'at-risk';
  return '';
});
const statusLabel = computed(() => {
  if (project.status === 'critical') return 'CRITICAL';
  if (project.status === 'healthy') return 'HEALTHY';
  if (project.status === 'at-risk') return 'AT RISK';
  return '';
});
</script>

<style scoped>
.project-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 1.5rem;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.header h3 {
  margin: 0;
  font-size: 1.2rem;
}
.status.critical { color: #e74c3c; }
.status.healthy { color: #27ae60; }
.status.at-risk { color: #f39c12; }
.progress-section {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.progress-bar {
  background: #eee;
  border-radius: 6px;
  height: 8px;
  width: 100%;
  margin: 0.2rem 0;
}
.progress {
  background: #2563eb;
  height: 8px;
  border-radius: 6px;
}
.milestones ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.milestones li {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  margin-bottom: 0.2rem;
}
</style>

