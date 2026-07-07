import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { meetingsApi } from '../infrastructure/meetings-api.js';

export const useMeetingsStore = defineStore('meetings', () => {
    const meetings = ref([]);
    const loading = ref(false);
    const actionLoading = ref(false);

    const upcomingMeetings = computed(() =>
        meetings.value.filter(m => m.status === 'Upcoming')
    );

    const completedMeetings = computed(() =>
        meetings.value.filter(m => m.status === 'Completed')
    );

    function upsertMeeting(meeting) {
        const index = meetings.value.findIndex(item => item.id === meeting.id);
        if (index === -1) {
            meetings.value.unshift(meeting);
            return;
        }
        meetings.value[index] = meeting;
    }

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
        upsertMeeting(created);
        return created;
    }

    async function convertAgreementToTask(meetingId, agreementId) {
        actionLoading.value = true;
        try {
            const result = await meetingsApi.convertAgreementToTask(meetingId, agreementId);
            upsertMeeting(result.meeting);
            return result;
        } finally {
            actionLoading.value = false;
        }
    }

    async function exportMinutes(meetingId, options) {
        return meetingsApi.exportMinutes(meetingId, options);
    }

    return {
        meetings,
        loading,
        actionLoading,
        upcomingMeetings,
        completedMeetings,
        fetchMeetings,
        scheduleMeeting,
        convertAgreementToTask,
        exportMinutes,
    };
});
