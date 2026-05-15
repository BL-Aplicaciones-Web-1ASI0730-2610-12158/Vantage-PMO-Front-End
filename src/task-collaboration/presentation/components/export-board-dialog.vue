<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
defineProps({ visible: { type: Boolean, default: false }, board: { type: Object, default: null } });
const emit = defineEmits(['update:visible', 'export']);

const selectedFormat = ref('PDF');
const formats = ['PDF', 'CSV', 'Excel'];
const dateFrom = ref('');
const dateTo   = ref('');
const config   = ref({ taskList: true, progress: true, members: true, companyLogo: true });

function close() { emit('update:visible', false); }
function doExport() {
    emit('export', { format: selectedFormat.value, dateFrom: dateFrom.value, dateTo: dateTo.value, config: { ...config.value } });
    close();
}

const recent = [
    { name: 'Board_Q3_Export.pdf',    icon: 'pi-file-pdf',   color: '#ef4444', size: '2.1 MB', date: 'Yesterday at 2:10 PM' },
    { name: 'Sprint_Tasks_Oct.xlsx',  icon: 'pi-file-excel', color: '#22c55e', size: '0.8 MB', date: 'Oct 21 at 9:00 AM'    },
];
</script>

<template>
  <pv-dialog :visible="visible" @update:visible="emit('update:visible', $event)"
      modal :header="null"
      :style="{ width: '780px', maxWidth: '95vw', padding: 0 }"
      :pt="{ content: { style: 'padding:0' }, header: { style: 'display:none' } }">
    <div class="exp-wrap">

      <!-- LEFT -->
      <div class="exp-left">
        <div class="exp-icon"><i class="pi pi-table" /></div>
        <h2 class="exp-title">{{ t('taskCollaboration.export.title') }}</h2>
        <p class="exp-desc">{{ t('taskCollaboration.export.desc') }}</p>
        <ul class="exp-feats">
          <li><i class="pi pi-check-circle" />{{ t('taskCollaboration.export.feat1') }}</li>
          <li><i class="pi pi-check-circle" />{{ t('taskCollaboration.export.feat2') }}</li>
          <li><i class="pi pi-check-circle" />{{ t('taskCollaboration.export.feat3') }}</li>
        </ul>
        <div class="exp-recent mt-auto">
          <span class="exp-rlabel">{{ t('taskCollaboration.export.recentActivity') }}</span>
          <div v-for="f in recent" :key="f.name" class="exp-ritem">
            <i :class="['pi', f.icon]" :style="{ color: f.color, fontSize: '1.2rem' }" />
            <div class="exp-rmeta">
              <span class="exp-rname">{{ f.name }}</span>
              <span class="exp-rinfo">{{ f.date }} · {{ f.size }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT -->
      <div class="exp-right">
        <button class="exp-close" @click="close"><i class="pi pi-times" /></button>

        <div class="exp-sec">
          <span class="exp-label">{{ t('taskCollaboration.export.fileFormat') }}</span>
          <div class="exp-fmts">
            <div v-for="fmt in formats" :key="fmt"
                 :class="['exp-fmt', { 'exp-fmt--on': selectedFormat === fmt }]"
                 @click="selectedFormat = fmt">
              <i :class="['pi', fmt === 'PDF' ? 'pi-file-pdf' : fmt === 'CSV' ? 'pi-file' : 'pi-file-excel']" />
              <span>{{ fmt }}</span>
            </div>
          </div>
        </div>

        <div class="exp-sec">
          <span class="exp-label">{{ t('taskCollaboration.export.period') }}</span>
          <div class="exp-dates">
            <div class="exp-df"><i class="pi pi-calendar" /><input type="date" v-model="dateFrom" class="exp-di" /></div>
            <span class="exp-sep">to</span>
            <div class="exp-df"><i class="pi pi-calendar" /><input type="date" v-model="dateTo" class="exp-di" /></div>
          </div>
        </div>

        <div class="exp-sec">
          <span class="exp-label">{{ t('taskCollaboration.export.configurations') }}</span>
          <div class="exp-configs">
            <div v-for="(_, key) in config" :key="key" class="exp-cfg">
              <div>
                <span class="exp-cname">{{ t(`taskCollaboration.export.config.${key}`) }}</span>
                <span class="exp-cdesc">{{ t(`taskCollaboration.export.configDesc.${key}`) }}</span>
              </div>
              <pv-select-button v-model="config[key]" :options="[true,false]" :optionLabel="v => v ? 'ON' : 'OFF'" />
            </div>
          </div>
        </div>

        <div class="exp-actions">
          <pv-button :label="t('taskCollaboration.export.cancel')" text @click="close" />
          <pv-button :label="t('taskCollaboration.export.download')" icon="pi pi-download" @click="doExport" class="exp-dl" />
        </div>
      </div>
    </div>
  </pv-dialog>
</template>

<style scoped>
.exp-wrap { display: flex; min-height: 500px; }
.exp-left {
  width: 230px; flex-shrink: 0; background: #1e293b; color: #fff;
  padding: 1.75rem 1.25rem; display: flex; flex-direction: column; gap: .85rem;
  border-radius: 0 0 0 8px;
}
.exp-icon { width: 44px; height: 44px; background: #3b82f6; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; }
.exp-title { font-size: 1rem; font-weight: 700; margin: 0; line-height: 1.3; }
.exp-desc  { font-size: .8rem; color: #94a3b8; margin: 0; line-height: 1.5; }
.exp-feats { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: .4rem; }
.exp-feats li { display: flex; align-items: center; gap: .45rem; font-size: .78rem; color: #cbd5e1; }
.exp-feats .pi { color: #22d3ee; font-size: .78rem; }
.exp-recent { margin-top: auto; }
.exp-rlabel { font-size: .62rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #64748b; display: block; margin-bottom: .5rem; }
.exp-ritem  { display: flex; align-items: center; gap: .5rem; margin-bottom: .5rem; }
.exp-rmeta  { flex: 1; overflow: hidden; }
.exp-rname  { display: block; font-size: .73rem; font-weight: 600; color: #e2e8f0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.exp-rinfo  { display: block; font-size: .66rem; color: #64748b; }
.exp-right {
  flex: 1; padding: 1.75rem; display: flex; flex-direction: column; gap: 1.25rem;
  position: relative; background: #fff; border-radius: 0 8px 8px 0;
}
.exp-close { position: absolute; top: 1rem; right: 1rem; background: none; border: none; cursor: pointer; color: #9ca3af; font-size: 1rem; border-radius: 4px; padding: .25rem; }
.exp-close:hover { background: #f3f4f6; }
.exp-sec { display: flex; flex-direction: column; gap: .5rem; }
.exp-label { font-size: .68rem; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: #374151; }
.exp-fmts { display: flex; gap: .6rem; }
.exp-fmt { flex: 1; border: 2px solid #e5e7eb; border-radius: 8px; padding: .75rem .4rem; display: flex; flex-direction: column; align-items: center; gap: .35rem; cursor: pointer; font-size: .8rem; font-weight: 600; color: #374151; transition: all .15s; }
.exp-fmt .pi { font-size: 1.3rem; color: #94a3b8; }
.exp-fmt:hover { border-color: #93c5fd; background: #eff6ff; }
.exp-fmt--on  { border-color: #3b82f6 !important; background: #eff6ff !important; }
.exp-fmt--on .pi { color: #3b82f6 !important; }
.exp-dates { display: flex; align-items: center; gap: .6rem; }
.exp-df { flex: 1; display: flex; align-items: center; gap: .4rem; border: 1px solid #e5e7eb; border-radius: 7px; padding: .4rem .65rem; background: #f9fafb; }
.exp-df .pi { color: #6b7280; font-size: .82rem; }
.exp-di { border: none; background: transparent; outline: none; font-size: .82rem; color: #374151; width: 100%; }
.exp-sep { font-size: .8rem; color: #9ca3af; }
.exp-configs { display: flex; flex-direction: column; gap: .4rem; }
.exp-cfg { display: flex; align-items: center; justify-content: space-between; background: #f9fafb; border-radius: 7px; padding: .55rem .9rem; }
.exp-cname { display: block; font-size: .82rem; font-weight: 600; color: #111827; }
.exp-cdesc { display: block; font-size: .72rem; color: #6b7280; }
.exp-actions { display: flex; justify-content: flex-end; gap: .65rem; margin-top: auto; }
.exp-dl { background: #1e40af !important; border-color: #1e40af !important; font-weight: 700; }
</style>
