<script setup>
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps({ visible: { type: Boolean, default: false } });
const emit = defineEmits(['update:visible', 'create']);

const STATUSES  = ['To Do', 'In Progress', 'Review', 'To Fix', 'Done'];
const PRIORITIES = [
    { label: 'URGENT',  color: '#ef4444' },
    { label: 'MEDIUM',  color: '#f59e0b' },
    { label: 'LOW',     color: '#22c55e' },
    { label: 'NORMAL',  color: '#6b7280' },
];

const form = reactive({
    project:       '',
    title:         '',
    description:   '',
    assignee:      '',
    assigneeAvatar:'',
    assigneeColor: '#6b7280',
    status:        'To Do',
    priority:      'NORMAL',
    priorityColor: '#6b7280',
    dueDate:       '',
    completed:     false,
    comments:      0,
    attachments:   0,
    progress:      0,
});

function selectPriority(p) {
    form.priority      = p.label;
    form.priorityColor = p.color;
}

function close()  { emit('update:visible', false); }
function submit() {
    if (!form.title.trim()) return;
    emit('create', { ...form });
    Object.assign(form, {
        project:'', title:'', description:'', assignee:'',
        assigneeAvatar:'', assigneeColor:'#6b7280',
        status:'To Do', priority:'NORMAL', priorityColor:'#6b7280',
        dueDate:'', completed:false, comments:0, attachments:0, progress:0,
    });
    close();
}
</script>

<template>
  <pv-dialog
      :visible="visible"
      @update:visible="emit('update:visible', $event)"
      modal :closable="true"
      :header="t('taskCollaboration.addTask.title')"
      :style="{ width: '520px' }"
  >
    <div class="at-form">

      <div class="at-field">
        <label>{{ t('taskCollaboration.addTask.project') }}</label>
        <pv-input-text v-model="form.project" :placeholder="'e.g. PROJECT::HORIZON'" class="w-full" />
      </div>

      <div class="at-field">
        <label>{{ t('taskCollaboration.addTask.taskTitle') }} *</label>
        <pv-input-text v-model="form.title" :placeholder="t('taskCollaboration.addTask.titlePlaceholder')" class="w-full" />
      </div>

      <div class="at-field">
        <label>{{ t('taskCollaboration.addTask.description') }}</label>
        <pv-textarea v-model="form.description" rows="3" class="w-full" :placeholder="t('taskCollaboration.addTask.descPlaceholder')" />
      </div>

      <div class="at-row">
        <div class="at-field at-half">
          <label>{{ t('taskCollaboration.addTask.assignee') }}</label>
          <pv-input-text v-model="form.assignee" placeholder="e.g. Sarah Jenkins" class="w-full"
              @input="form.assigneeAvatar = form.assignee.substring(0,2).toUpperCase()" />
        </div>
        <div class="at-field at-half">
          <label>{{ t('taskCollaboration.addTask.status') }}</label>
          <pv-select v-model="form.status" :options="STATUSES" class="w-full" />
        </div>
      </div>

      <div class="at-field">
        <label>{{ t('taskCollaboration.addTask.priority') }}</label>
        <div class="at-priority-row">
          <div
              v-for="p in PRIORITIES" :key="p.label"
              :class="['at-priority-chip', { 'at-priority-active': form.priority === p.label }]"
              :style="{ borderColor: p.color, color: form.priority === p.label ? '#fff' : p.color,
                        background: form.priority === p.label ? p.color : 'transparent' }"
              @click="selectPriority(p)"
          >{{ p.label }}</div>
        </div>
      </div>

      <div class="at-row">
        <div class="at-field at-half">
          <label>{{ t('taskCollaboration.addTask.dueDate') }}</label>
          <input type="date" v-model="form.dueDate" class="at-date-input" />
        </div>
        <div class="at-field at-half">
          <label>{{ t('taskCollaboration.addTask.progress') }} ({{ form.progress }}%)</label>
          <input type="range" v-model.number="form.progress" min="0" max="100" class="at-range" />
        </div>
      </div>

    </div>

    <template #footer>
      <pv-button :label="t('taskCollaboration.addTask.cancel')" text @click="close" />
      <pv-button :label="t('taskCollaboration.addTask.create')" icon="pi pi-plus" @click="submit" />
    </template>
  </pv-dialog>
</template>

<style scoped>
.at-form { display: flex; flex-direction: column; gap: 1rem; padding: .25rem 0; }
.at-field { display: flex; flex-direction: column; gap: .35rem; }
.at-field label { font-size: .8rem; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: .04em; }
.at-row  { display: flex; gap: 1rem; }
.at-half { flex: 1; }
.at-priority-row { display: flex; gap: .5rem; flex-wrap: wrap; }
.at-priority-chip {
  border: 1.5px solid; border-radius: 99px;
  padding: 3px 12px; font-size: .75rem; font-weight: 700;
  cursor: pointer; transition: all .15s;
}
.at-date-input {
  border: 1px solid #e5e7eb; border-radius: 8px;
  padding: .45rem .75rem; font-size: .9rem; color: #374151;
  outline: none; width: 100%;
}
.at-range { width: 100%; accent-color: #3b82f6; }
</style>
