<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ProjectStore } from '../../application/project.store.js';

const { t } = useI18n();
const store = ProjectStore();

const props = defineProps({
  visible: Boolean,
  project: Object
});

const emit = defineEmits(['update:visible', 'updated']);

// Local editable copy
const formData = ref({
  id: null,
  name: '',
  category: '',
  description: '',
  startDate: '',
  dueDate: ''
});

const milestones = ref([]);
const newMilestoneName = ref('');
const newMilestoneDate = ref('');
const newMilestoneType = ref('pending');

const teamMembers = ref([]);
const newMemberName = ref('');

const loading = ref(false);
const error = ref(null);

watch(() => props.project, (p) => {
  if (p) {
    formData.value = {
      id: p.id,
      name: p.name || '',
      category: p.category || '',
      description: p.description || '',
      startDate: p.startDate || '',
      dueDate: p.dueDate || ''
    };
    milestones.value = (p.milestones || []).map(m => ({ ...m }));
    teamMembers.value = (p.teamMembers || []).map(tm => ({ ...tm }));
  }
}, { immediate: true });

const addMilestone = () => {
  if (!newMilestoneName.value.trim()) return;
  milestones.value.push({
    id: Date.now(),
    name: newMilestoneName.value,
    date: newMilestoneDate.value || null,
    type: newMilestoneType.value || 'pending'
  });
  newMilestoneName.value = '';
  newMilestoneDate.value = '';
  newMilestoneType.value = 'pending';
};

const removeMilestone = (id) => {
  milestones.value = milestones.value.filter(m => m.id !== id);
};

const toggleMilestoneType = (id) => {
  const idx = milestones.value.findIndex(m => m.id === id);
  if (idx === -1) return;
  const current = milestones.value[idx].type || 'pending';
  const order = ['pending', 'warning', 'success'];
  const next = order[(order.indexOf(current) + 1) % order.length];
  milestones.value[idx].type = next;
};

const calculateProgress = () => {
  if (!milestones.value || milestones.value.length === 0) return props.project.progress || 0;
  const total = milestones.value.length;
  const done = milestones.value.filter(m => (m.type || 'pending') === 'success').length;
  return Math.round((done / total) * 100);
};

const calculateStatus = () => {
  if (!milestones.value || milestones.value.length === 0) return props.project.status || 'healthy';
  const types = milestones.value.map(m => (m.type || 'pending'));
  const allSuccess = types.every(t => t === 'success');
  const allWarning = types.every(t => t === 'warning');
  if (allSuccess) return 'healthy';
  if (allWarning) return 'critical';
  if (types.includes('warning')) return 'at-risk';
  return 'healthy';
};

const addTeamMember = () => {
  if (!newMemberName.value.trim()) return;

  const newMember = {
    id: Date.now(),
    name: newMemberName.value,
    avatar: newMemberName.value.charAt(0).toUpperCase()
  };

  teamMembers.value.push(newMember);
  newMemberName.value = '';
};

const removeTeamMember = (id) => {
  teamMembers.value = teamMembers.value.filter(member => member.id !== id);
};

const handleKeyPressMember = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    addTeamMember();
  }
};

