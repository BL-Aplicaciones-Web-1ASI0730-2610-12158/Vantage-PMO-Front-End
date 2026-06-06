<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  visible: { type: Boolean, default: false },
  report:  { type: Object, default: null }
});

const emit = defineEmits(['update:visible', 'export']);

const selectedFormat = ref('PDF');
const formats = ['PDF', 'CSV', 'Excel'];

const dateFrom = ref('');
const dateTo   = ref('');

const config = ref({
  teamPerformance:  true,
  taskProgress:     true,
  financialSummary: false,
  riskAssessment:   true,
  companyLogo:      true
});

function close() {
  emit('update:visible', false);
}

function doExport() {
  emit('export', {
    format:   selectedFormat.value,
    dateFrom: dateFrom.value,
    dateTo:   dateTo.value,
    config:   { ...config.value },
    report:   props.report
  });
  close();
}

const recentFiles = [
  { name: 'Q3_Stakeholder_Review.pdf',  icon: 'pi-file-pdf',   iconColor: '#ef4444', size: '4.2 MB', date: 'Yesterday at 4:30 PM' },
  { name: 'Velocity_Metrics_Oct.xlsx',  icon: 'pi-file-excel', iconColor: '#22c55e', size: '1.1 MB', date: 'Oct 24 at 11:15 AM'   }
];
</script>

<template>
  <pv-dialog
      :visible="visible"
      @update:visible="emit('update:visible', $event)"
      modal
      :closable="true"
      :header="null"
      :style="{ width: '820px', maxWidth: '95vw', padding: 0 }"
      :pt="{ content: { style: 'padding:0' }, header: { style: 'display:none' } }"
  >
    <div class="exp-wrap">

      <!-- ── LEFT ── -->
      <div class="exp-left">
        <div class="exp-left-icon"><i class="pi pi-chart-bar" /></div>
        <h2 class="exp-left-title">{{ t('reports.export.title') }}</h2>
        <p class="exp-left-desc">{{ t('reports.export.desc') }}</p>

        <ul class="exp-left-features">
          <li><i class="pi pi-check-circle" /> {{ t('reports.export.feat1') }}</li>
          <li><i class="pi pi-check-circle" /> {{ t('reports.export.feat2') }}</li>
          <li><i class="pi pi-check-circle" /> {{ t('reports.export.feat3') }}</li>
        </ul>

        <div class="exp-promo">
          <i class="pi pi-bolt exp-promo-icon" />
          <div>
            <strong>{{ t('reports.export.automateTitle') }}</strong>
            <p>{{ t('reports.export.automateDesc') }}</p>
            <pv-button :label="t('reports.export.setupAutomation')" size="small" text class="exp-promo-btn" />
          </div>
        </div>

        <div class="exp-recent">
          <span class="exp-recent-label">{{ t('reports.export.recentActivity') }}</span>
          <div v-for="f in recentFiles" :key="f.name" class="exp-recent-item">
            <i :class="['pi', f.icon]" :style="{ color: f.iconColor, fontSize: '1.3rem' }" />
            <div class="exp-recent-meta">
              <span class="exp-recent-name">{{ f.name }}</span>
              <span class="exp-recent-info">{{ f.date }} · {{ f.size }}</span>
            </div>
            <i class="pi pi-ellipsis-v exp-recent-more" />
          </div>
        </div>
      </div>

      <!-- ── RIGHT ── -->
      <div class="exp-right">
        <button class="exp-close-btn" @click="close"><i class="pi pi-times" /></button>

        <!-- Format -->
        <div class="exp-section">
          <span class="exp-section-label">{{ t('reports.export.fileFormat') }}</span>
          <div class="exp-formats">
            <div
                v-for="fmt in formats"
                :key="fmt"
                :class="['exp-fmt-card', { 'exp-fmt-active': selectedFormat === fmt }]"
                @click="selectedFormat = fmt"
            >
              <i :class="['pi', fmt === 'PDF' ? 'pi-file-pdf' : fmt === 'CSV' ? 'pi-file' : 'pi-file-excel']" />
              <span>{{ fmt }}</span>
            </div>
          </div>
        </div>

        <!-- Period -->
        <div class="exp-section">
          <span class="exp-section-label">{{ t('reports.export.period') }}</span>
          <div class="exp-dates">
            <div class="exp-date-field">
              <i class="pi pi-calendar" />
              <input type="date" v-model="dateFrom" class="exp-date-input" />
            </div>
            <span class="exp-date-sep">to</span>
            <div class="exp-date-field">
              <i class="pi pi-calendar" />
              <input type="date" v-model="dateTo" class="exp-date-input" />
            </div>
          </div>
        </div>

        <!-- Configurations -->
        <div class="exp-section">
          <span class="exp-section-label">{{ t('reports.export.configurations') }}</span>
          <div class="exp-config-grid">
            <div class="exp-config-item" v-for="(_, key) in config" :key="key">
              <div class="exp-config-info">
                <span class="exp-config-name">{{ t(`reports.export.config.${key}`) }}</span>
                <span class="exp-config-desc">{{ t(`reports.export.configDesc.${key}`) }}</span>
              </div>
              <pv-select-button
                  v-model="config[key]"
                  :options="[true, false]"
                  :optionLabel="v => v ? 'ON' : 'OFF'"
                  class="exp-toggle"
              />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="exp-actions">
          <pv-button :label="t('reports.export.cancel')" text @click="close" />
          <pv-button
              :label="t('reports.export.download')"
              icon="pi pi-download"
              @click="doExport"
              class="exp-download-btn"
          />
        </div>
      </div>

    </div>
  </pv-dialog>
