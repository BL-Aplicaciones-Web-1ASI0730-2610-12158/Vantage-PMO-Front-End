import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supportApi } from '../infrastructure/support-api.js';

export const useSupportStore = defineStore('support', () => {
    const tickets = ref([]);
    const loading = ref(false);

    const openTickets       = computed(() => tickets.value.filter(t => t.status === 'Open'));
    const inProgressTickets = computed(() => tickets.value.filter(t => t.status === 'In Progress'));
    const resolvedTickets   = computed(() => tickets.value.filter(t => t.status === 'Resolved'));

    async function fetchTickets() {
        loading.value = true;
        try { tickets.value = await supportApi.getAllTickets(); }
        finally { loading.value = false; }
    }

    async function submitTicket(ticket) {
        const created = await supportApi.createTicket({
            ...ticket,
            status: 'Open',
            createdAt: new Date().toISOString().split('T')[0],
            assignee: 'Support Team'
        });
        tickets.value.unshift(created);
    }

    async function updateTicketStatus(ticket, status) {
        ticket.status = status;
        await supportApi.updateTicket(ticket.id, ticket);
    }

    return { tickets, loading, openTickets, inProgressTickets, resolvedTickets,
             fetchTickets, submitTicket, updateTicketStatus };
});


