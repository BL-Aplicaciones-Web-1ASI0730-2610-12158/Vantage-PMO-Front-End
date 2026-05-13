import {defineStore} from "pinia";
import {ref} from "vue";
import {projectsApi} from "../infrastructure/projects-api.js";

export const ProjectStore = defineStore('project', () => {
    const projects = ref([]);
    const loading = ref(false);

    async function fetchProjects() {
        loading.value = true;
        try {
            projects.value = await projectsApi.getAllProjects();
        } finally {
            loading.value = false;
        }
    }

    async function createProject(payload) {
        loading.value = true;
        try {
            const project = await projectsApi.createProject(payload);
            projects.value.unshift(project);
            return project;
        } finally {
            loading.value = false;
        }
    }

    async function updateProject(projectId, payload) {
        const projectIndex = projects.value.findIndex((item) => item.id === projectId);
        if (projectIndex < 0) return null;

        loading.value = true;
        try {
            const updated = await projectsApi.updateProject(projectId, payload);
            projects.value[projectIndex] = updated;
            return updated;
        } finally {
            loading.value = false;
        }
    }

    return {
        projects,
        loading,
        fetchProjects,
        createProject,
        updateProject
    };
})