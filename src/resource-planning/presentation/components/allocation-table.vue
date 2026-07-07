<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
    allocations: { type: Array, default: () => [] },
});

const { t } = useI18n();

function statusLabel(status) {
    return t(`resourcePlanning.allocations.status.${status}`, status);
}
</script>

<template>
  <div class="alloc-table-wrap">
    <table class="alloc-table">
      <thead>
        <tr>
          <th>{{ t('resourcePlanning.allocations.colResource') }}</th>
          <th>{{ t('resourcePlanning.allocations.colDepartment') }}</th>
          <th>{{ t('resourcePlanning.allocations.colProjects') }}</th>
          <th class="alloc-table__num">{{ t('resourcePlanning.allocations.colTotal') }}</th>
          <th>{{ t('resourcePlanning.allocations.colStatus') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!allocations.length">
          <td colspan="5" class="alloc-table__empty">{{ t('resourcePlanning.allocations.empty') }}</td>
        </tr>
        <tr v-for="row in allocations" :key="row.id">
          <td>
            <div class="alloc-table__resource">
              <span class="alloc-table__avatar" :style="{ background: row.avatarColor }">
                {{ row.avatar }}
              </span>
              <div>
                <div class="alloc-table__name">{{ row.resourceName }}</div>
                <div class="alloc-table__role">{{ row.role }}</div>
              </div>
            </div>
          </td>
          <td>{{ row.department }}</td>
          <td>
            <div class="alloc-table__projects">
              <span
                  v-for="(proj, idx) in row.projects"
                  :key="idx"
                  class="alloc-table__chip"
              >
                {{ proj.name }} <strong>{{ proj.allocation }}%</strong>
              </span>
            </div>
          </td>
          <td class="alloc-table__num">
            <span :class="['alloc-table__total', `alloc-table__total--${row.status}`]">
              {{ row.totalAllocation }}%
            </span>
          </td>
          <td>
            <span :class="['alloc-table__badge', `alloc-table__badge--${row.status}`]">
              {{ statusLabel(row.status) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.alloc-table-wrap { overflow-x: auto; }
.alloc-table {
  width: 100%;
  border-collapse: collapse;
  font-size: .82rem;
}
.alloc-table th {
  text-align: left;
  font-size: .65rem;
  font-weight: 800;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: #9ca3af;
  padding: .6rem .75rem;
  border-bottom: 1px solid #e5e7eb;
}
.alloc-table td {
  padding: .85rem .75rem;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
  color: #374151;
}
.alloc-table__num { text-align: right; }
.alloc-table__empty {
  text-align: center;
  color: #9ca3af;
  padding: 2rem !important;
}
.alloc-table__resource {
  display: flex;
  align-items: center;
  gap: .65rem;
}
.alloc-table__avatar {
  width: 34px; height: 34px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: .7rem; font-weight: 800; color: #fff; flex-shrink: 0;
}
.alloc-table__name { font-weight: 700; color: #111827; }
.alloc-table__role  { font-size: .72rem; color: #9ca3af; margin-top: .1rem; }
.alloc-table__projects { display: flex; flex-wrap: wrap; gap: .35rem; }
.alloc-table__chip {
  background: #f3f4f6;
  border-radius: 6px;
  padding: 2px 8px;
  font-size: .72rem;
  color: #4b5563;
}
.alloc-table__chip strong { color: #111827; }
.alloc-table__total { font-weight: 800; font-size: .9rem; }
.alloc-table__total--optimal { color: #16a34a; }
.alloc-table__total--warning { color: #d97706; }
.alloc-table__total--over    { color: #dc2626; }
.alloc-table__total--bench   { color: #6b7280; }
.alloc-table__badge {
  display: inline-block;
  font-size: .65rem;
  font-weight: 800;
  letter-spacing: .04em;
  text-transform: uppercase;
  border-radius: 6px;
  padding: 3px 10px;
}
.alloc-table__badge--optimal { background: #dcfce7; color: #166534; }
.alloc-table__badge--warning { background: #fef3c7; color: #92400e; }
.alloc-table__badge--over    { background: #fee2e2; color: #991b1b; }
.alloc-table__badge--bench   { background: #f3f4f6; color: #4b5563; }
</style>
