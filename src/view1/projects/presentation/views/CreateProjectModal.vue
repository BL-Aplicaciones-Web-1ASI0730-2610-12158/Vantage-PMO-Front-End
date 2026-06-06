<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ProjectStore } from '../../application/project.store.js';

const { t } = useI18n();
const store = ProjectStore();

const props = defineProps({
  visible: Boolean
});

const emit = defineEmits(['update:visible', 'created']);

const formData = ref({
  name: '',
  category: '',
  description: '',
  startDate: '',
  dueDate: ''
});

const teamMembers = ref([]);
const newMemberName = ref('');
const loading = ref(false);
const error = ref(null);

const categories = [
  'Infrastructure Modernization',
  'Commercial Real Estate',
  'Logistics Optimization',
  'Digital Transformation',
  'Cloud Migration',
  'Security Enhancement'
];

const categoriesES = [
  'Modernización de Infraestructura',
  'Bienes Raíces Comerciales',
  'Optimización de Logística',
  'Transformación Digital',
  'Migración en la Nube',
  'Mejora de Seguridad'
];

const handleSubmit = async () => {
  if (!formData.value.name || !formData.value.category) {
    error.value = t('projects.form.requiredFields');
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const newProject = {
      name: formData.value.name,
      category: formData.value.category,
      description: formData.value.description,
      startDate: formData.value.startDate || new Date().toISOString().split('T')[0],
      dueDate: formData.value.dueDate || null,
      status: 'healthy',
      progress: 0,
      manager: 'Current User',
      teamMembers: teamMembers.value.length > 0 ? teamMembers.value : [
        { id: 1, name: 'Team Member 1', avatar: 'A' },
        { id: 2, name: 'Team Member 2', avatar: 'B' }
      ],
      milestones: []
    };

    await store.createProject(newProject);

    // Reset form
    formData.value = {
      name: '',
      category: '',
      description: '',
      startDate: '',
      dueDate: ''
    };
    teamMembers.value = [];
    newMemberName.value = '';

    emit('update:visible', false);
    emit('created');
  } catch (err) {
    error.value = t('projects.form.error');
    console.error('Error creating project:', err);
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  formData.value = {
    name: '',
    category: '',
    description: '',
    startDate: '',
    dueDate: ''
  };
  teamMembers.value = [];
  newMemberName.value = '';
  error.value = null;
  emit('update:visible', false);
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
</script>

<template>
  <pv-dialog
    :visible="visible"
    :header="t('projects.form.title')"
    :modal="true"
    class="create-project-dialog"
    @update:visible="(val) => emit('update:visible', val)"
  >
    <div class="form-content">
      <!-- Error Message -->
      <div v-if="error" class="error-message">
        <i class="pi pi-exclamation-circle"></i>
        <span>{{ error }}</span>
      </div>

      <!-- Project Name -->
      <div class="form-group">
        <label>{{ t('projects.form.projectName') }} *</label>
        <pv-input-text
          v-model="formData.name"
          :placeholder="t('projects.form.projectNamePlaceholder')"
          class="w-full"
        />
      </div>

      <!-- Category -->
      <div class="form-group">
        <label>{{ t('projects.form.category') }} *</label>
        <select v-model="formData.category" class="form-select">
          <option value="">{{ t('projects.form.categoryPlaceholder') }}</option>
          <option v-for="cat in $i18n.locale === 'es' ? categoriesES : categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>

      <!-- Description -->
      <div class="form-group">
        <label>{{ t('projects.form.description') }} *</label>
        <pv-textarea
          v-model="formData.description"
          :placeholder="t('projects.form.descriptionPlaceholder')"
          rows="4"
          class="w-full"
        />
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
         <label>{{ t('projects.form.teamMembers')}}</label>
         <div class="team-members-input">
           <pv-input-text
             v-model="newMemberName"
             :placeholder="t('projects.form.addMemberPlaceholder')"
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
           {{ t('projects.form.noMembers')}}
         </div>
       </div>

      <!-- Action Buttons -->
      <div class="form-actions">
        <pv-button
          :label="t('projects.form.cancel')"
          severity="secondary"
          @click="handleCancel"
        />
        <pv-button
          :label="t('projects.form.create')"
          :loading="loading"
          @click="handleSubmit"
        />
      </div>
    </div>
  </pv-dialog>
</template>

<style scoped>
.create-project-dialog {
  min-width: 800px !important;
  max-width: 900px !important;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 2rem;
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

.form-actions {
  display: flex;
  gap: 1.25rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f0f0f0;
}

.w-full {
  width: 100%;
}

.form-select,
.form-input,
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

.form-select,
.form-input {
  background: white;
}

.form-select:hover,
.form-input:hover,
:deep(.p-input-text:hover),
:deep(.p-inputtextarea:hover) {
  border-color: #bfdbfe;
  background: #f9fafb;
}

.form-select:focus,
.form-input:focus,
:deep(.p-input-text:focus),
:deep(.p-inputtextarea:focus) {
  outline: none;
  border-color: #2563eb;
  background: white;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1), 0 0 0 1px #2563eb;
}

:deep(.p-inputtextarea) {
  resize: vertical;
  min-height: 120px;
}

/* Dialog title */
:deep(.p-dialog .p-dialog-header) {
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
  border-bottom: 2px solid #e5e7eb;
}

:deep(.p-dialog .p-dialog-header .p-dialog-title) {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  letter-spacing: 0.5px;
}

/* Dialog close button */
:deep(.p-dialog .p-dialog-header .p-dialog-header-icon) {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Button styling */
:deep(.p-button) {
  padding: 0.875rem 1.75rem;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 0.5rem;
  letter-spacing: 0.3px;
  transition: all 0.2s ease;
}

:deep(.p-button-secondary) {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

:deep(.p-button-secondary:hover:not(:disabled)) {
  background: #e5e7eb;
  border-color: #9ca3af;
}

:deep(.p-button.p-button-primary) {
  background: #2563eb;
  border-color: #2563eb;
}

:deep(.p-button.p-button-primary:hover:not(:disabled)) {
  background: #1d4ed8;
  border-color: #1d4ed8;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

@media (max-width: 1024px) {
  .create-project-dialog {
    min-width: 95vw !important;
    max-width: 95vw !important;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-content {
    padding: 1.5rem;
  }
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
</style>