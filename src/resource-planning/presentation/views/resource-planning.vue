<script setup>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useResourcePlanningStore } from '../../application/resource-planning.store.js';
import PlanningSummaryCards from '../components/planning-summary-cards.vue';
import DepartmentUtilization from '../components/department-utilization.vue';
import AllocationTable from '../components/allocation-table.vue';
import CapacityGapsPanel from '../components/capacity-gaps-panel.vue';

const { t } = useI18n();
const store = useResourcePlanningStore();

onMounted(() => store.fetchDashboard());

function handleOptimize() {
    alert(t('resourcePlanning.actions.optimizeAlert'));
}
</script>

<template>
  <div class="rp-page">
    <div class="rp-topbar">
      <div>
        <h1 class="rp-title">{{ t('resourcePlanning.title') }}</h1>
        <p class="rp-subtitle">{{ t('resourcePlanning.subtitle') }}</p>
      </div>
      <div class="rp-topbar__actions">
        <span v-if="store.period" class="rp-period-badge">
          <i class="pi pi-calendar" />
          {{ store.period }}
        </span>
        <button class="rp-btn" @click="handleOptimize">
          <i class="pi pi-sliders-h" />
          {{ t('resourcePlanning.actions.optimize') }}
        </button>
      </div>
    </div>

    <div v-if="store.loading" class="rp-state">
      <i class="pi pi-spin pi-spinner rp-state__icon" />
      <span>{{ t('resourcePlanning.loading') }}</span>
    </div>

    <div v-else-if="store.error" class="rp-state rp-state--error">
      <i class="pi pi-exclamation-circle rp-state__icon" />
      <span>{{ store.error }}</span>
    </div>

    <template v-else-if="store.dashboard">
      <PlanningSummaryCards :kpis="store.summaryKpis" />

      <div class="rp-grid rp-grid--2">
        <div class="rp-card">
          <div class="rp-card__head">
            <h2 class="rp-card__title">{{ t('resourcePlanning.departmentCapacity.title') }}</h2>
            <p class="rp-card__sub">{{ t('resourcePlanning.departmentCapacity.subtitle') }}</p>
          </div>
          <DepartmentUtilization :departments="store.departmentCapacity" />
        </div>

        <div class="rp-card">
          <div class="rp-card__head">
            <h2 class="rp-card__title">{{ t('resourcePlanning.capacityGaps.title') }}</h2>
            <p class="rp-card__sub">{{ t('resourcePlanning.capacityGaps.subtitle') }}</p>
          </div>
          <CapacityGapsPanel :gaps="store.capacityGaps" />
        </div>
      </div>

      <div class="rp-card">
        <div class="rp-card__head rp-card__head--row">
          <div>
            <h2 class="rp-card__title">{{ t('resourcePlanning.allocations.title') }}</h2>
            <p class="rp-card__sub">{{ t('resourcePlanning.allocations.subtitle') }}</p>
          </div>
          <span class="rp-live-badge">{{ t('resourcePlanning.allocations.liveUpdate') }}</span>
        </div>
        <AllocationTable :allocations="store.allocations" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.rp-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-height: 100%;
}

.rp-topbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}
.rp-title    { font-size: 1.6rem; font-weight: 800; margin: 0; color: #111827; }
.rp-subtitle { color: #6b7280; font-size: .9rem; margin: .2rem 0 0; }
.rp-topbar__actions { display: flex; align-items: center; gap: .75rem; }

.rp-period-badge {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: .75rem;
  font-weight: 700;
  border-radius: 8px;
  padding: 6px 12px;
}
.rp-btn {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  background: #111827;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: .78rem;
  font-weight: 700;
  cursor: pointer;
}
.rp-btn:hover { background: #1f2937; }

.rp-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .75rem;
  padding: 4rem;
  color: #6b7280;
}
.rp-state--error { color: #dc2626; }
.rp-state__icon  { font-size: 1.5rem; }

.rp-grid { display: grid; gap: 1.25rem; }
.rp-grid--2 { grid-template-columns: 1fr 1fr; }

.rp-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.rp-card__head { display: flex; flex-direction: column; gap: .2rem; }
.rp-card__head--row {
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
}
.rp-card__title { font-size: .95rem; font-weight: 800; color: #111827; margin: 0; }
.rp-card__sub   { font-size: .78rem; color: #9ca3af; margin: 0; }

.rp-live-badge {
  background: #dcfce7;
  color: #166534;
  font-size: .62rem;
  font-weight: 800;
  letter-spacing: .08em;
  border-radius: 6px;
  padding: 3px 10px;
  white-space: nowrap;
  flex-shrink: 0;
}

@media (max-width: 900px) {
  .rp-grid--2 { grid-template-columns: 1fr; }
}
</style>
