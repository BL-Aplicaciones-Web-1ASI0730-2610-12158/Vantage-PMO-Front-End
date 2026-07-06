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
        const created = await projectsApi.createProject(payload);
        projects.value = [created, ...projects.value];
        return created;
    }

    return {
        projects,
        loading,
        fetchProjects,
        createProject,
    };
})