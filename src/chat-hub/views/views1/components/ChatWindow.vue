<template>
  <div class="chat-window">
    <header class="chat-header">
      <div class="channel-info">
        <h2 class="channel-title">{{ currentChat?.name }}</h2>
        <p v-if="currentChat?.type === 'channel'" class="channel-description">{{ currentChat?.description }}</p>
        <p v-else-if="currentChat?.type === 'dm'" class="channel-description">
          <span :class="['status-indicator', otherDmUser?.status]"></span>
          {{ otherDmUser?.status === 'online' ? 'Online' : 'Offline' }}
          <span v-if="otherDmUser?.role"> - {{ otherDmUser?.role }}</span>
        </p>
      </div>
      <div class="header-actions">
        <button v-if="currentChat?.type === 'channel'" class="members-button" @click="openMembersDialog">
          <i class="pi pi-users"></i> {{ currentChat?.members.length }} Members
        </button>
        <i :class="['pi', currentChat?.isFavorited ? 'pi-star-fill' : 'pi-star', 'star-icon']" @click="toggleFavorite"></i>
      </div>
    </header>

    <div class="message-list" ref="messageListRef">
      <div class="date-separator">TODAY</div>
      <MessageItem v-for="message in currentChat?.messages" :key="message.id" :message="message" :users="users" />
    </div>

    <div class="message-composer-wrapper">
      <div class="message-composer">
        <div class="toolbar-container">
          <button class="toolbar-button" @click="toggleBold"><i class="pi pi-bold"></i></button>
          <button class="toolbar-button" @click="toggleItalic"><i class="pi pi-italic"></i></button>
          <button class="toolbar-button" @click="toggleLink"><i class="pi pi-link"></i></button>
          <button class="toolbar-button" @click="toggleListFormat"><i class="pi pi-list"></i></button>
        </div>
        <div class="input-area">
          <textarea
            class="message-input"
            :placeholder="currentChat?.type === 'channel' ? `Message #${currentChat?.name}` : `Message @${currentChat?.name}`"
            v-model="messageText"
            @keydown.enter.prevent="sendMessage"
          ></textarea>
          <div class="input-controls">
            <!-- Input de archivo oculto -->
            <input type="file" ref="fileInput" style="display: none;" @change="handleFileUpload" multiple />
            <button class="control-button" @click="triggerFileInput"><i class="pi pi-paperclip"></i></button>

            <!-- Popover de Emojis -->
            <OverlayPanel ref="emojiOverlay" :show="showEmojiPicker" @hide="showEmojiPicker = false" :target="emojiButton">
              <div class="emoji-picker-content">
                <span v-for="emoji in frequentEmojis" :key="emoji" @click="addEmoji(emoji)" class="emoji-item">
                  {{ emoji }}
                </span>
              </div>
            </OverlayPanel>
            <button ref="emojiButton" class="control-button" @click="toggleEmojiPicker"><i class="pi pi-face-smile"></i></button>
            <button class="control-button" @click="openQuickOptionsDialog"><i class="pi pi-plus"></i></button> <!-- Botón de más (+) -->
            <button class="send-button" @click="sendMessage"><i class="pi pi-send"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import MessageItem from './MessageItem.vue';
import { useDialog } from 'primevue/usedialog';
import MembersListDialog from './MembersListDialog.vue';
import OverlayPanel from 'primevue/overlaypanel'; // Importar OverlayPanel
import QuickOptionsDialog from './QuickOptionsDialog.vue';

const props = defineProps({
  activeChatId: {
    type: String,
    required: true,
  },
  chats: {
    type: Array,
    required: true,
  },
  users: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update:chat', 'add:message', 'add:member']);
const dialog = useDialog();

const messageText = ref('');
const messageListRef = ref(null); // Referencia al div de la lista de mensajes
const fileInput = ref(null); // Referencia al input de archivo
const showEmojiPicker = ref(false); // Estado para mostrar/ocultar el picker de emojis
const emojiOverlay = ref(null); // Referencia al componente OverlayPanel
const emojiButton = ref(null); // Referencia al botón de emoji para el target del overlay

const frequentEmojis = ['👍', '🚀', '❤️', '🔥', '😂', '👀'];

// --- Computed properties for current chat data ---
const currentChat = computed(() => props.chats.find(chat => chat.id === props.activeChatId));
const currentUser = computed(() => props.users.find(user => user.id === 'marcus')); // Asumiendo 'marcus' es el usuario actual

const otherDmUser = computed(() => {
  if (currentChat.value?.type === 'dm') {
    const otherMemberId = currentChat.value.members.find(memberId => memberId !== currentUser.value.id);
    return props.users.find(user => user.id === otherMemberId);
  }
  return null;
});

// --- Watchers ---
watch(() => props.activeChatId, () => {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
    }
  });
}, { immediate: true }); // Ejecutar inmediatamente al montar

// --- Message Sending Logic ---
const uploadingFiles = ref([]); // Archivos seleccionados para adjuntar (ÚNICA DECLARACIÓN)

const sendMessage = (event) => {
  if (event && event.shiftKey && event.key === 'Enter') {
    messageText.value += '\n';
    return;
  }

  if (messageText.value.trim() === '' && uploadingFiles.value.length === 0) return;

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  const currentTime = `${formattedHours}:${formattedMinutes} ${ampm}`;

  const newAttachments = uploadingFiles.value.map(file => ({
    name: file.name,
    icon: getFileIcon(file.name), // Función para obtener el icono
    url: URL.createObjectURL(file) // URL temporal para visualización
  }));

  const newMessage = {
    id: `msg${currentChat.value.messages.length + 1}-${Date.now()}`,
    authorId: currentUser.value.id,
    timestamp: currentTime,
    text: messageText.value.trim(),
    attachments: newAttachments,
    reactions: []
  };

  emit('add:message', { chatId: props.activeChatId, message: newMessage });
  messageText.value = '';
  uploadingFiles.value = [];

  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
    }
  });
};

