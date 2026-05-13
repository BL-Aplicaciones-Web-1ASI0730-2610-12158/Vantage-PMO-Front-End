<script setup>
import ProjectCard from './ProjectCard.vue';
import { ProjectStore } from '../../application/project.store.js';
import { computed, onMounted } from 'vue';

const store = ProjectStore();
onMounted(() => store.fetchProjects());

const activeProjects = computed(() =>
  store.projects.slice(0, 3)
);
</script>

<template>
  <div>
    <ProjectCard v-for="project in activeProjects" :key="project.id" :project="project" />
  </div>
</template>

<style scoped>

</style>