</template>

<style scoped>
.exp-wrap { display: flex; min-height: 560px; }

/* ── LEFT ── */
.exp-left {
  width: 260px; flex-shrink: 0;
  background: #1e293b; color: #fff;
  padding: 2rem 1.5rem;
  display: flex; flex-direction: column; gap: 1rem;
  border-radius: 0 0 0 8px;
}
.exp-left-icon {
  width: 48px; height: 48px; background: #3b82f6; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; font-size: 1.4rem;
}
.exp-left-title { font-size: 1.1rem; font-weight: 700; margin: 0; line-height: 1.3; }
.exp-left-desc  { font-size: .82rem; color: #94a3b8; margin: 0; line-height: 1.5; }
.exp-left-features { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: .45rem; }
.exp-left-features li { display: flex; align-items: center; gap: .5rem; font-size: .8rem; color: #cbd5e1; }
.exp-left-features .pi { color: #22d3ee; font-size: .8rem; }

.exp-promo {
  background: #2563eb; border-radius: 10px; padding: 1rem;
  display: flex; gap: .75rem; align-items: flex-start;
}
.exp-promo-icon { font-size: 1.2rem; color: #fbbf24; margin-top: .1rem; flex-shrink: 0; }
.exp-promo strong { font-size: .82rem; display: block; margin-bottom: .25rem; }
.exp-promo p { font-size: .75rem; color: #bfdbfe; margin: 0 0 .4rem; line-height: 1.4; }
.exp-promo-btn { padding: 0 !important; color: #fbbf24 !important; font-size: .75rem !important; }

.exp-recent { margin-top: auto; }
.exp-recent-label { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #64748b; display: block; margin-bottom: .6rem; }
.exp-recent-item  { display: flex; align-items: center; gap: .6rem; margin-bottom: .6rem; }
.exp-recent-meta  { flex: 1; overflow: hidden; }
.exp-recent-name  { display: block; font-size: .75rem; font-weight: 600; color: #e2e8f0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.exp-recent-info  { display: block; font-size: .68rem; color: #64748b; }
.exp-recent-more  { color: #475569; cursor: pointer; font-size: .8rem; }

/* ── RIGHT ── */
.exp-right {
  flex: 1; padding: 2rem;
  display: flex; flex-direction: column; gap: 1.4rem;
  position: relative; background: #fff;
  border-radius: 0 8px 8px 0;
}
.exp-close-btn {
  position: absolute; top: 1rem; right: 1rem;
  background: none; border: none; cursor: pointer;
  color: #9ca3af; font-size: 1rem; padding: .25rem; border-radius: 4px;
}
.exp-close-btn:hover { background: #f3f4f6; color: #374151; }

.exp-section { display: flex; flex-direction: column; gap: .6rem; }
.exp-section-label { font-size: .7rem; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: #374151; }

.exp-formats { display: flex; gap: .75rem; }
.exp-fmt-card {
  flex: 1; border: 2px solid #e5e7eb; border-radius: 10px;
  padding: .9rem .5rem; display: flex; flex-direction: column;
  align-items: center; gap: .4rem; cursor: pointer;
  font-size: .82rem; font-weight: 600; color: #374151; transition: all .15s;
}
.exp-fmt-card .pi { font-size: 1.4rem; color: #94a3b8; }
.exp-fmt-card:hover { border-color: #93c5fd; background: #eff6ff; }
.exp-fmt-active { border-color: #3b82f6 !important; background: #eff6ff !important; }
.exp-fmt-active .pi { color: #3b82f6 !important; }

.exp-dates { display: flex; align-items: center; gap: .75rem; }
.exp-date-field {
  flex: 1; display: flex; align-items: center; gap: .5rem;
  border: 1px solid #e5e7eb; border-radius: 8px; padding: .5rem .75rem; background: #f9fafb;
}
.exp-date-field .pi { color: #6b7280; font-size: .85rem; }
.exp-date-input { border: none; background: transparent; outline: none; font-size: .85rem; color: #374151; width: 100%; }
.exp-date-sep { font-size: .82rem; color: #9ca3af; }

.exp-config-grid { display: flex; flex-direction: column; gap: .45rem; }
.exp-config-item {
  display: flex; align-items: center; justify-content: space-between;
  background: #f9fafb; border-radius: 8px; padding: .6rem 1rem;
}
.exp-config-info { flex: 1; }
.exp-config-name { display: block; font-size: .84rem; font-weight: 600; color: #111827; }
.exp-config-desc { display: block; font-size: .74rem; color: #6b7280; }
.exp-toggle { flex-shrink: 0; }

.exp-actions { display: flex; justify-content: flex-end; gap: .75rem; margin-top: auto; }
.exp-download-btn { background: #1e40af !important; border-color: #1e40af !important; font-weight: 700; }
</style>