// --- Favorite Logic ---
const toggleFavorite = () => {
  if (currentChat.value) {
    emit('update:chat', { chatId: props.activeChatId, key: 'isFavorited', value: !currentChat.value.isFavorited });
  }
};

// --- Members Modal Logic ---
const openMembersDialog = () => {
  if (!currentChat.value) return;

  dialog.open(MembersListDialog, {
    props: {
      header: `Members of ${currentChat.value.name}`,
      modal: true,
      style: { width: '400px' },
      breakpoints:{ '960px': '75vw', '641px': '100vw' },
      chatMembers: currentChat.value.members.map(memberId => props.users.find(u => u.id === memberId)),
      allUsers: props.users,
      chatId: props.activeChatId,
    },
    onClose: (options) => {
      if (options.data && options.data.newMemberId) {
        emit('add:member', { chatId: props.activeChatId, userId: options.data.newMemberId });
      }
    }
  });
};

// --- Attachments Logic ---
const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files);
  if (files.length) {
    uploadingFiles.value = [...uploadingFiles.value, ...files];
    messageText.value = messageText.value + files.map(f => ` [${f.name}]`).join('');
  }
};

const getFileIcon = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  switch (ext) {
    case 'pdf': return '📄';
    case 'xls':
    case 'xlsx': return '📊';
    case 'doc':
    case 'docx': return '📝';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif': return '🖼️';
    default: return '📎';
  }
};

// --- Emoji Picker Logic ---
const toggleEmojiPicker = (event) => {
  if (emojiOverlay.value) {
    emojiOverlay.value.toggle(event); // Usar el método toggle de OverlayPanel
  }
};

const addEmoji = (emoji) => {
  messageText.value += emoji;
  if (emojiOverlay.value) {
    emojiOverlay.value.hide(); // Ocultar después de seleccionar
  }
};

// --- Toolbar Formatting Logic (Placeholders) ---
const toggleBold = () => { console.log('Toggle Bold clicked!'); };
const toggleItalic = () => { console.log('Toggle Italic clicked!'); };
const toggleLink = () => { console.log('Toggle Link clicked!'); };
const toggleListFormat = () => { console.log('Toggle List Format clicked!'); };

// --- Quick Options Logic (for the '+' button) ---
const openQuickOptionsDialog = () => {
  dialog.open(QuickOptionsDialog, {
    props: {
      header: 'Quick Options',
      modal: true,
      style: { width: '300px' },
    },
    onClose: (options) => {
      if (options.data) {
        console.log('Quick option selected:', options.data);
        // Handle selected quick option
        if (options.data === 'attach-file') {
          triggerFileInput();
        }
        // Add more conditions for other options
      }
    }
  });
};
</script>

<style scoped>
@import url('../../../styles/_variables.css');

.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--color-white);
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-gray-light);
  background-color: var(--color-white);
  flex-shrink: 0;
}

.channel-info {
  display: flex;
  flex-direction: column;
}

.channel-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
  color: var(--color-gray-dark);
}

.channel-description {
  font-size: 0.85rem;
  color: var(--color-gray-medium);
  margin: 0.2rem 0 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background-color: var(--color-status-offline); /* Default */
}

.status-indicator.online {
  background-color: var(--color-status-online);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.members-button {
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-light);
  color: var(--color-gray-dark);
  padding: 0.4rem 0.7rem;
  border-radius: 6px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.members-button:hover {
  background-color: var(--color-gray-lightest);
}

.star-icon {
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--color-gray-medium);
}

.star-icon.pi-star-fill {
  color: #F59E0B; /* Dorado para favorito */
}

.message-list {
  flex-grow: 1;
  padding: 1rem 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.date-separator {
  text-align: center;
  margin: 1.5rem 0;
  font-size: 0.8rem;
  color: var(--color-gray-medium);
  position: relative;
}

.date-separator::before,
.date-separator::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background-color: var(--color-gray-light);
}

.date-separator::before {
  left: 0;
}

.date-separator::after {
  right: 0;
}

.message-composer-wrapper {
  flex-shrink: 0;
  padding: 1rem 1.5rem;
}

.message-composer {
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-light);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.toolbar-container {
  background-color: var(--color-gray-lightest);
  padding: 0.5rem 1rem;
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid var(--color-gray-light);
}

.toolbar-button {
  background-color: transparent;
  border: none;
  color: var(--color-gray-medium);
  padding: 0.3rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toolbar-button:hover {
  background-color: var(--color-gray-light);
  color: var(--color-gray-dark);
}

.input-area {
  display: flex;
  align-items: flex-end;
  padding: 0.75rem 1rem;
  gap: 0.5rem;
  position: relative;
}

.message-input {
  flex-grow: 1;
  min-height: 60px;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  resize: vertical;
  outline: none;
  font-family: Arial, sans-serif;
  color: var(--color-gray-dark);
  background-color: transparent;
}

.message-input::placeholder {
  color: var(--color-gray-medium);
}

.input-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.control-button {
  background-color: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--color-gray-medium);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-button:hover {
  color: var(--color-primary-blue);
}

.send-button {
  background-color: var(--color-send-button-blue);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  color: var(--color-white);
  font-size: 1rem;
}

.send-button:hover {
  background-color: #0056b3;
}

.emoji-picker-content {
  padding: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.emoji-item {
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.2rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.emoji-item:hover {
  background-color: var(--color-gray-lightest);
}
</style>
