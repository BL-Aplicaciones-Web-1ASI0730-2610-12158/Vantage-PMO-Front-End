<!--
  AtRiskProjectsPanel — cross-bounded-context component.
  Consumes ProjectStore (Projects BC) and displays projects with
  "At Risk" or "Critical" status directly inside Risk & Compliance.
-->
<script setup>
import { onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { ProjectStore } from '../../../projects/application/project.store.js';

const { t } = useI18n();
const router = useRouter();
const projectStore = ProjectStore();

onMounted(() => {
  if (!projectStore.projects.length) projectStore.fetchProjects();
});

const atRiskProjects = computed(() =>
  projectStore.projects.filter(p =>
    ['At Risk', 'Critical', 'at-risk', 'critical'].includes(p.status)
  )
);

const statusClass = status => {
  const s = status?.toLowerCase();
  if (s === 'critical') return 'arpp__badge--critical';
  if (s === 'at risk' || s === 'at-risk') return 'arpp__badge--high';
  return 'arpp__badge--medium';
};

function goToProject() {
  router.push({ name: 'active-projects' });
}
</script>

<template>
  <div class="arpp">
    <div class="arpp__header">
      <div>
        <span class="arpp__label">{{ t('riskCompliance.atRiskProjects.title') }}</span>
        <span class="arpp__count">{{ atRiskProjects.length }}</span>
      </div>
      <button class="arpp__link" @click="goToProject">
        {{ t('riskCompliance.atRiskProjects.viewAll') }}
        <i class="pi pi-arrow-right" />
      </button>
    </div>

    <!-- Loading -->
    <div v-if="projectStore.loading" class="arpp__loading">
      <i class="pi pi-spin pi-spinner" />
    </div>

    <!-- Empty -->
    <div v-else-if="!atRiskProjects.length" class="arpp__empty">
      <i class="pi pi-check-circle arpp__empty-icon" />
      <p>{{ t('riskCompliance.atRiskProjects.allHealthy') }}</p>
    </div>

    <!-- List -->
    <ul v-else class="arpp__list">
      <li
        v-for="project in atRiskProjects"
        :key="project.id"
        class="arpp__item"
      >
        <div class="arpp__item-info">
          <span class="arpp__item-name">{{ project.name }}</span>
          <span class="arpp__item-cat">{{ project.category }}</span>
        </div>
        <div class="arpp__item-right">
          <span :class="['arpp__badge', statusClass(project.status)]">
            {{ project.status }}
          </span>
          <div class="arpp__progress-wrap">
            <div class="arpp__progress-bar">
              <div
                class="arpp__progress-fill"
                :style="{ width: project.progress + '%' }"
              />
            </div>
            <span class="arpp__progress-val">{{ project.progress }}%</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.arpp { display: flex; flex-direction: column; gap: .75rem; }

.arpp__header {
  display: flex; justify-content: space-between;
  align-items: center;
}
.arpp__label {
  font-size: .68rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: .1em;
  color: var(--text-secondary);
}
.arpp__count {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px; border-radius: 50%;
  background: #dc2626; color: #fff;
  font-size: .62rem; font-weight: 800;
  margin-left: .4rem;
}
.arpp__link {
  background: none; border: none; cursor: pointer;
  font-size: .68rem; color: #2563eb;
  display: flex; align-items: center; gap: .25rem;
  padding: 0;
}
.arpp__link:hover { text-decoration: underline; }
.app-dark .arpp__link { color: #60a5fa; }

.arpp__loading { text-align: center; color: var(--text-muted); padding: .5rem; font-size: .85rem; }
.arpp__empty {
  display: flex; flex-direction: column; align-items: center;
  gap: .35rem; padding: .75rem; color: var(--text-muted); text-align: center;
}
.arpp__empty-icon { font-size: 1.5rem; color: #16a34a; }
.app-dark .arpp__empty-icon { color: #22c55e; }
.arpp__empty p { margin: 0; font-size: .78rem; }

.arpp__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .45rem; }
.arpp__item {
  display: flex; justify-content: space-between; align-items: center;
  gap: .5rem; padding: .55rem .65rem;
  background: var(--hover-bg); border-radius: 7px;
  border: 1px solid var(--border-color);
  transition: background .15s;
}
.arpp__item:hover { background: var(--active-bg); }

.arpp__item-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.arpp__item-name { font-size: .77rem; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.arpp__item-cat  { font-size: .65rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.arpp__item-right { display: flex; flex-direction: column; align-items: flex-end; gap: .3rem; flex-shrink: 0; }

.arpp__badge {
  display: inline-flex; padding: 2px 7px;
  border-radius: 4px; font-size: .58rem; font-weight: 800;
  text-transform: uppercase; letter-spacing: .05em;
}
.arpp__badge--critical { background: rgba(220,38,38,.15); color: #b91c1c; border: 1px solid rgba(220,38,38,.25); }
.arpp__badge--high     { background: rgba(234,88,12,.15); color: #c2410c; border: 1px solid rgba(234,88,12,.25); }
.arpp__badge--medium   { background: rgba(217,119,6,.15); color: #92400e; border: 1px solid rgba(217,119,6,.25); }
.app-dark .arpp__badge--critical { color: #f87171; background: rgba(239,68,68,.18); border-color: rgba(239,68,68,.3); }
.app-dark .arpp__badge--high     { color: #fb923c; background: rgba(249,115,22,.18); border-color: rgba(249,115,22,.3); }
.app-dark .arpp__badge--medium   { color: #fbbf24; background: rgba(245,158,11,.18); border-color: rgba(245,158,11,.3); }

.arpp__progress-wrap { display: flex; align-items: center; gap: .35rem; }
.arpp__progress-bar  { width: 52px; height: 4px; background: var(--border-color); border-radius: 2px; overflow: hidden; }
.arpp__progress-fill { height: 100%; background: #dc2626; border-radius: 2px; transition: width .5s ease; }
.app-dark .arpp__progress-fill { background: #ef4444; }
.arpp__progress-val  { font-size: .63rem; color: var(--text-muted); min-width: 26px; text-align: right; }
</style>

