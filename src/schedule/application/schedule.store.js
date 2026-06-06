import { defineStore } from 'pinia';
import { ref } from 'vue';
import { scheduleApi } from '../infrastructure/schedule-api.js';

export const useScheduleStore = defineStore('schedule', () => {
    const items = ref([]);
    const loading = ref(false);

    async function fetchItems() {
        loading.value = true;
        try {
            items.value = await scheduleApi.getAllItems();
        } finally {
            loading.value = false;
        }
    }

    return { items, loading, fetchItems };
});
