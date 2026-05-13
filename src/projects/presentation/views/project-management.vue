<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useProjectManagementStore } from '../../application/project-management.store';
import type { MilestoneStatus, ProjectManagement } from '../../domain/model/project-management.types';

const { t } = useI18n();
const store = useProjectManagementStore();
const editingProjectId = ref<number | null>(null);

const projectForm = reactive({
  name: '',
  client: '',
  description: '',
  category: 'Software Delivery',
  startDate: '',
  endDate: '',
  budget: 0,
});

const milestoneForm = reactive({
  title: '',
  dueDate: '',
  status: 'pending' as MilestoneStatus,
  budgetImpact: 0,
  dependencies: [] as number[],
  responsible: '',
});

const projectFormValid = computed(
  () =>
    projectForm.name.trim().length > 0 &&
    projectForm.client.trim().length > 0
);

const isEditing = computed(() => editingProjectId.value !== null);

const projectSelected = computed(() => store.selectedProject);
const summaryText = computed(() => {
  if (!store.projects.length) {
    return t('projects.managementEmpty');
  }
  return t('projects.managementSummary', { count: store.projects.length });
});

function resetProjectForm() {
  editingProjectId.value = null;
  projectForm.name = '';
  projectForm.client = '';
  projectForm.description = '';
  projectForm.category = 'Software Delivery';
  projectForm.startDate = '';
  projectForm.endDate = '';
  projectForm.budget = 0;
}

function fillProjectForm(project: ProjectManagement) {
  editingProjectId.value = project.id;
  projectForm.name = project.name;
  projectForm.client = project.client;
  projectForm.description = project.description;
  projectForm.category = project.category;
  projectForm.startDate = project.startDate;
  projectForm.endDate = project.endDate;
  projectForm.budget = project.budget;
  store.selectProject(project.id);
}

async function saveProject() {
  if (!projectFormValid.value) {
    return;
  }

  const payload = {
    name: projectForm.name,
    client: projectForm.client,
    description: projectForm.description,
    category: projectForm.category,
    startDate: projectForm.startDate,
    endDate: projectForm.endDate,
    budget: projectForm.budget,
  };

  if (isEditing.value && editingProjectId.value !== null) {
    await store.updateProject(editingProjectId.value, payload);
  } else {
    await store.createProject(payload);
  }

  resetProjectForm();
}

async function submitMilestone() {
  if (!store.selectedProject || !milestoneForm.title || !milestoneForm.dueDate) {
    return;
  }

  await store.addMilestone(store.selectedProject.id, {
    title: milestoneForm.title,
    dueDate: milestoneForm.dueDate,
    status: milestoneForm.status,
    budgetImpact: milestoneForm.budgetImpact,
    dependencies: milestoneForm.dependencies,
    responsible: milestoneForm.responsible,
  });

  milestoneForm.title = '';
  milestoneForm.dueDate = '';
  milestoneForm.status = 'pending';
  milestoneForm.budgetImpact = 0;
  milestoneForm.dependencies = [];
  milestoneForm.responsible = '';
}

function editProject(project: ProjectManagement) {
  fillProjectForm(project);
}

async function removeProject(project: ProjectManagement) {
  if (!window.confirm(t('projects.confirmDelete'))) {
    return;
  }

  await store.deleteProject(project.id);
}

function cancelEdit() {
  resetProjectForm();
}

function selectProject(project: ProjectManagement) {
  store.selectProject(project.id);
}

async function changeProjectStatus(project: ProjectManagement, status: string) {
  await store.updateStatus(project.id, status as any, project.progress);
}

onMounted(() => {
  store.loadProjects();
});
</script>

