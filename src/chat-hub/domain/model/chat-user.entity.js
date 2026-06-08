/** Chat user in the Chat Hub bounded context. */
export class ChatUser {
    constructor({ id, name, avatarSeed, avatar, status, role }) {
        this.id         = id;
        this.name       = name;
        this.avatarSeed = avatarSeed ?? id;
        this.avatar     = avatar ?? null;
        this.status     = status ?? 'offline';
        this.role       = role ?? '';
    }

    get avatarUrl() {
        return this.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.avatarSeed}`;
    }
}
