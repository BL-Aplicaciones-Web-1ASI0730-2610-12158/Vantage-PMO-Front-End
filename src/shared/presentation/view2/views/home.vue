<script setup>
import { computed } from 'vue'
import { useDashboardStore } from '../../application/dashboard.store'

const store = useDashboardStore()

const projects = computed(() => store.projects || [])
</script>

<template>

  <div class="home">

    <div class="hero-grid">

      <div class="health-card">

        <div class="card-header">
          <span class="eyebrow">
            Portfolio Sentiment
          </span>

          <h1>
            Global Health Index
          </h1>
        </div>

        <div class="chart">
          <div
              v-for="(h,index) in [60,75,55,90,80,65,70,45,60,50,85]"
              :key="index"
              class="bar"
              :style="{height:h+'%'}">
          </div>
        </div>

      </div>

      <div class="side-cards">

        <div class="metric-card blue">
          <span>Total CapEx</span>
          <h2>$12.4M</h2>
        </div>

        <div class="metric-card">
          <span>Compliance Score</span>
          <h2>98.1%</h2>
        </div>

      </div>

    </div>

    <div class="projects-card">

      <div class="section-header">
        <h2>Portfolio Distribution</h2>
      </div>

      <table class="projects-table">

        <thead>
        <tr>
          <th>Health</th>
          <th>Project</th>
          <th>Category</th>
          <th>Progress</th>
        </tr>
        </thead>

        <tbody>

        <tr
            v-for="project in projects"
            :key="project.id">

          <td>
              <span
                  class="status-badge"
                  :class="project.status?.toLowerCase()">
                {{ project.status }}
              </span>
          </td>

          <td>
            <strong>{{ project.name }}</strong>
            <br>
            {{ project.manager }}
          </td>

          <td>
            {{ project.category }}
          </td>

          <td>
            {{ project.progress }}%
          </td>

        </tr>

        <tr v-if="projects.length === 0">
          <td colspan="4" class="empty-state">
            No projects available
          </td>
        </tr>

        </tbody>

      </table>

    </div>

  </div>

</template>

<style scoped>

.home{
  display:flex;
  flex-direction:column;
  gap:24px;
}

.hero-grid{
  display:grid;
  grid-template-columns:2fr 1fr;
  gap:20px;
}

.health-card,
.projects-card,
.metric-card{
  background:white;
  border:1px solid #e5e7eb;
  border-radius:12px;
}

.health-card{
  padding:24px;
}

.chart{
  display:flex;
  align-items:flex-end;
  gap:6px;
  height:220px;
}

.bar{
  flex:1;
  background:#2563eb;
  border-radius:4px 4px 0 0;
}

.side-cards{
  display:flex;
  flex-direction:column;
  gap:20px;
}

.metric-card{
  padding:24px;
}

.metric-card.blue{
  background:#2563eb;
  color:white;
}

.projects-card{
  padding:24px;
}

.section-header{
  margin-bottom:16px;
}

.projects-table{
  width:100%;
  border-collapse:collapse;
}

.projects-table th,
.projects-table td{
  padding:14px;
  border-bottom:1px solid #e5e7eb;
  text-align:left;
}

.status-badge{
  padding:6px 10px;
  border-radius:999px;
  font-size:12px;
  font-weight:600;
}

.status-badge.healthy{
  background:#dcfce7;
  color:#166534;
}

.status-badge.warning{
  background:#fef3c7;
  color:#92400e;
}

.status-badge.critical{
  background:#fee2e2;
  color:#991b1b;
}

.empty-state{
  text-align:center;
  color:#94a3b8;
  padding:30px;
}

@media(max-width:768px){

  .hero-grid{
    grid-template-columns:1fr;
  }

}

</style>