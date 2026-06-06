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

    async function createProject(projectData) {
        loading.value = true;
        try {
            const newProject = await projectsApi.createProject(projectData);
            projects.value.push(newProject);
            return newProject;
        } finally {
            loading.value = false;
        }
    }

    async function updateProject(id, projectData) {
        loading.value = true;
        try {
            const updated = await projectsApi.updateProject(id, projectData);
            // replace in local store
            const idx = projects.value.findIndex(p => p.id === updated.id);
            if (idx !== -1) projects.value.splice(idx, 1, updated);
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