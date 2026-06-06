<script setup>
import { computed, onMounted, ref } from 'vue';
import { ProjectStore } from '../../application/project.store.js';
import ProjectCard from './ProjectCard.vue';
import ProjectsHeader from './ProjectsHeader.vue';
import MilestoneTimeline from './MilestoneTimeline.vue';
import TeamCapacity from './TeamCapacity.vue';
import CreateProjectModal from './CreateProjectModal.vue';

const store = ProjectStore();
const showCreateModal = ref(false);
const searchQuery = ref('');

onMounted(() => store.fetchProjects());

const sortByHealth = ref(false);

const filteredProjects = computed(() => {
  let projects = store.projects;

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    projects = projects.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
  }

  // Take first 3 and sort if needed
  projects = projects.slice(0, 3);

  if (sortByHealth.value) {
    projects = projects.sort((a, b) => {
      const healthMap = { healthy: 1, 'at-risk': 2, critical: 3 };
      return healthMap[a.status] - healthMap[b.status];
    });
  }

  return projects;
});

const activeProjects = computed(() => filteredProjects.value);

const handleFilterChange = (filters) => {
  console.log('Filters changed:', filters);
};

const handleSortChange = () => {
  sortByHealth.value = !sortByHealth.value;
};

const handleProjectCreated = () => {
  // Refresh projects list after creation
  store.fetchProjects();
  searchQuery.value = '';
};
</script>

<template>
  <div class="projects-container">
    <div class="header-with-button">
      <ProjectsHeader
        :project-count="activeProjects.length"
        @filter-changed="handleFilterChange"
        @sort-changed="handleSortChange"
      />
      <pv-button
        :label="$t('projects.createProject')"
        icon="pi pi-plus"
        @click="showCreateModal = true"
        class="create-btn"
      />
    </div>

    <!-- Search Filter -->
    <div class="filter-section">
      <div class="search-box">
        <i class="pi pi-search"></i>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="$t('projects.filter')"
          class="search-input"
        />
        <button v-if="searchQuery" @click="searchQuery = ''" class="clear-btn">
          <i class="pi pi-times"></i>
        </button>
      </div>
      <span v-if="activeProjects.length > 0" class="result-count">
        {{ activeProjects.length }} {{ $t('projects.projectsFound') }}
      </span>
      <span v-else class="result-count no-results">
        {{ $t('projects.noResults') }}
      </span>
    </div>

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

    <!-- Create Project Modal -->
    <CreateProjectModal
      :visible="showCreateModal"
      @update:visible="(val) => showCreateModal = val"
      @created="handleProjectCreated"
    />
  </div>
</template>

<style scoped>
.projects-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 0;
}

.header-with-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.create-btn {
  white-space: nowrap;
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  background: #f3f4f6;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.search-box:focus-within {
  border-color: #2563eb;
  background: white;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.search-box i {
  color: #9ca3af;
  font-size: 1rem;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.875rem;
  color: #374151;
  font-family: inherit;
}

.search-input::placeholder {
  color: #9ca3af;
}

.clear-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.clear-btn:hover {
  color: #6b7280;
}

.result-count {
  font-size: 0.875rem;
  color: #6b7280;
  white-space: nowrap;
  padding: 0 1rem;
  border-left: 1px solid #e5e7eb;
}

.result-count.no-results {
  color: #ef4444;
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

  .header-with-button {
    flex-direction: column;
    align-items: stretch;
  }

  .create-btn {
    width: 100%;
  }

  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    width: 100%;
  }

  .result-count {
    border-left: none;
    border-top: 1px solid #e5e7eb;
    padding: 1rem 0 0;
  }
}
</style>