<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSupportStore } from '../../application/support.store.js';

const { t } = useI18n();
const store = useSupportStore();

onMounted(() => store.fetchTickets());

const showDialog = ref(false);
const form = ref({ title: '', description: '', category: 'Bug', priority: 'Medium' });

const categoryOptions = ['Bug', 'Feature Request', 'Performance', 'Other'];
const priorityOptions = ['Low', 'Medium', 'High'];

function prioritySeverity(priority) {
    const map = { High: 'danger', Medium: 'warn', Low: 'info' };
    return map[priority] ?? 'secondary';
}

function statusSeverity(status) {
    const map = { Open: 'warn', 'In Progress': 'info', Resolved: 'success' };
    return map[status] ?? 'secondary';
}

async function submitTicket() {
    if (!form.value.title.trim()) return;
    await store.submitTicket({ ...form.value });
    form.value = { title: '', description: '', category: 'Bug', priority: 'Medium' };
    showDialog.value = false;
}
</script>

<template>
  <div class="support-page">
    <div class="support-header">
      <div>
        <h1 class="support-title">{{ t('support.title') }}</h1>
        <p class="support-subtitle">{{ t('support.subtitle') }}</p>
      </div>
      <pv-button
          :label="t('support.newTicket')"
          icon="pi pi-plus"
          @click="showDialog = true"
      />
    </div>

    <div v-if="store.loading" class="loading-state">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem;" />
    </div>

    <div v-else>
      <div class="stats-row">
        <div class="stat-card">
          <span>{{ t('support.open') }}</span>
          <h2>{{ store.openTickets.length }}</h2>
        </div>
        <div class="stat-card">
          <span>{{ t('support.inProgress') }}</span>
          <h2>{{ store.inProgressTickets.length }}</h2>
        </div>
        <div class="stat-card">
          <span>{{ t('support.resolved') }}</span>
          <h2>{{ store.resolvedTickets.length }}</h2>
        </div>
      </div>

      <pv-data-table :value="store.tickets" stripedRows responsive-layout="scroll">
        <pv-column field="id" header="#" style="width: 60px" />
        <pv-column field="title" :header="t('support.columns.title')" />
        <pv-column field="category" :header="t('support.columns.category')" />
        <pv-column field="priority" :header="t('support.columns.priority')">
          <template #body="{ data }">
            <pv-tag :value="data.priority" :severity="prioritySeverity(data.priority)" />
          </template>
        </pv-column>
        <pv-column field="status" :header="t('support.columns.status')">
          <template #body="{ data }">
            <pv-tag :value="data.status" :severity="statusSeverity(data.status)" />
          </template>
        </pv-column>
        <pv-column field="assignee" :header="t('support.columns.assignee')" />
        <pv-column field="createdAt" :header="t('support.columns.createdAt')" />
      </pv-data-table>
    </div>

    <!-- New Ticket Dialog -->
    <pv-dialog
        v-model:visible="showDialog"
        :header="t('support.newTicket')"
        :modal="true"
        style="width: 500px"
    >
      <div class="form-group">
        <label>{{ t('support.form.title') }}</label>
        <pv-input-text v-model="form.title" class="w-full" />
      </div>
      <div class="form-group">
        <label>{{ t('support.form.description') }}</label>
        <pv-textarea v-model="form.description" rows="4" class="w-full" />
      </div>
      <div class="form-group">
        <label>{{ t('support.form.category') }}</label>
        <pv-select v-model="form.category" :options="categoryOptions" class="w-full" />
      </div>
      <div class="form-group">
        <label>{{ t('support.form.priority') }}</label>
        <pv-select v-model="form.priority" :options="priorityOptions" class="w-full" />
      </div>
      <template #footer>
        <pv-button :label="t('support.form.cancel')" severity="secondary" @click="showDialog = false" />
        <pv-button :label="t('support.form.submit')" @click="submitTicket" />
      </template>
    </pv-dialog>
  </div>
</template>

<style scoped>
.support-page { padding: 2rem; }
.support-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}
.support-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--p-primary-color, #3b82f6);
  margin: 0 0 0.5rem;
}
.support-subtitle { color: #6b7280; margin: 0; }
.loading-state { display: flex; justify-content: center; padding: 3rem; }
.stats-row { display: flex; gap: 1.5rem; margin-bottom: 2rem; flex-wrap: wrap; }
.stat-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem 2rem;
  min-width: 150px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.stat-card span { font-size: 0.8rem; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
.stat-card h2 { font-size: 2rem; font-weight: 700; margin: 0.25rem 0 0; color: #111827; }
.form-group { margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
.form-group label { font-weight: 600; color: #374151; }
</style>
