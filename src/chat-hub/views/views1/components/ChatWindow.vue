<template>
  <div class="chat-window">
    <template v-if="store.activeChat">
      <header class="chat-header">
        <div class="channel-info">
          <h2 class="channel-title">
            <span v-if="store.activeChat.type === 'channel'" class="hash">#</span>
            {{ store.activeChat.name }}
          </h2>
          <p v-if="store.activeChat.type === 'channel'" class="channel-desc">
            {{ store.activeChat.description }}
          </p>
          <p v-else class="channel-desc">
            <span :class="['status-dot', otherDmUser?.status]"></span>
            {{ otherDmUser?.status === 'online' ? 'Online' : 'Offline' }}
            <span v-if="otherDmUser?.role"> · {{ otherDmUser.role }}</span>
          </p>
        </div>
        <div class="header-actions">
          <button
            v-if="store.activeChat.type === 'channel'"
            class="members-btn"
            @click="openMembersDialog"
          >
            <i class="pi pi-users"></i>
            {{ store.activeChat.members.length }} Members
          </button>
          <button class="icon-btn" @click="toggleFavorite">
            <i :class="['pi', store.activeChat.isFavorited ? 'pi-star-fill favorited' : 'pi-star']"></i>
          </button>
        </div>
      </header>

      <div ref="messageListRef" class="message-list">
        <div class="date-separator"><span>TODAY</span></div>
        <MessageItem
          v-for="message in chatMessages"
          :key="message.id"
          :message="message"
          :users="store.users"
          @react="(emoji) => store.addReaction(message.id, emoji)"
        />
      </div>

      <div class="composer-wrap">
        <div class="composer">
          <div class="toolbar">
            <button class="tool-btn" title="Bold" @click="wrapSelection('**')"><i class="pi pi-bold"></i></button>
            <button class="tool-btn" title="Italic" @click="wrapSelection('*')"><i class="pi pi-italic"></i></button>
            <button class="tool-btn" title="Link" @click="insertLink"><i class="pi pi-link"></i></button>
            <button class="tool-btn" title="List" @click="insertList"><i class="pi pi-list"></i></button>
          </div>
          <div class="input-row">
            <textarea
              ref="textareaRef"
              v-model="messageText"
              class="message-input"
              :placeholder="inputPlaceholder"
              rows="2"
              @keydown.enter.exact.prevent="sendMessage"
              @keydown.enter.shift.exact="() => {}"
            ></textarea>
            <div class="input-actions">
              <input ref="fileInput" type="file" hidden multiple @change="handleFileUpload" />
              <button class="action-btn" title="Attach file" @click="fileInput?.click()">
                <i class="pi pi-paperclip"></i>
              </button>
              <button ref="emojiBtn" class="action-btn" title="Emoji" @click="toggleEmoji">
                <i class="pi pi-face-smile"></i>
              </button>
              <OverlayPanel ref="emojiPanel">
                <div class="emoji-grid">
                  <button
                    v-for="e in emojis"
                    :key="e"
                    class="emoji-btn"
                    @click="insertEmoji(e)"
                  >{{ e }}</button>
                </div>
              </OverlayPanel>
              <button class="action-btn" title="More options" @click="openQuickOptions">
                <i class="pi pi-plus"></i>
              </button>
              <button class="send-btn" title="Send" @click="sendMessage">
                <i class="pi pi-send"></i> Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="empty-state">
      <i class="pi pi-comments"></i>
      <p>Select a channel or conversation to start messaging</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import OverlayPanel from 'primevue/overlaypanel';
import { useDialog } from 'primevue/usedialog';
import { useChatHubStore } from '../../../application/chat-hub.store.js';
import MessageItem from './MessageItem.vue';
import MembersListDialog from './MembersListDialog.vue';
import QuickOptionsDialog from './QuickOptionsDialog.vue';

const store  = useChatHubStore();
const dialog = useDialog();

const messageListRef = ref(null);
const textareaRef    = ref(null);
const fileInput      = ref(null);
const emojiPanel     = ref(null);
const emojiBtn       = ref(null);
const uploadingFiles = ref([]);

const emojis = ['👍', '🚀', '❤️', '🔥', '😂', '👀', '✅', '🎉'];

const chatMessages = computed(() =>
  store.messagesForChat(store.activeChatId)
);

const messageText = computed({
  get: () => store.getDraft(store.activeChatId),
  set: (v) => store.setDraft(store.activeChatId, v),
});

const inputPlaceholder = computed(() => {
  const chat = store.activeChat;
  if (!chat) return 'Message...';
  return chat.type === 'channel' ? `Message #${chat.name}` : `Message ${chat.name}`;
});

const otherDmUser = computed(() => {
  const chat = store.activeChat;
  if (chat?.type !== 'dm') return null;
  const otherId = chat.members.find(id => id !== store.currentUserId);
  return store.users.find(u => u.id === otherId);
});

