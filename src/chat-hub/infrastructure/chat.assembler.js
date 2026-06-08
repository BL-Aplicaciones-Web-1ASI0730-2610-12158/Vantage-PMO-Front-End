import { Chat } from '../domain/model/chat.entity.js';

export class ChatAssembler {
    static toEntity(resource) {
        return new Chat(resource);
    }

    static toEntities(resources) {
        return (resources ?? []).map(ChatAssembler.toEntity);
    }

    static toResource(entity) {
        return {
            id: entity.id,
            name: entity.name,
            type: entity.type,
            description: entity.description,
            members: entity.members,
            isFavorited: entity.isFavorited,
        };
    }
}
