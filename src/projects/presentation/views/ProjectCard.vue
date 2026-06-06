<script setup>
import { computed } from 'vue';

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
});

const statusLabel = computed(() => {
  const statusMap = {
    'critical': 'CRITICAL',
    'healthy': 'HEALTHY',
    'at-risk': 'AT RISK'
  };
  return statusMap[props.project.status] || 'UNKNOWN';
});

const tagSeverity = computed(() => {
  const severityMap = {
    'critical': 'danger',
    'healthy': 'success',
    'at-risk': 'warning'
  };
  return severityMap[props.project.status] || 'info';
});

const getMilestoneIcon = (type) => {
  const iconMap = {
    'success': 'pi pi-check-circle',
    'warning': 'pi pi-exclamation-circle',
    'pending': 'pi pi-calendar'
  };
  return iconMap[type] || 'pi pi-circle';
};
</script>

<template>
  <div class="project-card">
    <!-- Card Header with Badge -->
    <div class="card-header">
      <div class="header-content">
        <h3 class="project-name">{{ project.name }}</h3>
        <p class="project-category">{{ project.category }}</p>
      </div>
      <pv-tag :value="statusLabel" :severity="tagSeverity" />
    </div>

    <!-- Description -->
    <p class="project-description">{{ project.description }}</p>

    <!-- Progress Section -->
    <div class="progress-section">
      <div class="progress-header">
        <span class="label">PROGRESS</span>
        <span class="percentage">{{ project.progress }}%</span>
      </div>
      <pv-progressbar :value="project.progress" class="progress-bar" :showValue="false"></pv-progressbar>
    </div>

    <!-- Milestones -->
    <div class="milestones-section">
      <span class="label">UPCOMING MILESTONES</span>
      <div class="milestones-list">
        <div v-for="milestone in project.milestones" :key="milestone.id" class="milestone-item">
          <div class="milestone-icon">
            <i :class="getMilestoneIcon(milestone.type)"></i>
          </div>
          <div class="milestone-info">
            <span class="milestone-name">{{ milestone.name }}</span>
          </div>
          <span class="milestone-date">{{ milestone.date }}</span>
        </div>
      </div>
    </div>

    <!-- Card Footer -->
    <div class="card-footer">
      <div class="team-avatars">
        <pv-avatar-group>
          <pv-avatar
            v-for="member in project.teamMembers.slice(0, 3)"
            :key="member.id"
            :label="member.avatar"
            shape="circle"
            size="small"
          />
          <pv-avatar
            v-if="project.teamMembers.length > 3"
            :label="`+${project.teamMembers.length - 3}`"
            shape="circle"
            size="small"
          />
        </pv-avatar-group>
      </div>
      <div class="action-buttons">
        <pv-button icon="pi pi-calendar" severity="secondary" text size="small" />
        <pv-button @click="$emit('edit', project)" icon="pi pi-pencil" severity="secondary" text size="small" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 380px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.project-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.header-content {
  flex: 1;
}

.project-name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
}

.project-category {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.project-description {
  margin: 0;
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.4;
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.percentage {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

:deep(.progress-bar) {
  height: 0.5rem;
}

.milestones-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.milestones-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.milestone-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  font-size: 0.875rem;
}

.milestone-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
}

.milestone-icon i {
  font-size: 1rem;
}

.milestone-info {
  flex: 1;
}

.milestone-name {
  color: #374151;
  font-weight: 500;
}

.milestone-date {
  color: #9ca3af;
  font-size: 0.8rem;
  white-space: nowrap;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  border-top: 1px solid #f0f0f0;
  padding-top: 1rem;
}

.team-avatars {
  display: flex;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}
</style>



