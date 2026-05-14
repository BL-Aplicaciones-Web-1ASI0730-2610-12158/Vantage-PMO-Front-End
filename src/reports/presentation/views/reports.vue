<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useReportsStore } from '../../application/reports.store.js';
import ExportReportDialog from '../components/export-report-dialog.vue';

const { t } = useI18n();
const store = useReportsStore();

onMounted(() => store.fetchReports());

const selectedProject   = ref(null);
const showExportDialog  = ref(false);
const exportingReport   = ref(null);

const reports = computed(() => {
  if (!selectedProject.value) return store.reports;

  return store.reports.filter(
      r => r.project === selectedProject.value
  );
});

const projectOptions = computed(() => {
  return [...new Set(store.reports.map(r => r.project))];
});

function openExportDialog(report) {
  exportingReport.value = report;
  showExportDialog.value = true;
}

function onExportDone(payload) {
  alert(t('reports.exportAlert', { project: payload.report?.project ?? '' }) + ` (${payload.format})`);
}

function uploadDocument(event, report) {
  const file = event.files?.[0];

  if (file) {
    alert(
        t('reports.uploadAlert', {
          file: file.name,
          project: report.project
        })
    );
  }
}
</script>

<template>
  <div class="reports-page">

    <div class="reports-header">
      <div>
        <h1 class="reports-title">
          {{ t('reports.title') }}
        </h1>

        <p class="reports-subtitle">
          {{ t('reports.subtitle') }}
        </p>
      </div>

      <pv-select
          v-model="selectedProject"
          :options="projectOptions"
          :placeholder="t('reports.filterProject')"
          class="project-filter"
      />
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <span>{{ t('reports.totalReports') }}</span>
        <h2>{{ reports.length }}</h2>
      </div>

      <div class="stat-card">
        <span>{{ t('reports.automations') }}</span>
        <h2>
          {{
            reports.reduce((acc, r) => acc + r.automations, 0)
          }}
        </h2>
      </div>

      <div class="stat-card">
        <span>{{ t('reports.energyConsumption') }}</span>
        <h2>
          {{
            reports.reduce((acc, r) => acc + r.energyConsumption, 0)
          }} kWh
        </h2>
      </div>
    </div>

    <pv-data-table
        :value="reports"
        responsive-layout="scroll"
        stripedRows
    >

      <pv-column
          field="project"
          :header="t('reports.columns.project')"
      />

      <pv-column
          field="manager"
          :header="t('reports.columns.manager')"
      />

      <pv-column
          field="status"
          :header="t('reports.columns.status')"
      >
        <template #body="slotProps">
          {{ t(`reports.status.${slotProps.data.status}`) }}
        </template>
      </pv-column>

      <pv-column
          field="energyConsumption"
          :header="t('reports.columns.energy')"
      />

      <pv-column
          field="automations"
          :header="t('reports.columns.automations')"
      />

      <pv-column
          field="generatedAt"
          :header="t('reports.columns.generated')"
      />

      <pv-column
          :header="t('reports.columns.attachment')"
      >
        <template #body="slotProps">

          <pv-file-upload
              mode="basic"
              :chooseLabel="t('reports.upload')"
              auto
              customUpload
              @uploader="(e) => uploadDocument(e, slotProps.data)"
          />

        </template>
      </pv-column>

      <pv-column
          :header="t('reports.columns.actions')"
      >
        <template #body="slotProps">

          <pv-button
              :label="t('reports.exportPdf')"
              icon="pi pi-file-export"
              severity="secondary"
              outlined
              @click="openExportDialog(slotProps.data)"
          />

        </template>
      </pv-column>

    </pv-data-table>

  </div>

  <ExportReportDialog
      v-model:visible="showExportDialog"
      :report="exportingReport"
      @export="onExportDone"
  />
</template>

<style scoped>
.reports-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.reports-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reports-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
}

.reports-subtitle {
  color: #64748b;
}

.project-filter {
  width: 250px;
}

.stats-row {
  display: flex;
  gap: 20px;
}

.stat-card {
  flex: 1;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
}

.stat-card span {
  color: #64748b;
  font-size: 13px;
}

.stat-card h2 {
  margin: 10px 0 0;
  font-size: 28px;
}
</style>