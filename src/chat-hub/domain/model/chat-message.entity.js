/** Message posted in a chat channel or DM. */
export class ChatMessage {
    constructor({ id, chatId, authorId, timestamp, text, attachments, reactions }) {
        this.id          = id;
        this.chatId      = chatId;
        this.authorId    = authorId;
        this.timestamp   = timestamp;
        this.text        = text ?? '';
        this.attachments = attachments ?? [];
        this.reactions   = reactions ?? [];
    }
}
