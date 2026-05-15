import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { meetingsApi } from '../infrastructure/meetings-api.js';

export const useMeetingsStore = defineStore('meetings', () => {
    const meetings = ref([]);
    const loading = ref(false);

    const upcomingMeetings = computed(() =>
        meetings.value.filter(m => m.status === 'Upcoming')
    );

    const completedMeetings = computed(() =>
        meetings.value.filter(m => m.status === 'Completed')
    );

    async function fetchMeetings() {
        loading.value = true;
        try {
            meetings.value = await meetingsApi.getAllMeetings();
        } finally {
            loading.value = false;
        }
    }

    async function scheduleMeeting(payload) {
        const created = await meetingsApi.createMeeting(payload);
        meetings.value.unshift(created);
        return created;
    }

    return { meetings, loading, upcomingMeetings, completedMeetings, fetchMeetings, scheduleMeeting };
});
