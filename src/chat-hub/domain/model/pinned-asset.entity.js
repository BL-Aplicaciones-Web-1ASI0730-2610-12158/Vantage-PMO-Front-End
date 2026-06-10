/** File pinned to a chat channel. */
export class PinnedAsset {
    constructor({ id, chatId, name, type, meta }) {
        this.id     = id;
        this.chatId = chatId;
        this.name   = name;
        this.type   = type;
        this.meta   = meta ?? '';
    }
}
