import { ChatUser } from '../domain/model/chat-user.entity.js';

export class ChatUserAssembler {
    static toEntity(resource) {
        const user = new ChatUser(resource);
        if (!user.avatar) user.avatar = user.avatarUrl;
        return user;
    }

    static toEntities(resources) {
        return (resources ?? []).map(ChatUserAssembler.toEntity);
    }
}
