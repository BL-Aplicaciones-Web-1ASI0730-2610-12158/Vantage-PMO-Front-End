<template>
  <div class="channel-sidebar">
    <section class="channels-section">
      <div class="section-header">
        <h3 class="section-title">CHANNELS</h3>
        <button class="add-chat-button" @click="openCreateChatDialog(true)" title="Create new channel">
          <i class="pi pi-plus"></i>
        </button>
      </div>
      <ul class="channel-list">
        <li
          v-for="chat in filteredChannels"
          :key="chat.id"
          :class="['channel-item', { active: chat.id === activeChatId }]"
          @click="selectChat(chat.id)"
          @contextmenu.prevent="openChannelMenu(chat)"
        >
          <span class="channel-name"># {{ chat.name }}</span>
          <span class="channel-members-count" v-if="chat.members">{{ chat.members.length }}</span>
        </li>
      </ul>
    </section>

    <section class="direct-messages-section">
      <div class="section-header">
        <h3 class="section-title">DIRECT MESSAGES</h3>
        <button class="add-chat-button" @click="openCreateChatDialog(false)" title="Start new conversation">
          <i class="pi pi-plus"></i>
        </button>
      </div>
      <ul class="dm-list">
        <li
          v-for="chat in filteredDMs"
          :key="chat.id"
          :class="['dm-item', { active: chat.id === activeChatId }]"
          @click="selectChat(chat.id)"
        >
          <span :class="['status-indicator', getUserStatus(chat)]"></span>
          {{ getDmName(chat) }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDialog } from 'primevue/usedialog';
import CreateChatDialog from './CreateChatDialog.vue';
import MembersListDialog from './MembersListDialog.vue';

const props = defineProps({
  activeChatId: {
    type: String,
    required: true,
  },
  chats: { // Recibir todos los chats
    type: Array,
    required: true,
  },
  users: { // Recibir todos los usuarios
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update:activeChatId', 'add:chat', 'add:member']);
const dialog = useDialog();

const filteredChannels = computed(() => props.chats.filter(chat => chat.type === 'channel'));
const filteredDMs = computed(() => props.chats.filter(chat => chat.type === 'dm'));

const selectChat = (chatId) => {
  emit('update:activeChatId', chatId);
};

const getDmName = (chat) => {
  // Para DMs, el nombre es el del otro usuario en el chat
  const otherMemberId = chat.members.find(memberId => memberId !== 'marcus'); // Asumiendo 'marcus' es el usuario actual
  const otherUser = props.users.find(user => user.id === otherMemberId);
  return otherUser ? otherUser.name : chat.name;
};

const getUserStatus = (chat) => {
  const otherMemberId = chat.members.find(memberId => memberId !== 'marcus');
  const otherUser = props.users.find(user => user.id === otherMemberId);
  return otherUser ? otherUser.status : 'offline';
};

const openCreateChatDialog = (isChannel) => {
  dialog.open(CreateChatDialog, {
    props: {
      header: isChannel ? 'Create New Channel' : 'Start New Conversation',
      modal: true,
      style: { width: '400px' },
      isChannel: isChannel,
      allUsers: props.users,
      currentUserId: 'marcus', // Asumiendo 'marcus' es el usuario actual
    },
    onClose: (options) => {
      const newChat = options.data;
      if (newChat) {
        emit('add:chat', newChat);
      }
    }
  });
};

const openChannelMenu = (chat) => {
  dialog.open(MembersListDialog, {
    props: {
      header: `Members of ${chat.name}`,
      modal: true,
      style: { width: '400px' },
      breakpoints:{ '960px': '75vw', '641px': '100vw' },
      chatMembers: chat.members.map(memberId => props.users.find(u => u.id === memberId)),
      allUsers: props.users,
      chatId: chat.id,
    },
    onClose: (options) => {
      if (options.data && options.data.newMemberId) {
        emit('add:member', { chatId: chat.id, userId: options.data.newMemberId });
      }
    }
  });
};
</script>

<style scoped>
@import url('../../../styles/_variables.css');

.channel-sidebar {
  padding: 1rem;
  background-color: var(--color-gray-lightest); /* Fondo gris neutro claro y limpio */
  font-family: Arial, sans-serif;
  height: 100%; /* Asegura que ocupe todo el alto disponible */
  overflow-y: auto; /* Permite scroll si hay muchos elementos */
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.section-title {
  font-size: 0.75rem;
  color: var(--color-gray-dark); /* Gris corporativo apagado para títulos secundarios */
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0; /* Eliminar margen por defecto */
}

.add-chat-button {
  background: none;
  border: none;
  color: var(--color-gray-medium);
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.2rem;
  border-radius: 4px;
}

.add-chat-button:hover {
  background-color: var(--color-gray-light);
}

.channel-list, .dm-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.channel-item, .dm-item {
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.25rem;
  cursor: pointer;
  border-radius: 4px;
  display: flex; /* Usar flex para alinear contenido */
  align-items: center; /* Alineación vertical */
  gap: 8px; /* Espacio entre elementos */
  font-size: 0.9rem;
  color: var(--color-gray-dark); /* Gris corporativo apagado para canales inactivos */
  transition: background-color 0.2s ease, color 0.2s ease;
  justify-content: space-between;
}

.channel-name {
  flex: 1;
}

.channel-members-count {
  font-size: 0.75rem;
  background: #e5e7eb;
  color: #6b7280;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  flex-shrink: 0;
}

.channel-item:hover .channel-members-count {
  background: #d1d5db;
}

.channel-item:hover, .dm-item:hover {
  background-color: var(--color-gray-light); /* Efecto hover sutil */
}

.channel-item.active, .dm-item.active {
  background-color: var(--color-active-channel-bg); /* Azul extremadamente suave con opacidad */
  color: var(--color-active-channel-text); /* Azul Primario Vibrante */
  font-weight: 600; /* Negrita */
  border-radius: 6px; /* Bordes ligeramente redondeados */
}

.status-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0; /* Evita que el indicador se comprima */
}

.status-indicator.online {
  background-color: var(--color-status-online); /* Verde vibrante */
}

.status-indicator.offline {
  background-color: var(--color-status-offline); /* Gris */
}
</style>
