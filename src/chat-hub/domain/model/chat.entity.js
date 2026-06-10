/** Channel or direct-message conversation. */
export class Chat {
    constructor({ id, name, type, description, members, isFavorited }) {
        this.id          = id;
        this.name        = name;
        this.type        = type;
        this.description = description ?? '';
        this.members     = members ?? [];
        this.isFavorited = isFavorited ?? false;
    }

    get isChannel() {
        return this.type === 'channel';
    }

    get isDm() {
        return this.type === 'dm';
    }
}
