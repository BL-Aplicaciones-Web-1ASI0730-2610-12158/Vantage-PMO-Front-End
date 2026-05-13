import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type {
  CreateProjectPayload,
  Milestone,
  MilestonePayload,
  ProjectManagement,
  ProjectStatus,
} from '../domain/model/project-management.types';
import { projectManagementApi } from '../infrastructure/project-management-api.js';

const generateId = (items: Array<{ id: number }>) => {
  return items.length === 0 ? 1 : Math.max(...items.map((item) => item.id)) + 1;
};

const buildProjectPayload = (payload: CreateProjectPayload): Partial<ProjectManagement> => {
  const now = new Date().toISOString();
  return {
    name: payload.name,
    client: payload.client,
    description: payload.description,
    category: payload.category,
    startDate: payload.startDate,
    endDate: payload.endDate,
    status: 'planned',
    progress: 0,
    budget: payload.budget,
    milestones: [],
    dependencies: [],
    createdAt: now,
    updatedAt: now,
  };
};

export const useProjectManagementStore = defineStore('project-management', () => {
  const projects = ref<ProjectManagement[]>([]);
  const loading = ref(false);
  const selectedProjectId = ref<number | null>(null);

  const selectedProject = computed(() => {
    return projects.value.find((project) => project.id === selectedProjectId.value) ?? null;
  });

  const activeProjects = computed(() => {
    return projects.value.filter((project) => project.status !== 'draft');
  });

  async function loadProjects() {
    loading.value = true;
    try {
      projects.value = await projectManagementApi.getAll();
    } finally {
      loading.value = false;
    }
  }

  async function createProject(payload: CreateProjectPayload) {
    loading.value = true;
    try {
      const project = await projectManagementApi.create(buildProjectPayload(payload));
      projects.value.push(project);
      selectedProjectId.value = project.id;
      return project;
    } finally {
      loading.value = false;
    }
  }

  async function updateProject(projectId: number, payload: Partial<CreateProjectPayload> & { status?: ProjectStatus; progress?: number; budget?: number; dependencies?: number[] }) {
    const project = projects.value.find((item) => item.id === projectId);
    if (!project) return null;

    const updatedProject = {
      ...project,
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    loading.value = true;
    try {
      const result = await projectManagementApi.update(projectId, updatedProject);
      const index = projects.value.findIndex((item) => item.id === projectId);
      if (index >= 0) {
        projects.value[index] = result;
      }
      return result;
    } finally {
      loading.value = false;
    }
  }

  async function addMilestone(projectId: number, milestonePayload: MilestonePayload) {
    const project = projects.value.find((item) => item.id === projectId);
    if (!project) return null;

    const milestone: Milestone = {
      id: generateId(project.milestones),
      title: milestonePayload.title,
      dueDate: milestonePayload.dueDate,
      status: milestonePayload.status,
      budgetImpact: milestonePayload.budgetImpact,
      dependencies: milestonePayload.dependencies,
      responsible: milestonePayload.responsible,
    };

    const updatedProject = {
      ...project,
      milestones: [...project.milestones, milestone],
      updatedAt: new Date().toISOString(),
    };

    loading.value = true;
    try {
      const result = await projectManagementApi.update(projectId, updatedProject);
      const index = projects.value.findIndex((item) => item.id === projectId);
      if (index >= 0) {
        projects.value[index] = result;
      }
      return milestone;
    } finally {
      loading.value = false;
    }
  }

  async function updateStatus(projectId: number, status: ProjectStatus, progress?: number) {
    const project = projects.value.find((item) => item.id === projectId);
    if (!project) return null;

    const updatedProject = {
      ...project,
      status,
      progress: typeof progress === 'number' ? Math.min(100, Math.max(0, progress)) : project.progress,
      updatedAt: new Date().toISOString(),
    };

    loading.value = true;
    try {
      const result = await projectManagementApi.update(projectId, updatedProject);
      const index = projects.value.findIndex((item) => item.id === projectId);
      if (index >= 0) {
        projects.value[index] = result;
      }
      return result;
    } finally {
      loading.value = false;
    }
  }

  async function deleteProject(projectId: number) {
    loading.value = true;
    try {
      await projectManagementApi.deleteProject(projectId);
      projects.value = projects.value.filter((item) => item.id !== projectId);
      if (selectedProjectId.value === projectId) {
        selectedProjectId.value = null;
      }
    } finally {
      loading.value = false;
    }
  }

  function selectProject(projectId: number) {
    selectedProjectId.value = projectId;
  }

  function clearSelection() {
    selectedProjectId.value = null;
  }

  return {
    projects,
    loading,
    selectedProjectId,
    selectedProject,
    activeProjects,
    loadProjects,
    createProject,
    updateProject,
    addMilestone,
    updateStatus,
    deleteProject,
    selectProject,
    clearSelection,
  };
});