const handleSubmit = async () => {
  if (!formData.value.name || !formData.value.category) {
    error.value = t('projects.form.requiredFields');
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const payload = {
      name: formData.value.name,
      category: formData.value.category,
      description: formData.value.description,
      startDate: formData.value.startDate || null,
      dueDate: formData.value.dueDate || null,
      teamMembers: teamMembers.value,
      milestones: milestones.value,
      status: calculateStatus(),
      progress: calculateProgress(),
      manager: props.project.manager || 'Current User'
    };

    await store.updateProject(formData.value.id, payload);
    emit('updated');
  } catch (err) {
    console.error('Error updating project:', err);
    error.value = t('projects.form.error');
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  emit('update:visible', false);
};
</script>

<template>
  <pv-dialog
    :visible="visible"
    :header="t('projects.form.updateProject')"
    :modal="true"
    class="edit-project-dialog"
    @update:visible="(val) => emit('update:visible', val)"
  >
    <div class="form-content">
      <div v-if="error" class="error-message">
        <i class="pi pi-exclamation-circle"></i>
        <span>{{ error }}</span>
      </div>

      <!-- Progress preview (based on milestones) -->
      <div class="progress-preview">
        <div class="progress-header">
          <span class="label">{{ t('projects.form.progressPreview')}}</span>
          <span class="percentage">{{ calculateProgress() }}%</span>
        </div>
        <pv-progressbar :value="calculateProgress()" :showValue="false" class="preview-bar" />
      </div>

      <div class="form-group">
        <label>{{ t('projects.form.projectName') }}</label>
        <pv-input-text v-model="formData.name" class="w-full" />
      </div>

      <div class="form-group">
        <label>{{ t('projects.form.category') }} *</label>
        <select v-model="formData.category" class="form-select">
          <option value="">{{ t('projects.form.categoryPlaceholder') }}</option>
          <option v-for="cat in ['Infrastructure Modernization','Commercial Real Estate','Logistics Optimization','Digital Transformation','Cloud Migration','Security Enhancement']" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>

      <div class="form-group">
        <label>{{ t('projects.form.description') }}</label>
        <pv-textarea v-model="formData.description" rows="4" class="w-full" />
      </div>

      <!-- Dates Row -->
      <div class="form-row">
        <div class="form-group">
          <label>{{ t('projects.form.startDate') }}</label>
          <input
            v-model="formData.startDate"
            type="date"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label>{{ t('projects.form.dueDate') }}</label>
          <input
            v-model="formData.dueDate"
            type="date"
            class="form-input"
          />
        </div>
      </div>

      <!-- Team Members Section -->
      <div class="form-group">
        <label>{{ t('projects.form.teamMembers') || 'Team Members' }}</label>
        <div class="team-members-input">
          <pv-input-text
            v-model="newMemberName"
            :placeholder="t('projects.form.addMemberPlaceholder') || 'Enter team member name...'"
            class="w-full"
            @keypress="handleKeyPressMember"
          />
          <pv-button
            :label="t('projects.form.addMember') || 'Add'"
            icon="pi pi-plus"
            @click="addTeamMember"
            class="add-member-btn"
          />
        </div>

        <!-- Team Members List -->
        <div v-if="teamMembers.length > 0" class="team-members-list">
          <div v-for="member in teamMembers" :key="member.id" class="team-member-tag">
            <span class="member-avatar">{{ member.avatar }}</span>
            <span class="member-name">{{ member.name }}</span>
            <button
              @click="removeTeamMember(member.id)"
              class="remove-member-btn"
              :title="t('projects.form.removeMember') || 'Remove'"
            >
              <i class="pi pi-times"></i>
            </button>
          </div>
        </div>
        <div v-else class="no-members">
          {{ t('projects.form.noMembers') || 'No team members added yet' }}
        </div>
      </div>

      <!-- Milestones -->
      <div class="form-group">
        <label>{{ t('projects.form.timeline') || 'Milestones' }}</label>
        <div class="milestone-inputs">
          <pv-input-text v-model="newMilestoneName" :placeholder="t('projects.form.projectMilestoneNamePlaceHolder')" class="w-full" />
          <input type="date" v-model="newMilestoneDate" class="form-input" />
          <select v-model="newMilestoneType" class="form-select">
            <option value="pending">Pending</option>
            <option value="warning">Warning</option>
            <option value="success">Success</option>
          </select>
          <pv-button icon="pi pi-plus" @click="addMilestone" class="add-member-btn" />
        </div>

        <div v-if="milestones.length > 0" class="milestones-list">
          <div v-for="m in milestones" :key="m.id" class="milestone-row">
            <div class="milestone-left">
              <button class="milestone-type-btn" @click="toggleMilestoneType(m.id)" :title="m.type">
                <i :class="m.type === 'success' ? 'pi pi-check' : m.type === 'warning' ? 'pi pi-exclamation-triangle' : 'pi pi-calendar'" />
              </button>
              <span class="milestone-name">{{ m.name }}</span>
              <span class="milestone-date">{{ m.date }}</span>
            </div>
            <div class="milestone-actions">
              <pv-button icon="pi pi-times" text severity="danger" size="small" @click="removeMilestone(m.id)" />
            </div>
          </div>
        </div>
        <div v-else class="no-members">{{ t('projects.form.noMembers') || 'No milestones yet' }}</div>
      </div>

      <div class="form-actions">
        <pv-button :label="t('projects.form.cancel')" severity="secondary" @click="handleCancel" />
        <pv-button :label="t('projects.form.updateProject') || 'Update Project'" :loading="loading" @click="handleSubmit" />
      </div>
    </div>
  </pv-dialog>
</template>

<style scoped>
.edit-project-dialog {
  min-width: 800px !important;
  max-width: 900px !important;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.625rem;
  color: #dc2626;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-group label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
  letter-spacing: 0.3px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-select,
.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-family: inherit;
  background: white;
  color: #1f2937;
  transition: all 0.2s ease;
  line-height: 1.5;
}

.form-select:hover,
.form-input:hover {
  border-color: #bfdbfe;
  background: #f9fafb;
}

.form-select:focus,
.form-input:focus {
  outline: none;
  border-color: #2563eb;
  background: white;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1), 0 0 0 1px #2563eb;
}

.team-members-input {
  display: flex;
  gap: 0.75rem;
}

.add-member-btn {
  flex-shrink: 0;
  padding: 0.875rem 1rem;
}

.team-members-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.team-member-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.member-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  font-weight: 700;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.member-name {
  color: #374151;
  font-weight: 500;
}

.remove-member-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  flex-shrink: 0;
}

.remove-member-btn:hover {
  color: #ef4444;
}

.no-members {
  color: #9ca3af;
  font-size: 0.875rem;
  font-style: italic;
  padding: 1rem;
  text-align: center;
}

.milestone-inputs {
  display: grid;
  grid-template-columns: 1fr 160px 140px 48px;
  gap: 0.5rem;
  align-items: center;
}

.milestones-list {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.milestone-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f9fafb;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
}

.milestone-left {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.milestone-name {
  font-weight: 600;
}

.milestone-date {
  color: #6b7280;
  font-size: 0.85rem;
}

.milestone-actions {
  display: flex;
  gap: 0.5rem;
}

.milestone-type-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 6px;
  color: #2563eb;
  margin-right: 0.5rem;
}
.milestone-type-btn .pi {
  font-size: 1rem;
}
.milestone-type-btn:hover {
  background: #eef2ff;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.progress-preview {
  margin-bottom: 0.75rem;
}
.preview-bar {
  height: 0.5rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.progress-header .label { font-size: 0.8rem; color: #6b7280; font-weight: 600; text-transform: uppercase; }
.progress-header .percentage { font-weight: 700; color: #111827; }

@media (max-width: 1024px) {
  .edit-project-dialog { min-width: 95vw !important; max-width: 95vw !important; }
  .milestone-inputs { grid-template-columns: 1fr 1fr; }
  .form-row { grid-template-columns: 1fr; }
}

.w-full {
  width: 100%;
}

:deep(.p-input-text),
:deep(.p-inputtextarea) {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-family: inherit;
  background: #fafbfc;
  color: #1f2937;
  transition: all 0.2s ease;
  line-height: 1.5;
}
</style>

