<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  visible: { type: Boolean, default: false },
  meeting: { type: Object, default: null }
});

const emit = defineEmits(['update:visible', 'export']);

const selectedFormat = ref('PDF');
const formats = ['PDF', 'CSV', 'Excel'];

const dateFrom = ref('');
const dateTo   = ref('');

const config = ref({
  attendees:    true,
  agenda:       true,
  minutes:      true,
  agreements:   true,
  companyLogo:  true
});

function close() {
  emit('update:visible', false);
}

function doExport() {
  emit('export', {
    format:  selectedFormat.value,
    dateFrom: dateFrom.value,
    dateTo:   dateTo.value,
    config:   { ...config.value }
  });
  close();
}

// recent activity items (static mock)
const recentFiles = [
  { name: 'Q3_Stakeholder_Review.pdf',    icon: 'pi-file-pdf',  iconColor: '#ef4444', size: '4.2 MB',  date: 'Yesterday at 4:30 PM' },
  { name: 'Sprint_Retro_Oct_Notes.docx',  icon: 'pi-file-word', iconColor: '#3b82f6', size: '0.9 MB',  date: 'Oct 22 at 10:00 AM'   }
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
        <div class="exp-left-icon"><i class="pi pi-file-export" /></div>
        <h2 class="exp-left-title">{{ t('meetings.export.title') }}</h2>
        <p class="exp-left-desc">{{ t('meetings.export.desc') }}</p>

        <ul class="exp-left-features">
          <li><i class="pi pi-check-circle" /> {{ t('meetings.export.feat1') }}</li>
          <li><i class="pi pi-check-circle" /> {{ t('meetings.export.feat2') }}</li>
          <li><i class="pi pi-check-circle" /> {{ t('meetings.export.feat3') }}</li>
        </ul>

        <!-- Recent activity -->
        <div class="exp-recent">
          <span class="exp-recent-label">{{ t('meetings.export.recentActivity') }}</span>
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
          <span class="exp-section-label">{{ t('meetings.export.fileFormat') }}</span>
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
          <span class="exp-section-label">{{ t('meetings.export.period') }}</span>
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
          <span class="exp-section-label">{{ t('meetings.export.configurations') }}</span>
          <div class="exp-config-grid">
            <div class="exp-config-item" v-for="(_, key) in config" :key="key">
              <div class="exp-config-info">
                <span class="exp-config-name">{{ t(`meetings.export.config.${key}`) }}</span>
                <span class="exp-config-desc">{{ t(`meetings.export.configDesc.${key}`) }}</span>
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
          <pv-button :label="t('meetings.export.cancel')" text @click="close" />
          <pv-button
              :label="t('meetings.export.download')"
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
.exp-wrap {
  display: flex;
  min-height: 520px;
}

/* ── LEFT ── */
.exp-left {
  width: 240px;
  flex-shrink: 0;
  background: #1e293b;
  color: #fff;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 0 0 0 8px;
}
.exp-left-icon {
  width: 48px; height: 48px;
  background: #3b82f6;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem;
}
.exp-left-title { font-size: 1.15rem; font-weight: 700; margin: 0; line-height: 1.3; }
.exp-left-desc  { font-size: .82rem; color: #94a3b8; margin: 0; line-height: 1.5; }

.exp-left-features { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: .5rem; }
.exp-left-features li { display: flex; align-items: center; gap: .5rem; font-size: .8rem; color: #cbd5e1; }
.exp-left-features .pi { color: #22d3ee; font-size: .8rem; }

.exp-recent { margin-top: auto; }
.exp-recent-label { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #64748b; display: block; margin-bottom: .6rem; }
.exp-recent-item { display: flex; align-items: center; gap: .6rem; margin-bottom: .6rem; }
.exp-recent-meta { flex: 1; overflow: hidden; }
.exp-recent-name { display: block; font-size: .75rem; font-weight: 600; color: #e2e8f0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.exp-recent-info { display: block; font-size: .68rem; color: #64748b; }
.exp-recent-more { color: #475569; cursor: pointer; font-size: .8rem; }

/* ── RIGHT ── */
.exp-right {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  background: #fff;
  border-radius: 0 8px 8px 0;
}
.exp-close-btn {
  position: absolute; top: 1rem; right: 1rem;
  background: none; border: none; cursor: pointer;
  color: #9ca3af; font-size: 1rem; padding: .25rem;
  border-radius: 4px;
}
.exp-close-btn:hover { background: #f3f4f6; color: #374151; }

.exp-section { display: flex; flex-direction: column; gap: .6rem; }
.exp-section-label { font-size: .7rem; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: #374151; }

/* Formats */
.exp-formats { display: flex; gap: .75rem; }
.exp-fmt-card {
  flex: 1; border: 2px solid #e5e7eb; border-radius: 10px;
  padding: .9rem .5rem; display: flex; flex-direction: column;
  align-items: center; gap: .4rem; cursor: pointer;
  font-size: .82rem; font-weight: 600; color: #374151;
  transition: all .15s;
}
.exp-fmt-card .pi { font-size: 1.4rem; color: #94a3b8; }
.exp-fmt-card:hover { border-color: #93c5fd; background: #eff6ff; }
.exp-fmt-active { border-color: #3b82f6 !important; background: #eff6ff !important; }
.exp-fmt-active .pi { color: #3b82f6 !important; }

/* Dates */
.exp-dates { display: flex; align-items: center; gap: .75rem; }
.exp-date-field {
  flex: 1; display: flex; align-items: center; gap: .5rem;
  border: 1px solid #e5e7eb; border-radius: 8px; padding: .5rem .75rem;
  background: #f9fafb;
}
.exp-date-field .pi { color: #6b7280; font-size: .85rem; }
.exp-date-input { border: none; background: transparent; outline: none; font-size: .85rem; color: #374151; width: 100%; }
.exp-date-sep { font-size: .82rem; color: #9ca3af; }

/* Config grid */
.exp-config-grid { display: flex; flex-direction: column; gap: .5rem; }
.exp-config-item {
  display: flex; align-items: center; justify-content: space-between;
  background: #f9fafb; border-radius: 8px;
  padding: .65rem 1rem;
}
.exp-config-info { flex: 1; }
.exp-config-name { display: block; font-size: .85rem; font-weight: 600; color: #111827; }
.exp-config-desc { display: block; font-size: .75rem; color: #6b7280; }
.exp-toggle { flex-shrink: 0; }

/* Actions */
.exp-actions { display: flex; justify-content: flex-end; gap: .75rem; margin-top: auto; }
.exp-download-btn { background: #1e40af !important; border-color: #1e40af !important; font-weight: 700; }
</style>
