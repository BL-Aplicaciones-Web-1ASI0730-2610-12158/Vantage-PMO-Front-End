import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';
import { ChatUserAssembler } from './chat-user.assembler.js';
import { ChatAssembler } from './chat.assembler.js';
import { ChatMessageAssembler } from './chat-message.assembler.js';
import { PinnedAssetAssembler } from './pinned-asset.assembler.js';
import { ChatInsightAssembler } from './chat-insight.assembler.js';

/**
 * Chat Hub API — infrastructure gateway for the chat bounded context.
 */
class ChatHubApi {
    constructor() {
        this.api = new BaseEndpoint('/chat-users').api;
        this.usersPath    = import.meta.env.VITE_CHAT_USERS_ENDPOINT_PATH        || '/chat-users';
        this.chatsPath    = import.meta.env.VITE_CHATS_ENDPOINT_PATH             || '/chats';
        this.messagesPath = import.meta.env.VITE_CHAT_MESSAGES_ENDPOINT_PATH     || '/chat-messages';
        this.assetsPath   = import.meta.env.VITE_CHAT_PINNED_ASSETS_ENDPOINT_PATH || '/chat-pinned-assets';
        this.insightsPath = import.meta.env.VITE_CHAT_INSIGHTS_ENDPOINT_PATH     || '/chat-insights';
    }

    async getUsers() {
        const data = await this.api.get(this.usersPath).then(r => r.data);
        return ChatUserAssembler.toEntities(data);
    }

    async getChats() {
        const data = await this.api.get(this.chatsPath).then(r => r.data);
        return ChatAssembler.toEntities(data);
    }

    async getMessages() {
        const data = await this.api.get(this.messagesPath).then(r => r.data);
        return ChatMessageAssembler.toEntities(data);
    }

    async createMessage(message) {
        const payload = message instanceof Object && message.chatId
            ? ChatMessageAssembler.toResource(message)
            : message;
        const data = await this.api.post(this.messagesPath, payload).then(r => r.data);
        return ChatMessageAssembler.toEntity(data);
    }

    async updateChat(id, data) {
        const raw = await this.api.patch(`${this.chatsPath}/${id}`, data).then(r => r.data);
        return ChatAssembler.toEntity(raw);
    }

    async createChat(chat) {
        const payload = chat.members ? ChatAssembler.toResource(chat) : chat;
        const data = await this.api.post(this.chatsPath, payload).then(r => r.data);
        return ChatAssembler.toEntity(data);
    }

    async getPinnedAssets(chatId) {
        const data = await this.api.get(this.assetsPath, { params: { chatId } }).then(r => r.data);
        return PinnedAssetAssembler.toEntities(data);
    }

    async getInsights(chatId) {
        const data = await this.api.get(this.insightsPath, { params: { chatId } }).then(r => r.data);
        return ChatInsightAssembler.toEntities(data);
    }
}

export const chatHubApi = new ChatHubApi();