<template>
  <div class="project-management-root">
    <section class="header-panel">
      <div>
        <h1>{{ t('projects.managementTitle') }}</h1>
        <p>{{ t('projects.managementSubtitle') }}</p>
      </div>
      <div class="summary-box">
        <strong>{{ store.projects.length }}</strong>
        <span>{{ summaryText }}</span>
      </div>
    </section>

    <section class="forms-grid">
      <pv-card class="panel-card">
        <template #title>
          {{ t('projects.managementCreateTitle') }}
        </template>

        <div class="field-grid">
          <label>{{ t('projects.formName') }}</label>
          <input class="form-input" v-model="projectForm.name" placeholder="Project name" />
        </div>

        <div class="field-grid">
          <label>{{ t('projects.formClient') }}</label>
          <input class="form-input" v-model="projectForm.client" placeholder="Client name" />
        </div>

        <div class="field-grid">
          <label>{{ t('projects.formCategory') }}</label>
          <input class="form-input" v-model="projectForm.category" placeholder="Category" />
        </div>

        <div class="field-grid">
          <label>{{ t('projects.formBudget') }}</label>
          <input class="form-input" type="number" min="0" v-model.number="projectForm.budget" />
        </div>

        <div class="field-grid">
          <label>{{ t('projects.formStartDate') }}</label>
          <input class="form-input" v-model="projectForm.startDate" placeholder="YYYY-MM-DD" />
        </div>

        <div class="field-grid">
          <label>{{ t('projects.formEndDate') }}</label>
          <input class="form-input" v-model="projectForm.endDate" placeholder="YYYY-MM-DD" />
        </div>

        <div class="field-grid full-width">
          <label>{{ t('projects.formDescription') }}</label>
          <textarea class="form-textarea" v-model="projectForm.description" rows="4"></textarea>
        </div>

        <pv-button
          :label="isEditing ? t('projects.managementSaveButton') : t('projects.managementCreateButton')"
          class="pv-button pv-button-sm"
          :disabled="!projectFormValid"
          @click="saveProject"
        />
      </pv-card>

      <pv-card class="panel-card">
        <template #title>
          {{ t('projects.managementMilestoneTitle') }}
        </template>

        <div class="field-grid">
          <label>{{ t('projects.formMilestoneTitle') }}</label>
          <input class="form-input" v-model="milestoneForm.title" placeholder="Milestone name" />
        </div>

        <div class="field-grid">
          <label>{{ t('projects.formMilestoneDate') }}</label>
          <input class="form-input" v-model="milestoneForm.dueDate" placeholder="YYYY-MM-DD" />
        </div>

        <div class="field-grid">
          <label>{{ t('projects.formMilestoneOwner') }}</label>
          <input class="form-input" v-model="milestoneForm.responsible" placeholder="Responsible" />
        </div>

        <div class="field-grid">
          <label>{{ t('projects.formMilestoneImpact') }}</label>
          <input class="form-input" type="number" min="0" v-model.number="milestoneForm.budgetImpact" />
        </div>

        <div class="field-grid full-width">
          <label>{{ t('projects.formMilestoneStatus') }}</label>
          <select class="form-select" v-model="milestoneForm.status">
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <pv-button :label="t('projects.managementAddMilestoneButton')" class="pv-button pv-button-sm" @click="submitMilestone" />
      </pv-card>
    </section>

    <section class="project-list">
      <pv-card class="panel-card">
        <template #title>{{ t('projects.managementProjectsTitle') }}</template>

        <div class="project-list-grid">
          <div v-for="project in store.projects" :key="project.id" class="project-item" @click="selectProject(project)">
            <div class="project-top">
              <h3>{{ project.name }}</h3>
              <pv-tag :value="project.status" severity="info" />
            </div>
            <p>{{ project.description }}</p>
            <div class="project-meta">
              <span>{{ project.category }}</span>
              <span>{{ project.progress }}% {{ t('projects.managementProgress') }}</span>
              <span>{{ project.budget }} USD</span>
            </div>

            <div class="project-actions">
              <pv-button label="Active" class="pv-button-sm" @click.stop="changeProjectStatus(project, 'active')" />
              <pv-button label="Delayed" class="pv-button-sm p-button-secondary" @click.stop="changeProjectStatus(project, 'delayed')" />
            </div>
          </div>
        </div>
      </pv-card>

      <pv-card v-if="projectSelected" class="panel-card selected-summary">
        <template #title>{{ t('projects.managementSelectedTitle') }}</template>
        <p><strong>{{ projectSelected.name }}</strong></p>
        <p>{{ projectSelected.description }}</p>
        <div class="project-meta">
          <span>{{ t('projects.managementStart') }}: {{ projectSelected.startDate }}</span>
          <span>{{ t('projects.managementEnd') }}: {{ projectSelected.endDate }}</span>
        </div>
        <div class="milestones-list">
          <h4>{{ t('projects.managementMilestones') }}</h4>
          <ul>
            <li v-for="milestone in projectSelected.milestones" :key="milestone.id">
              {{ milestone.title }} — {{ milestone.dueDate }} — {{ milestone.status }}
            </li>
          </ul>
        </div>
      </pv-card>
    </section>
  </div>
</template>

<style scoped>
.project-management-root {
  display: grid;
  gap: 1.5rem;
  padding: 2rem 0;
}

.header-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.summary-box {
  background: #f8fafc;
  border: 1px solid #d1d5db;
  border-radius: 1rem;
  padding: 1rem 1.25rem;
  text-align: right;
}

.forms-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.field-grid {
  display: grid;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  min-height: 2.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  font-size: 0.95rem;
  color: #111827;
  background: #ffffff;
}

.form-textarea {
  min-height: 7rem;
  resize: vertical;
}

.field-grid.full-width {
  grid-column: 1 / -1;
}

.project-list {
  display: grid;
  gap: 1.5rem;
}

.project-list-grid {
  display: grid;
  gap: 1rem;
}

.project-item {
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1rem;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.project-item:hover {
  border-color: #3b82f6;
}

.project-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.project-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  color: #6b7280;
  margin: 0.75rem 0;
}

.project-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.selected-summary {
  border-color: #3b82f6;
}

.milestones-list ul {
  margin: 0.5rem 0 0;
  padding-left: 1.2rem;
}

@media (max-width: 1024px) {
  .forms-grid {
    grid-template-columns: 1fr;
  }
}
</style>
