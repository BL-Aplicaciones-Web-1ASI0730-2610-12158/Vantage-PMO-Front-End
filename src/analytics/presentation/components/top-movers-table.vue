<script setup>
import { HEALTH_STATUS_OPTIONS } from '../../domain/model/project-health-status.js';

defineProps({
    movers: { type: Array, default: () => [] },
});

function healthBadge(health) {
    return HEALTH_STATUS_OPTIONS.find(o => o.value === health) ?? HEALTH_STATUS_OPTIONS[2];
}
</script>

<template>
  <div class="movers">
    <div class="movers__header">
      <span class="movers__col movers__col--id">Project ID</span>
      <span class="movers__col movers__col--name">Name</span>
      <span class="movers__col movers__col--delta">Delta</span>
      <span class="movers__col movers__col--health">Health</span>
    </div>
    <div v-for="m in movers" :key="m.projectId" class="movers__row">
      <span class="movers__col movers__col--id movers__id">#{{ m.projectId }}</span>
      <div class="movers__col movers__col--name">
        <span class="movers__name">{{ m.name }}</span>
        <span class="movers__cat">{{ m.category }}</span>
      </div>
      <span :class="['movers__col', 'movers__col--delta', m.isPositive ? 'delta-up' : 'delta-down']">
        {{ m.formattedDelta }}
      </span>
      <span class="movers__col movers__col--health">
        <span :class="['health-badge', healthBadge(m.health).cssClass]">
          {{ healthBadge(m.health).label }}
        </span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.movers { display: flex; flex-direction: column; }
.movers__header, .movers__row {
  display: grid;
  grid-template-columns: 90px 1fr 80px 100px;
  align-items: center;
  gap: .5rem;
  padding: .65rem 0;
}
.movers__header {
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: .5rem;
}
.movers__header .movers__col {
  font-size: .62rem; font-weight: 800; color: #9ca3af;
  text-transform: uppercase; letter-spacing: .07em;
}
.movers__row { border-bottom: 1px solid #f9fafb; }
.movers__row:last-child { border-bottom: none; }
.movers__id { font-size: .78rem; font-weight: 700; color: #6b7280; font-family: monospace; }
.movers__name { display: block; font-size: .85rem; font-weight: 700; color: #111827; }
.movers__cat  { display: block; font-size: .72rem; color: #9ca3af; margin-top: .1rem; }
.delta-up   { color: #16a34a; font-weight: 800; font-size: .85rem; }
.delta-down { color: #dc2626; font-weight: 800; font-size: .85rem; }
.health-badge {
  font-size: .65rem; font-weight: 800; border-radius: 99px;
  padding: 3px 10px; white-space: nowrap; letter-spacing: .04em;
}
.health-optimal  { background: #d1fae5; color: #065f46; }
.health-at-risk  { background: #fee2e2; color: #991b1b; }
.health-stable   { background: #dbeafe; color: #1e40af; }

@media (max-width: 640px) {
  .movers__header, .movers__row {
    grid-template-columns: 70px 1fr 70px 90px;
  }
}
</style>
