<script setup>
import { computed, onMounted, ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { ProjectStore } from '../../application/project.store.js';
import ProjectCard from './ProjectCard.vue';
import ProjectsHeader from './ProjectsHeader.vue';
import MilestoneTimeline from './MilestoneTimeline.vue';
import TeamCapacity from './TeamCapacity.vue';

const { t } = useI18n();
const store = ProjectStore();
onMounted(() => store.fetchProjects());

const showCreateDialog = ref(false);
const isEditMode = ref(false);
const editingProjectId = ref(null);
const newProject = reactive({
  name: '',
  category: 'Infrastructure Modernization',
  description: '',
  manager: 'Project Lead',
  startDate: '',
  endDate: '',
  status: 'healthy',
  progress: 0,
  milestones: [],
  teamMembers: [],
});

function resetNewProject() {
  newProject.name = '';
  newProject.category = 'Infrastructure Modernization';
  newProject.description = '';
  newProject.manager = 'Project Lead';
  newProject.startDate = '';
  newProject.endDate = '';
  newProject.status = 'healthy';
  newProject.progress = 0;
  newProject.milestones = [];
  newProject.teamMembers = [];
  editingProjectId.value = null;
  isEditMode.value = false;
}

function openEditProject(project) {
  editingProjectId.value = project.id;
  isEditMode.value = true;
  newProject.name = project.name;
  newProject.category = project.category;
  newProject.description = project.description;
  newProject.manager = project.manager || 'Project Lead';
  newProject.startDate = project.startDate || '';
  newProject.endDate = project.endDate || '';
  newProject.status = project.status || 'healthy';
  newProject.progress = project.progress ?? 0;
  newProject.milestones = project.milestones || [];
  newProject.teamMembers = project.teamMembers || [];
  showCreateDialog.value = true;
}

function openNewProjectDialog() {
  resetNewProject();
  showCreateDialog.value = true;
}

async function handleSaveProject() {
  if (!newProject.name.trim()) {
    return;
  }

  const payload = {
    name: newProject.name,
    category: newProject.category,
    description: newProject.description,
    manager: newProject.manager,
    startDate: newProject.startDate,
    endDate: newProject.endDate,
    status: newProject.status,
    progress: newProject.progress,
    milestones: newProject.milestones,
    teamMembers: newProject.teamMembers,
  };

  if (isEditMode.value && editingProjectId.value !== null) {
    await store.updateProject(editingProjectId.value, payload);
  } else {
    await store.createProject(payload);
  }

  resetNewProject();
  showCreateDialog.value = false;
}

const sortByHealth = ref(false);

const activeProjects = computed(() => {
  let projects = store.projects.slice(0, 3);

  if (sortByHealth.value) {
    projects = projects.sort((a, b) => {
      const healthMap = { healthy: 1, 'at-risk': 2, critical: 3 };
      return healthMap[a.status] - healthMap[b.status];
    });
  }

  return projects;
});

const handleFilterChange = (filters) => {
  console.log('Filters changed:', filters);
};

const handleSortChange = () => {
  sortByHealth.value = !sortByHealth.value;
};
</script>

<template>
  <div class="projects-container">
    <ProjectsHeader
      :project-count="activeProjects.length"
      @filter-changed="handleFilterChange"
      @sort-changed="handleSortChange"
    />

    <div class="project-actions-row">
      <pv-button
        icon="pi pi-plus"
        :label="t('projects.newProject')"
        severity="success"
        @click="openNewProjectDialog"
      />
    </div>

    <pv-dialog
      :header="isEditMode ? t('projects.managementEditTitle') : t('projects.createDialogTitle')"
      v-model:visible="showCreateDialog"
      modal
      class="project-dialog"
    >
      <div class="dialog-field">
        <label>{{ t('projects.formName') }}</label>
        <input class="form-input" v-model="newProject.name" :placeholder="t('projects.formName')" />
      </div>
      <div class="dialog-field">
        <label>{{ t('projects.formCategory') }}</label>
        <input class="form-input" v-model="newProject.category" :placeholder="t('projects.formCategory')" />
      </div>
      <div class="dialog-field">
        <label>{{ t('projects.formDescription') }}</label>
        <textarea class="form-textarea" v-model="newProject.description" rows="4"></textarea>
      </div>
      <div class="dialog-field">
        <label>{{ t('projects.formStartDate') }}</label>
        <input class="form-input" v-model="newProject.startDate" placeholder="YYYY-MM-DD" />
      </div>
      <div class="dialog-field">
        <label>{{ t('projects.formEndDate') }}</label>
        <input class="form-input" v-model="newProject.endDate" placeholder="YYYY-MM-DD" />
      </div>
      <template #footer>
        <pv-button
          :label="t('projects.managementCancelButton')"
          text
          @click="showCreateDialog = false"
        />
        <pv-button
          :label="isEditMode ? t('projects.managementSaveButton') : t('projects.createProjectAction')"
          severity="success"
          @click="handleSaveProject"
        />
      </template>
    </pv-dialog>

    <!-- Projects Cards Grid -->
    <div class="projects-grid">
      <ProjectCard
        v-for="project in activeProjects"
        :key="project.id"
        :project="project"
        @edit-project="openEditProject"
      />
    </div>

    <!-- Bottom Section: Timeline and Team Capacity -->
    <div class="bottom-section">
      <MilestoneTimeline />
      <TeamCapacity />
    </div>
  </div>
</template>

<style scoped>
.projects-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.bottom-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }

  .bottom-section {
    grid-template-columns: 1fr;
  }
}

.project-actions-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.project-dialog {
  width: 600px;
  max-width: 100%;
}

.dialog-field {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  font-size: 0.95rem;
  color: #111827;
  background: #ffffff;
}

.form-textarea {
  min-height: 6rem;
  resize: vertical;
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>