<template>
  <div class="channel-sidebar">
    <div class="search-box">
      <i class="pi pi-search"></i>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search discussions or files..."
      />
    </div>

    <section class="channels-section">
      <div class="section-header">
        <h3 class="section-title">CHANNELS</h3>
        <button class="add-btn" title="Create new channel" @click="openCreateChatDialog(true)">
          <i class="pi pi-plus"></i>
        </button>
      </div>
      <ul class="channel-list">
        <li
          v-for="chat in filteredChannels"
          :key="chat.id"
          :class="['channel-item', { active: chat.id === store.activeChatId }]"
          @click="store.setActiveChat(chat.id)"
          @contextmenu.prevent="openChannelMenu(chat)"
        >
          <span class="channel-hash">#</span>
          <span class="channel-name">{{ chat.name }}</span>
          <span v-if="chat.members" class="member-count">{{ chat.members.length }}</span>
        </li>
      </ul>
    </section>

    <section class="dm-section">
      <div class="section-header">
        <h3 class="section-title">DIRECT MESSAGES</h3>
        <button class="add-btn" title="Start new conversation" @click="openCreateChatDialog(false)">
          <i class="pi pi-plus"></i>
        </button>
      </div>
      <ul class="dm-list">
        <li
          v-for="chat in filteredDMs"
          :key="chat.id"
          :class="['dm-item', { active: chat.id === store.activeChatId }]"
          @click="store.setActiveChat(chat.id)"
        >
          <span :class="['status-dot', getUserStatus(chat)]"></span>
          <span class="dm-name">{{ getDmName(chat) }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDialog } from 'primevue/usedialog';
import { useChatHubStore } from '../../../application/chat-hub.store.js';
import CreateChatDialog from './CreateChatDialog.vue';
import MembersListDialog from './MembersListDialog.vue';

const store  = useChatHubStore();
const dialog = useDialog();
const searchQuery = ref('');

const filteredChannels = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return store.chats
    .filter(c => c.type === 'channel')
    .filter(c => !q || c.name.includes(q));
});

const filteredDMs = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return store.chats
    .filter(c => c.type === 'dm')
    .filter(c => !q || getDmName(c).toLowerCase().includes(q));
});

function getDmName(chat) {
  const otherId = chat.members.find(id => id !== store.currentUserId);
  const user = store.users.find(u => u.id === otherId);
  return user?.name ?? chat.name;
}

function getUserStatus(chat) {
  const otherId = chat.members.find(id => id !== store.currentUserId);
  return store.users.find(u => u.id === otherId)?.status ?? 'offline';
}

function openCreateChatDialog(isChannel) {
  dialog.open(CreateChatDialog, {
    props: {
      header: isChannel ? 'Create New Channel' : 'Start New Conversation',
      modal: true,
      style: { width: '420px' },
      isChannel,
      allUsers: store.users,
      currentUserId: store.currentUserId,
    },
    onClose: (options) => {
      if (options.data) store.addChat(options.data);
    },
  });
}

function openChannelMenu(chat) {
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
      if (options.data?.newMemberId) {
        store.addMember(chat.id, options.data.newMemberId);
      }
    },
  });
}
</script>

<style scoped>
.channel-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  overflow-y: auto;
  gap: 8px;
}

.search-box {
  position: relative;
  margin-bottom: 8px;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 13px;
}

.search-box input {
  width: 100%;
  padding: 9px 12px 9px 36px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  background: white;
  color: #334155;
  outline: none;
  box-sizing: border-box;
}

.search-box input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.search-box input::placeholder { color: #94a3b8; }

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 0 8px;
}

.section-title {
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.8px;
  margin: 0;
}

.add-btn {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
}
.add-btn:hover { background: #e2e8f0; color: #475569; }

.channel-list, .dm-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.channel-item, .dm-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #475569;
  transition: background 0.15s, color 0.15s;
  margin-bottom: 2px;
}

.channel-item:hover, .dm-item:hover { background: #f1f5f9; }

.channel-item.active, .dm-item.active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
  border-left: 3px solid #2563eb;
  padding-left: 7px;
}

.channel-hash {
  color: #94a3b8;
  font-weight: 600;
  flex-shrink: 0;
}
.channel-item.active .channel-hash { color: #2563eb; }

.channel-name, .dm-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.member-count {
  font-size: 10px;
  background: #e2e8f0;
  color: #64748b;
  padding: 2px 6px;
  border-radius: 99px;
  flex-shrink: 0;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: #94a3b8;
}
.status-dot.online { background: #10b981; }
</style>
