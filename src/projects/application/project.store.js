import {defineStore} from "pinia";
import {ref} from "vue";
import {projectsApi} from "../infrastructure/projects-api.js";

export const ProjectStore = defineStore('project', () => {
    const projects = ref([]);
    const loading = ref(false);

    async function fetchProjects() {
        loading.value = true;
        try {
            // Usa getAllProjects para la colección correcta
            projects.value = await projectsApi.getAllProjects();
        } finally {
            loading.value = false;
        }
    }
    return {
        projects,
        loading,
        fetchProjects
    };
})