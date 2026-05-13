<script setup>
import { computed, onMounted, ref } from 'vue';
import { ProjectStore } from '../../application/project.store.js';
import ProjectCard from './ProjectCard.vue';
import ProjectsHeader from './ProjectsHeader.vue';
import MilestoneTimeline from './MilestoneTimeline.vue';
import TeamCapacity from './TeamCapacity.vue';

const store = ProjectStore();
onMounted(() => store.fetchProjects());

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

    <!-- Projects Cards Grid -->
    <div class="projects-grid">
      <ProjectCard
        v-for="project in activeProjects"
        :key="project.id"
        :project="project"
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

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>