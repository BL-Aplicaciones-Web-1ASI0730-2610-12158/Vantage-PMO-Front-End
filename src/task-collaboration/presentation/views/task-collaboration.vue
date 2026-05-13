<script setup>
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTaskCollaborationStore }
  from '../../application/task-collaboration.store.js';

const { t } = useI18n();

const store = useTaskCollaborationStore();

onMounted(() => store.fetchTasks());

const todoTasks = computed(() =>
    store.tasks.filter(t => t.status === 'To Do')
);

const progressTasks = computed(() =>
    store.tasks.filter(t => t.status === 'In Progress')
);

const doneTasks = computed(() =>
    store.tasks.filter(t => t.status === 'Done')
);

function onDragStart(event, task) {
  event.dataTransfer.setData(
      'taskId',
      task.id
  );
}

async function onDrop(event, status) {

  const taskId =
      Number(event.dataTransfer.getData('taskId'));

  const task =
      store.tasks.find(t => t.id === taskId);

  if (task) {
    await store.moveTask(task, status);
  }
}
</script>

<template>

  <div class="tasks-page">

    <div class="tasks-header">

      <div>
        <h1 class="tasks-title">
          {{ t('taskCollaboration.title') }}
        </h1>

        <p class="tasks-subtitle">
          {{ t('taskCollaboration.subtitle') }}
        </p>
      </div>

      <div class="progress-card">
            <span>
                {{ t('taskCollaboration.progress') }}
            </span>

        <h2>
          {{ store.progress }}%
        </h2>
      </div>

    </div>

    <div class="kanban-board">

      <!-- TO DO -->
      <div
          class="kanban-column"
          @dragover.prevent
          @drop="onDrop($event, 'To Do')"
      >

        <h2>
          {{ t('taskCollaboration.columns.todo') }}
        </h2>

        <div
            v-for="task in todoTasks"
            :key="task.id"
            class="task-card"
            draggable="true"
            @dragstart="onDragStart($event, task)"
        >

          <div class="task-top">

            <pv-checkbox
                binary
                :modelValue="task.completed"
                @update:modelValue="
                            store.toggleTask(task)
                        "
            />

            <span
                class="task-title"
                :class="{ completed: task.completed }"
            >
                        {{ task.title }}
                    </span>

          </div>

          <p class="task-description">
            {{ task.description }}
          </p>

          <div class="task-footer">

                    <span class="task-assignee">
                        {{ task.assignee }}
                    </span>

            <pv-select
                :modelValue="task.status"
                optionLabel="label"
                optionValue="value"
                :options="[
                  {
                    label: t('taskCollaboration.columns.todo'),
                    value: 'To Do'
                  },
                  {
                    label: t('taskCollaboration.columns.inProgress'),
                    value: 'In Progress'
                  },
                  {
                    label: t('taskCollaboration.columns.done'),
                    value: 'Done'
                  }
                ]"
                @update:modelValue="
                            store.updateStatus(task, $event)
                        "
            />

          </div>

        </div>

      </div>

      <!-- IN PROGRESS -->
      <div
          class="kanban-column"
          @dragover.prevent
          @drop="onDrop($event, 'In Progress')"
      >

        <h2>
          {{ t('taskCollaboration.columns.inProgress') }}
        </h2>

        <div
            v-for="task in progressTasks"
            :key="task.id"
            class="task-card"
            draggable="true"
            @dragstart="onDragStart($event, task)"
        >

          <div class="task-top">

            <pv-checkbox
                binary
                :modelValue="task.completed"
                @update:modelValue="
                            store.toggleTask(task)
                        "
            />

            <span
                class="task-title"
                :class="{ completed: task.completed }"
            >
                        {{ task.title }}
                    </span>

          </div>

          <p class="task-description">
            {{ task.description }}
          </p>

          <div class="task-footer">

                    <span class="task-assignee">
                        {{ task.assignee }}
                    </span>

            <pv-select
                :modelValue="task.status"
                optionLabel="label"
                optionValue="value"
                :options="[
                  {
                    label: t('taskCollaboration.columns.todo'),
                    value: 'To Do'
                  },
                  {
                    label: t('taskCollaboration.columns.inProgress'),
                    value: 'In Progress'
                  },
                  {
                    label: t('taskCollaboration.columns.done'),
                    value: 'Done'
                  }
                ]"
                @update:modelValue="
                            store.updateStatus(task, $event)
                        "
            />

          </div>

        </div>

      </div>

      <!-- DONE -->
      <div
          class="kanban-column"
          @dragover.prevent
          @drop="onDrop($event, 'Done')"
      >

        <h2>
          {{ t('taskCollaboration.columns.done') }}
        </h2>

        <div
            v-for="task in doneTasks"
            :key="task.id"
            class="task-card"
            draggable="true"
            @dragstart="onDragStart($event, task)"
        >

          <div class="task-top">

            <pv-checkbox
                binary
                :modelValue="task.completed"
                @update:modelValue="
                            store.toggleTask(task)
                        "
            />

            <span
                class="task-title"
                :class="{ completed: task.completed }"
            >
                        {{ task.title }}
                    </span>

          </div>

          <p class="task-description">
            {{ task.description }}
          </p>

          <div class="task-footer">

                    <span class="task-assignee">
                        {{ task.assignee }}
                    </span>

            <pv-select
                :modelValue="task.status"
                optionLabel="label"
                optionValue="value"
                :options="[
                  {
                    label: t('taskCollaboration.columns.todo'),
                    value: 'To Do'
                  },
                  {
                    label: t('taskCollaboration.columns.inProgress'),
                    value: 'In Progress'
                  },
                  {
                    label: t('taskCollaboration.columns.done'),
                    value: 'Done'
                  }
                ]"
                @update:modelValue="
                            store.updateStatus(task, $event)
                        "
            />

          </div>

        </div>

      </div>

    </div>

  </div>

</template>

<style scoped>
.tasks-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tasks-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
}

.tasks-subtitle {
  color: #64748b;
}

.progress-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  min-width: 180px;
}

.progress-card span {
  color: #64748b;
}

.progress-card h2 {
  margin: 10px 0 0;
  font-size: 32px;
}

.kanban-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.kanban-column {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  min-height: 500px;
}

.task-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 14px;
  border: 1px solid #e2e8f0;
  cursor: grab;
}

.task-top {
  display: flex;
  gap: 10px;
  align-items: center;
}

.task-title {
  font-weight: 600;
}

.completed {
  text-decoration: line-through;
  opacity: 0.6;
}

.task-description {
  color: #64748b;
  font-size: 14px;
}

.task-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-assignee {
  font-size: 13px;
  font-weight: 600;
}
</style>