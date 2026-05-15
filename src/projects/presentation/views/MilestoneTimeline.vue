<template>
  <div class="timeline-container">
    <div class="timeline-header">
      <h3 class="timeline-title">MILESTONE TIMELINE</h3>
      <pv-button
        label="Edit Roadmap"
        icon="pi pi-pencil"
        severity="secondary"
        text
        size="small"
      />
    </div>
    <pv-timeline :value="timelineEvents" align="left">
      <template #content="slotProps">
        <div class="timeline-content">
          <span class="event-title">{{ slotProps.item.title }}</span>
          <span class="event-date">{{ slotProps.item.date }}</span>
        </div>
      </template>
      <template #marker="slotProps">
        <div class="timeline-marker" :class="slotProps.item.type">
          <i :class="slotProps.item.icon"></i>
        </div>
      </template>
    </pv-timeline>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const timelineEvents = ref([
  {
    title: 'Node Sync',
    date: 'Completed Sep 28',
    type: 'success',
    icon: 'pi pi-check'
  },
  {
    title: 'Load Balancer Test',
    date: 'In Progress - Oct 12',
    type: 'pending',
    icon: 'pi pi-spin pi-spinner'
  },
  {
    title: 'Public Release',
    date: 'Scheduled - Nov 01',
    type: 'future',
    icon: 'pi pi-calendar'
  }
]);
</script>

<style scoped>
.timeline-container {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.timeline-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.event-title {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.95rem;
}

.event-date {
  color: #6b7280;
  font-size: 0.85rem;
}

.timeline-marker {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #e5e7eb;
  color: white;
}

.timeline-marker.success {
  background: #10b981;
}

.timeline-marker.pending {
  background: #f59e0b;
}

.timeline-marker.future {
  background: #3b82f6;
}

:deep(.p-timeline) {
  padding: 0;
}

:deep(.p-timeline .p-timeline-event) {
  padding-left: 1rem;
}

:deep(.p-timeline .p-timeline-event-marker) {
  margin-left: -1.25rem;
}
</style>

