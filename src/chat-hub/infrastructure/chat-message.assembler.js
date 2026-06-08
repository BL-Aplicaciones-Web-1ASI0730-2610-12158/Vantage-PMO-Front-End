import { ChatMessage } from '../domain/model/chat-message.entity.js';

export class ChatMessageAssembler {
    static toEntity(resource) {
        return new ChatMessage(resource);
    }

    static toEntities(resources) {
        return (resources ?? []).map(ChatMessageAssembler.toEntity);
    }

    static toResource(entity) {
        return {
            id: entity.id,
            chatId: entity.chatId,
            authorId: entity.authorId,
            timestamp: entity.timestamp,
            text: entity.text,
            attachments: entity.attachments,
            reactions: entity.reactions,
        };
    }
}
