import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

class ChatHubApi {
    constructor() {
        this.api = new BaseEndpoint('/chat-users').api;
        this.usersPath       = import.meta.env.VITE_CHAT_USERS_ENDPOINT_PATH       || '/chat-users';
        this.chatsPath       = import.meta.env.VITE_CHATS_ENDPOINT_PATH            || '/chats';
        this.messagesPath    = import.meta.env.VITE_CHAT_MESSAGES_ENDPOINT_PATH    || '/chat-messages';
        this.assetsPath      = import.meta.env.VITE_CHAT_PINNED_ASSETS_ENDPOINT_PATH || '/chat-pinned-assets';
        this.insightsPath    = import.meta.env.VITE_CHAT_INSIGHTS_ENDPOINT_PATH    || '/chat-insights';
    }

    getUsers() {
        return this.api.get(this.usersPath).then(r => r.data);
    }

    getChats() {
        return this.api.get(this.chatsPath).then(r => r.data);
    }

    getMessages() {
        return this.api.get(this.messagesPath).then(r => r.data);
    }

    createMessage(message) {
        return this.api.post(this.messagesPath, message).then(r => r.data);
    }

    updateChat(id, data) {
        return this.api.patch(`${this.chatsPath}/${id}`, data).then(r => r.data);
    }

    createChat(chat) {
        return this.api.post(this.chatsPath, chat).then(r => r.data);
    }

    getPinnedAssets(chatId) {
        return this.api.get(this.assetsPath, { params: { chatId } }).then(r => r.data);
    }

    getInsights(chatId) {
        return this.api.get(this.insightsPath, { params: { chatId } }).then(r => r.data);
    }
}

export const chatHubApi = new ChatHubApi();
