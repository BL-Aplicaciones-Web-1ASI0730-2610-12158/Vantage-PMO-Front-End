import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { chatHubApi } from '../infrastructure/chat-hub-api.js';
import { CHAT_SEED } from '../infrastructure/chat-seed.js';
import { loadChatState, saveChatState } from '../infrastructure/chat-storage.js';
import { ChatUserAssembler } from '../infrastructure/chat-user.assembler.js';
import { ChatAssembler } from '../infrastructure/chat.assembler.js';
import { ChatMessageAssembler } from '../infrastructure/chat-message.assembler.js';
import { PinnedAssetAssembler } from '../infrastructure/pinned-asset.assembler.js';
import { ChatInsightAssembler } from '../infrastructure/chat-insight.assembler.js';
import { ChatMessage } from '../domain/model/chat-message.entity.js';

/**
 * Chat Hub application store — orchestrates chat use-cases.
 */
export const useChatHubStore = defineStore('chatHub', () => {
    const users         = ref(ChatUserAssembler.toEntities(CHAT_SEED.users));
    const chats         = ref(ChatAssembler.toEntities(CHAT_SEED.chats));
    const messages      = ref(ChatMessageAssembler.toEntities(CHAT_SEED.messages));
    const pinnedAssets  = ref(PinnedAssetAssembler.toEntities(CHAT_SEED.pinnedAssets));
    const insights      = ref(ChatInsightAssembler.toEntity(CHAT_SEED.insights));
    const activeChatId  = ref('pmo-strategic-alignment');
    const currentUserId = ref('alex');
    const loading       = ref(false);
    const initialized   = ref(false);
    const drafts        = ref({});

    const activeChat = computed(() => chats.value.find(c => c.id === activeChatId.value));

    function messagesForChat(chatId) {
        return messages.value.filter(m => m.chatId === chatId);
    }

    function assetsForChat(chatId) {
        return pinnedAssets.value.filter(a => a.chatId === chatId);
    }

    function persist() {
        saveChatState({
            chats: chats.value,
            messages: messages.value,
            activeChatId: activeChatId.value,
            users: users.value,
        });
    }

    function applyStoredState(stored) {
        if (!stored) return;
        if (stored.chats?.length)        chats.value        = ChatAssembler.toEntities(stored.chats);
        if (stored.messages?.length)     messages.value     = ChatMessageAssembler.toEntities(stored.messages);
        if (stored.activeChatId)         activeChatId.value = stored.activeChatId;
        if (stored.users?.length)        users.value        = ChatUserAssembler.toEntities(stored.users);
    }

    async function initialize() {
        if (initialized.value) return;
        loading.value = true;

        const stored = loadChatState();
        if (stored?.messages?.length) applyStoredState(stored);

        try {
            const [apiUsers, apiChats, apiMessages] = await Promise.all([
                chatHubApi.getUsers().catch(() => null),
                chatHubApi.getChats().catch(() => null),
                chatHubApi.getMessages().catch(() => null),
            ]);

            if (apiUsers?.length)  users.value = apiUsers;
            if (apiChats?.length)  chats.value = apiChats;
            if (apiMessages?.length && !stored?.messages?.length) messages.value = apiMessages;

            await loadContextForChat(activeChatId.value);
        } catch { /* seed / stored data */ }

        persist();
        initialized.value = true;
        loading.value = false;
    }

    async function loadContextForChat(chatId) {
        const [assets, insightData] = await Promise.all([
            chatHubApi.getPinnedAssets(chatId).catch(() => null),
            chatHubApi.getInsights(chatId).catch(() => null),
        ]);
        if (assets?.length) pinnedAssets.value = assets;
        if (insightData?.length) insights.value = insightData[0];
    }

    function setActiveChat(chatId) {
        activeChatId.value = chatId;
        persist();
        loadContextForChat(chatId);
    }

    function addMessage(chatId, messageData) {
        const message = messageData instanceof ChatMessage
            ? messageData
            : new ChatMessage({ ...messageData, chatId });
        messages.value.push(message);
        persist();
        chatHubApi.createMessage(message).catch(() => {});
    }

    function updateChat(chatId, key, value) {
        const chat = chats.value.find(c => c.id === chatId);
        if (!chat) return;
        chat[key] = value;
        persist();
        chatHubApi.updateChat(chatId, { [key]: value }).catch(() => {});
    }

    function addChat(newChat) {
        const chat = ChatAssembler.toEntity(newChat);
        chats.value.push(chat);
        activeChatId.value = chat.id;
        persist();
        chatHubApi.createChat(chat).catch(() => {});
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
        users,
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
