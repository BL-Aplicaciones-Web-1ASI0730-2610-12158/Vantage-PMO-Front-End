const STORAGE_KEY = 'vantage-chat-hub-state';

export function loadChatState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function saveChatState({ chats, messages, activeChatId, users }) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ chats, messages, activeChatId, users }));
}
