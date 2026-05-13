import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { taskCollaborationApi } from '../infrastructure/task-collaboration-api.js';

export const useTaskCollaborationStore = defineStore(
    'task-collaboration',
    () => {

        const tasks = ref([]);
        const loading = ref(false);

        async function fetchTasks() {
            loading.value = true;

            try {
                tasks.value =
                    await taskCollaborationApi.getAllTasks();
            }
            finally {
                loading.value = false;
            }
        }

        async function moveTask(task, newStatus) {

            task.status = newStatus;

            await taskCollaborationApi.updateTask(
                task.id,
                task
            );
        }

        async function toggleTask(task) {

            task.completed = !task.completed;

            await taskCollaborationApi.updateTask(
                task.id,
                task
            );
        }

        async function updateStatus(task, status) {

            task.status = status;

            await taskCollaborationApi.updateTask(
                task.id,
                task
            );
        }

        const progress = computed(() => {

            if (!tasks.value.length) return 0;

            const completed =
                tasks.value.filter(t => t.completed).length;

            return Math.round(
                (completed / tasks.value.length) * 100
            );
        });

        return {
            tasks,
            loading,
            progress,
            fetchTasks,
            moveTask,
            toggleTask,
            updateStatus
        };
    }
);