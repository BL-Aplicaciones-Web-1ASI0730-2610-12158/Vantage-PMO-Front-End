<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  projectCount: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['filter-changed', 'sort-changed']);

const showFilter = ref(false);
const filters = ref({
  critical: true,
  healthy: true,
  atRisk: true
});

const filterLabel = computed(() => {
  const activeFilters = Object.values(filters.value).filter(Boolean).length;
  return activeFilters === 3 ? 'Filter' : `Filter (${activeFilters})`;
});

const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};

const toggleSort = () => {
  emit('sort-changed');
};
</script>

<template>
  <div class="projects-header">
    <div class="header-content">
      <h1 class="header-title">{{ t('projects.title') }}</h1>
      <p class="header-subtitle">
        {{ t('projects.subtitle', { n: projectCount }) }}
      </p>
    </div>

    <div class="header-actions">
      <pv-button
        icon="pi pi-filter"
        :label="filterLabel"
        severity="secondary"
        @click="toggleFilter"
      />
      <pv-button
        icon="pi pi-sort-alt"
        label="Sort By Health"
        severity="secondary"
        @click="toggleSort"
      />
    </div>

    <!-- Filter Menu -->
    <div v-if="showFilter" class="filter-menu">
      <div class="filter-option">
        <pv-checkbox
          v-model="filters.critical"
          :binary="true"
          label="Critical"
        />
      </div>
      <div class="filter-option">
        <pv-checkbox
          v-model="filters.healthy"
          :binary="true"
          label="Healthy"
        />
      </div>
      <div class="filter-option">
        <pv-checkbox
          v-model="filters.atRisk"
          :binary="true"
          label="At Risk"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.projects-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.header-content {
  flex: 1;
  min-width: 300px;
}

.header-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
}

.header-subtitle {
  margin: 0.5rem 0 0;
  font-size: 0.95rem;
  color: #6b7280;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.filter-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  z-index: 10;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .projects-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }
}
</style>

