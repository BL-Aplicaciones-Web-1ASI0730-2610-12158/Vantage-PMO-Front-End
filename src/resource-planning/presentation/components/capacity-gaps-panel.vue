<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
    gaps: { type: Array, default: () => [] },
});

const { t } = useI18n();
</script>

<template>
  <div class="gaps">
    <div v-if="!gaps.length" class="gaps__empty">
      <i class="pi pi-check-circle" />
      <span>{{ t('resourcePlanning.capacityGaps.noGaps') }}</span>
    </div>
    <div
        v-for="gap in gaps"
        :key="gap.id"
        :class="['gaps__item', `gaps__item--${gap.severity}`]"
    >
      <div class="gaps__icon">
        <i class="pi pi-user-plus" />
      </div>
      <div class="gaps__body">
        <div class="gaps__title">{{ gap.project }}</div>
        <div class="gaps__meta">
          {{ gap.role }} · {{ gap.headcount }} {{ t('resourcePlanning.capacityGaps.headcount') }}
        </div>
      </div>
      <div class="gaps__date">
        <span class="gaps__date-label">{{ t('resourcePlanning.capacityGaps.neededBy') }}</span>
        <span class="gaps__date-value">{{ gap.gapDate }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gaps { display: flex; flex-direction: column; gap: .75rem; }
.gaps__empty {
  display: flex; align-items: center; justify-content: center;
  gap: .5rem; padding: 2rem; color: #16a34a; font-size: .85rem;
}
.gaps__item {
  display: flex; align-items: center; gap: .85rem;
  padding: .85rem 1rem;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
}
.gaps__item--high   { border-left: 3px solid #dc2626; }
.gaps__item--medium { border-left: 3px solid #f59e0b; }
.gaps__item--low    { border-left: 3px solid #3b82f6; }
.gaps__icon {
  width: 36px; height: 36px; border-radius: 8px;
  background: #f3f4f6; color: #6b7280;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.gaps__item--high .gaps__icon   { background: #fee2e2; color: #dc2626; }
.gaps__item--medium .gaps__icon { background: #fef3c7; color: #d97706; }
.gaps__body { flex: 1; min-width: 0; }
.gaps__title { font-weight: 700; font-size: .85rem; color: #111827; }
.gaps__meta  { font-size: .75rem; color: #6b7280; margin-top: .15rem; }
.gaps__date  { text-align: right; flex-shrink: 0; }
.gaps__date-label { display: block; font-size: .62rem; font-weight: 800; color: #9ca3af; text-transform: uppercase; letter-spacing: .05em; }
.gaps__date-value { font-size: .82rem; font-weight: 700; color: #374151; }
</style>
