import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { chatHubApi } from '../infrastructure/chat-hub-api.js';

const STORAGE_KEY = 'vantage-chat-hub-state';

function avatarUrl(seed) {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
}

const SEED_USERS = [
    { id: 'alex', name: 'Alex Sterling', avatarSeed: 'Alex', status: 'online', role: 'Precision Lead' },
    { id: 'elena', name: 'Elena L.', avatarSeed: 'Elena', status: 'online', role: 'Senior Analyst' },
    { id: 'sarah', name: 'Sarah Jenkins', avatarSeed: 'Sarah', status: 'online', role: 'CTO' },
    { id: 'david', name: 'David Chen', avatarSeed: 'David', status: 'offline', role: 'Risk Manager' },
    { id: 'anna', name: 'Anna K.', avatarSeed: 'Anna', status: 'online', role: 'Budget Analyst' },
    { id: 'marcus', name: 'Marcus Vane', avatarSeed: 'Marcus', status: 'online', role: 'Senior Director' },
];

const SEED_CHATS = [
    { id: 'pmo-strategic-alignment', name: 'pmo-strategic-alignment', type: 'channel', description: 'Strategic discussions for Q3 planning and executive alignment.', members: ['alex', 'elena', 'sarah', 'david', 'marcus'], isFavorited: false },
    { id: 'budget-steering-comm', name: 'budget-steering-comm', type: 'channel', description: 'Discussions for budget steering committee.', members: ['alex', 'anna', 'marcus'], isFavorited: false },
    { id: 'risk-mitigation-log', name: 'risk-mitigation-log', type: 'channel', description: 'Logging and mitigation strategies for project risks.', members: ['alex', 'david'], isFavorited: false },
    { id: 'sarah-dm', name: 'Sarah Jenkins', type: 'dm', members: ['alex', 'sarah'], isFavorited: false },
    { id: 'david-dm', name: 'David Chen', type: 'dm', members: ['alex', 'david'], isFavorited: false },
];

const SEED_MESSAGES = [
    { id: 'msg1', chatId: 'pmo-strategic-alignment', authorId: 'alex', timestamp: '10:30 AM', text: "Team, great progress on the Q3 planning. Let's ensure all strategic alignment documents are finalized by end of day.", attachments: [], reactions: [{ emoji: '👍', count: 3 }] },
    { id: 'msg2', chatId: 'pmo-strategic-alignment', authorId: 'elena', timestamp: '10:35 AM', text: "Agreed, Alex. I'm currently reviewing the resource_reallocation_impact.pdf. It looks solid.", attachments: [{ name: 'resource_reallocation_impact.pdf', icon: 'pdf', type: 'pdf' }], reactions: [{ emoji: '🚀', count: 1 }] },
    { id: 'msg3', chatId: 'pmo-strategic-alignment', authorId: 'alex', timestamp: '10:40 AM', text: "Excellent, Elena. Once you're done, please upload the final version to the shared drive.", attachments: [], reactions: [] },
    { id: 'msg4', chatId: 'sarah-dm', authorId: 'sarah', timestamp: '11:00 AM', text: 'Hi Alex, can we discuss the Q3 budget adjustments later today?', attachments: [], reactions: [] },
    { id: 'msg5', chatId: 'sarah-dm', authorId: 'alex', timestamp: '11:05 AM', text: "Sure, Sarah. I'm free after 2 PM. Let me know what time works best for you.", attachments: [], reactions: [] },
];

const SEED_ASSETS = [
    { id: 1, chatId: 'pmo-strategic-alignment', name: 'master_pmo_roadmap_v2.xls', type: 'excel', meta: 'Modified 2h ago' },
    { id: 2, chatId: 'pmo-strategic-alignment', name: 'strategic_alignment_brief.pdf', type: 'pdf', meta: 'Pinned by Alex' },
];

const SEED_INSIGHTS = {
    meetingTag: 'RECENT MEETING',
    timeAgo: '45m ago',
    meetingTitle: 'Q3 Planning Sync: Steering Committee',
    insights: [
        { id: 1, type: 'Decision', text: 'Approved 12% budget shift to infrastructure phase.' },
        { id: 2, type: 'Action', text: 'Elena to finalize Gantt by EOD Friday.' },
    ],
    sentimentProductive: 90,
    sentimentText: 'Productive',
};

function enrichUsers(raw) {
    return raw.map(u => ({ ...u, avatar: u.avatar || avatarUrl(u.avatarSeed || u.id) }));
}

function loadFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function saveToStorage(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        chats: state.chats,
        messages: state.messages,
        activeChatId: state.activeChatId,
        users: state.users,
    }));
}

