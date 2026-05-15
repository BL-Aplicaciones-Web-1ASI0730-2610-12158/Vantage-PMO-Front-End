import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { taskCollaborationApi, boardsApi, boardMembersApi } from '../infrastructure/task-collaboration-api.js';

export const useTaskCollaborationStore = defineStore('task-collaboration', () => {

    const boards        = ref([]);
    const tasks         = ref([]);
    const members       = ref([]);
    const loading       = ref(false);
    const activeBoardId = ref(null);

    async function fetchBoards() {
        loading.value = true;
        try {
            boards.value = await boardsApi.getAll();
            if (boards.value.length && !activeBoardId.value) {
                activeBoardId.value = boards.value[0].id;
            }
        } finally { loading.value = false; }
    }

    async function fetchTasksByBoard(boardId) {
        loading.value = true;
        try {
            tasks.value   = await taskCollaborationApi.getTasksByBoard(boardId);
            members.value = await boardMembersApi.getByBoard(boardId);
        } finally { loading.value = false; }
    }

    async function selectBoard(boardId) {
        activeBoardId.value = boardId;
        await fetchTasksByBoard(boardId);
    }

    async function createTask(data) {
        const created = await taskCollaborationApi.createTask({ ...data, boardId: activeBoardId.value });
        tasks.value.push(created);
        return created;
    }

    async function moveTask(task, newStatus) {
        task.status = newStatus;
        await taskCollaborationApi.updateTask(task.id, task);
    }

    async function toggleTask(task) {
        task.completed = !task.completed;
        await taskCollaborationApi.updateTask(task.id, task);
    }

    async function updateStatus(task, status) {
        task.status = status;
        await taskCollaborationApi.updateTask(task.id, task);
    }

    const activeBoard = computed(() =>
        boards.value.find(b => b.id === activeBoardId.value) ?? null
    );

    const progress = computed(() => {
        if (!tasks.value.length) return 0;
        const completed = tasks.value.filter(t => t.completed).length;
        return Math.round((completed / tasks.value.length) * 100);
    });

    return {
        boards, tasks, members, loading, activeBoardId, activeBoard,
        progress, fetchBoards, fetchTasksByBoard, selectBoard,
        createTask, moveTask, toggleTask, updateStatus
    };
});
