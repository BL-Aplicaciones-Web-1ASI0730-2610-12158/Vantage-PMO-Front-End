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

    return {
        projects,
        loading,
        fetchProjects,
        createProject
    };
})