watch(() => store.activeChatId, () => {
  nextTick(scrollToBottom);
}, { immediate: true });

watch(chatMessages, () => nextTick(scrollToBottom), { deep: true });

function scrollToBottom() {
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
  }
}

function formatTime() {
  const now = new Date();
  const h = now.getHours() % 12 || 12;
  const m = String(now.getMinutes()).padStart(2, '0');
  const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
  return `${h}:${m} ${ampm}`;
}

function getFileIcon(name) {
  const ext = name.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (['xls', 'xlsx'].includes(ext)) return 'excel';
  if (['doc', 'docx'].includes(ext)) return 'doc';
  return 'file';
}

function sendMessage() {
  const text = messageText.value.trim();
  if (!text && uploadingFiles.value.length === 0) return;

  const attachments = uploadingFiles.value.map(f => ({
    name: f.name,
    icon: getFileIcon(f.name),
    type: getFileIcon(f.name),
    url: URL.createObjectURL(f),
  }));

  store.addMessage(store.activeChatId, {
    id: `msg-${Date.now()}`,
    chatId: store.activeChatId,
    authorId: store.currentUserId,
    timestamp: formatTime(),
    text,
    attachments,
    reactions: [],
  });

  store.setDraft(store.activeChatId, '');
  uploadingFiles.value = [];
  nextTick(scrollToBottom);
}

function toggleFavorite() {
  store.updateChat(store.activeChatId, 'isFavorited', !store.activeChat.isFavorited);
}

function openMembersDialog() {
  const chat = store.activeChat;
  dialog.open(MembersListDialog, {
    props: {
      header: `Members of #${chat.name}`,
      modal: true,
      style: { width: '400px' },
      chatMembers: chat.members.map(id => store.users.find(u => u.id === id)).filter(Boolean),
      allUsers: store.users,
      chatId: chat.id,
    },
    onClose: (options) => {
      if (options.data?.newMemberId) store.addMember(chat.id, options.data.newMemberId);
    },
  });
}

function handleFileUpload(e) {
  uploadingFiles.value = [...uploadingFiles.value, ...Array.from(e.target.files)];
  e.target.value = '';
}

function toggleEmoji(event) {
  emojiPanel.value?.toggle(event);
}

function insertEmoji(emoji) {
  messageText.value += emoji;
  emojiPanel.value?.hide();
}

function wrapSelection(wrapper) {
  const el = textareaRef.value;
  if (!el) return;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const sel = messageText.value.slice(start, end);
  const wrapped = `${wrapper}${sel || 'text'}${wrapper}`;
  messageText.value = messageText.value.slice(0, start) + wrapped + messageText.value.slice(end);
}

function insertLink() {
  messageText.value += '[link](https://)';
}

function insertList() {
  messageText.value += '\n• ';
}

function openQuickOptions() {
  dialog.open(QuickOptionsDialog, {
    props: { header: 'Quick Options', modal: true, style: { width: '300px' } },
    onClose: (options) => {
      if (options.data === 'attach-file') fileInput.value?.click();
    },
  });
}
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.channel-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 2px;
}

.hash { color: #64748b; font-weight: 600; }

.channel-desc {
  font-size: 12px;
  color: #64748b;
  margin: 4px 0 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #94a3b8;
}
.status-dot.online { background: #10b981; }

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.members-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
}
.members-btn:hover { background: #f8fafc; }

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  font-size: 18px;
  padding: 6px;
  border-radius: 6px;
}
.icon-btn:hover { background: #f1f5f9; color: #475569; }
.icon-btn .favorited { color: #f59e0b; }

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}

.date-separator {
  display: flex;
  align-items: center;
  margin: 8px 0 20px;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.date-separator::before,
.date-separator::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}
.date-separator span { padding: 0 16px; }

.composer-wrap {
  padding: 16px 24px 20px;
  flex-shrink: 0;
  border-top: 1px solid #f1f5f9;
}

.composer {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.toolbar {
  display: flex;
  gap: 4px;
  padding: 8px 12px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.tool-btn {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tool-btn:hover { background: #e2e8f0; color: #1e293b; }

.input-row {
  padding: 12px;
}

.message-input {
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  font-size: 14px;
  color: #1e293b;
  font-family: inherit;
  line-height: 1.5;
  min-height: 44px;
  box-sizing: border-box;
}
.message-input::placeholder { color: #94a3b8; }

.input-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 8px;
}

.action-btn {
  background: none;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}
.action-btn:hover { background: #f1f5f9; color: #2563eb; }

.send-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  margin-left: 4px;
}
.send-btn:hover { background: #1d4ed8; }

.emoji-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  max-width: 200px;
}

.emoji-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}
.emoji-btn:hover { background: #f1f5f9; }

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  gap: 12px;
}
.empty-state i { font-size: 48px; }
</style>