export const useChatHubStore = defineStore('chatHub', () => {
    const users        = ref(enrichUsers(SEED_USERS));
    const chats        = ref([...SEED_CHATS]);
    const messages     = ref([...SEED_MESSAGES]);
    const pinnedAssets = ref([...SEED_ASSETS]);
    const insights     = ref({ ...SEED_INSIGHTS });
    const activeChatId = ref('pmo-strategic-alignment');
    const currentUserId = ref('alex');
    const loading      = ref(false);
    const initialized  = ref(false);
    const drafts       = ref({});

    const usersWithAvatar = computed(() => users.value);

    const activeChat = computed(() => chats.value.find(c => c.id === activeChatId.value));

    function messagesForChat(chatId) {
        return messages.value.filter(m => m.chatId === chatId);
    }

    function assetsForChat(chatId) {
        return pinnedAssets.value.filter(a => a.chatId === chatId);
    }

    function persist() {
        saveToStorage({
            chats: chats.value,
            messages: messages.value,
            activeChatId: activeChatId.value,
            users: users.value,
        });
    }

    async function initialize() {
        if (initialized.value) return;
        loading.value = true;

        const stored = loadFromStorage();
        if (stored?.messages?.length) {
            chats.value        = stored.chats        ?? chats.value;
            messages.value     = stored.messages     ?? messages.value;
            activeChatId.value = stored.activeChatId ?? activeChatId.value;
            if (stored.users?.length) users.value = enrichUsers(stored.users);
        }

        try {
            const [apiUsers, apiChats, apiMessages] = await Promise.all([
                chatHubApi.getUsers().catch(() => null),
                chatHubApi.getChats().catch(() => null),
                chatHubApi.getMessages().catch(() => null),
            ]);

            if (apiUsers?.length)  users.value    = enrichUsers(apiUsers);
            if (apiChats?.length)  chats.value    = apiChats;
            if (apiMessages?.length && !stored?.messages?.length) {
                messages.value = apiMessages;
            }

            if (activeChatId.value) {
                const assets = await chatHubApi.getPinnedAssets(activeChatId.value).catch(() => null);
                if (assets?.length) pinnedAssets.value = assets;

                const insightData = await chatHubApi.getInsights(activeChatId.value).catch(() => null);
                if (insightData?.length) insights.value = insightData[0];
            }
        } catch { /* use local/stored data */ }

        persist();
        initialized.value = true;
        loading.value = false;
    }

    function setActiveChat(chatId) {
        if (drafts.value[activeChatId.value] === undefined) {
            drafts.value[activeChatId.value] = '';
        }
        activeChatId.value = chatId;
        persist();
        loadInsightsForChat(chatId);
        loadAssetsForChat(chatId);
    }

    async function loadInsightsForChat(chatId) {
        try {
            const data = await chatHubApi.getInsights(chatId);
            if (data?.length) insights.value = data[0];
        } catch { /* keep current */ }
    }

    async function loadAssetsForChat(chatId) {
        try {
            const data = await chatHubApi.getPinnedAssets(chatId);
            if (data?.length) pinnedAssets.value = data;
        } catch { /* keep seed */ }
    }

    function addMessage(chatId, message) {
        messages.value.push(message);
        persist();
        chatHubApi.createMessage(message).catch(() => {});
    }

    function updateChat(chatId, key, value) {
        const chat = chats.value.find(c => c.id === chatId);
        if (chat) {
            chat[key] = value;
            persist();
            chatHubApi.updateChat(chatId, { [key]: value }).catch(() => {});
        }
    }

    function addChat(newChat) {
        chats.value.push(newChat);
        persist();
        chatHubApi.createChat(newChat).catch(() => {});
        activeChatId.value = newChat.id;
    }

    function addMember(chatId, userId) {
        const chat = chats.value.find(c => c.id === chatId);
        if (chat && !chat.members.includes(userId)) {
            chat.members.push(userId);
            persist();
            chatHubApi.updateChat(chatId, { members: chat.members }).catch(() => {});
        }
    }

    function addReaction(messageId, emoji) {
        const msg = messages.value.find(m => m.id === messageId);
        if (!msg) return;
        if (!msg.reactions) msg.reactions = [];
        const existing = msg.reactions.find(r => r.emoji === emoji);
        if (existing) existing.count++;
        else msg.reactions.push({ emoji, count: 1 });
        persist();
    }

    function getDraft(chatId) {
        return drafts.value[chatId] ?? '';
    }

    function setDraft(chatId, text) {
        drafts.value[chatId] = text;
    }

    return {
        users: usersWithAvatar,
        chats,
        messages,
        pinnedAssets,
        insights,
        activeChatId,
        activeChat,
        currentUserId,
        loading,
        initialized,
        initialize,
        setActiveChat,
        messagesForChat,
        assetsForChat,
        addMessage,
        updateChat,
        addChat,
        addMember,
        addReaction,
        getDraft,
        setDraft,
        persist,
    };
});
