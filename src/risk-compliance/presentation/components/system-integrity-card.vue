<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
defineProps({ alerts: { type: Array, required: true } });
const severityClass = sev => ({ CRITICAL:'si-alert--critical', HIGH:'si-alert--high', MEDIUM:'si-alert--medium', LOW:'si-alert--low' }[sev] ?? 'si-alert--low');
const severityIcon  = sev => ({ CRITICAL:'pi-times-circle', HIGH:'pi-exclamation-triangle', MEDIUM:'pi-info-circle', LOW:'pi-check-circle' }[sev] ?? 'pi-info-circle');
</script>

<template>
  <div class="si">
    <div class="si__header">
      <span class="si__title">{{ t('riskCompliance.systemIntegrity.title') }}</span>
      <button class="si__view-all">{{ t('riskCompliance.systemIntegrity.viewAll') }}</button>
    </div>
    <ul class="si__list">
      <li v-for="alert in alerts" :key="alert.id" :class="['si-alert', severityClass(alert.severity)]">
        <div class="si-alert__icon-wrap">
          <i :class="['pi', severityIcon(alert.severity), 'si-alert__icon']" />
        </div>
        <div class="si-alert__body">
          <div class="si-alert__row">
            <span class="si-alert__code">{{ alert.code }}</span>
            <span class="si-alert__time">{{ alert.time }}</span>
          </div>
          <p class="si-alert__title">{{ alert.title }}</p>
          <p class="si-alert__desc">{{ alert.description }}</p>
        </div>
      </li>
      <li v-if="!alerts.length" class="si__empty">{{ t('riskCompliance.systemIntegrity.noAlerts') }}</li>
    </ul>
  </div>
</template>

<style scoped>
.si { display: flex; flex-direction: column; gap: .75rem; }
.si__header { display: flex; justify-content: space-between; align-items: center; }
.si__title  { font-size: .68rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--text-secondary); }
.si__view-all { background: none; border: none; cursor: pointer; font-size: .68rem; color: #2563eb; padding: 0; }
.si__view-all:hover { text-decoration: underline; }
.app-dark .si__view-all { color: #60a5fa; }

.si__list  { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .5rem; }
.si__empty { font-size: .8rem; color: var(--text-secondary); text-align: center; padding: .5rem; }

.si-alert {
  display: flex; gap: .6rem; padding: .6rem .7rem;
  border-radius: 8px; border-left: 3px solid transparent;
  background: var(--hover-bg);
}
.si-alert--critical { border-left-color: #dc2626; }
.si-alert--high     { border-left-color: #ea580c; }
.si-alert--medium   { border-left-color: #d97706; }
.si-alert--low      { border-left-color: #16a34a; }

.si-alert__icon-wrap { padding-top: 2px; flex-shrink: 0; }
.si-alert__icon { font-size: .85rem; }
.si-alert--critical .si-alert__icon { color: #dc2626; }
.si-alert--high     .si-alert__icon { color: #ea580c; }
.si-alert--medium   .si-alert__icon { color: #d97706; }
.si-alert--low      .si-alert__icon { color: #16a34a; }

.si-alert__body  { flex: 1; min-width: 0; }
.si-alert__row   { display: flex; justify-content: space-between; margin-bottom: 2px; }
.si-alert__code  { font-size: .63rem; font-weight: 700; color: var(--text-muted); letter-spacing: .06em; }
.si-alert__time  { font-size: .63rem; color: var(--text-muted); }
.si-alert__title { margin: 0 0 3px; font-size: .77rem; font-weight: 600; color: var(--text-primary); }
.si-alert__desc  { margin: 0; font-size: .68rem; color: var(--text-secondary); line-height: 1.4; }
</style>
