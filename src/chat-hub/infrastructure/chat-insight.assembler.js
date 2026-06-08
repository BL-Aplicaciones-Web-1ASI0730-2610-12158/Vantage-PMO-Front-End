import { ChatInsight } from '../domain/model/chat-insight.entity.js';

export class ChatInsightAssembler {
    static toEntity(resource) {
        return new ChatInsight(resource);
    }

    static toEntities(resources) {
        return (resources ?? []).map(ChatInsightAssembler.toEntity);
    }
}
