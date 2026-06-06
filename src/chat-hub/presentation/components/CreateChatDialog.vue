<template>
  <div class="create-chat-dialog">
    <div v-if="!selectedUser" class="dialog-content">
      <div class="form-group">
        <label class="form-label">{{ isChannel ? 'Channel Name' : 'Select User' }}</label>
        <input 
          v-if="isChannel"
          v-model="chatName" 
          type="text" 
          placeholder="e.g., product-launch" 
          class="form-input"
          autofocus
        >
        <input 
          v-else
          v-model="searchQuery" 
          type="text" 
          placeholder="Search user..." 
          class="form-input"
          autofocus
        >
      </div>

      <div v-if="!isChannel && searchQuery" class="user-list">
        <ul class="search-results">
          <li v-for="user in filteredUsers" :key="user.id" class="result-item" @click="selectUser(user)">
            <img :src="user.avatar" :alt="user.name" class="result-avatar">
            <div class="result-info">
              <span class="result-name">{{ user.name }}</span>
              <span class="result-role">{{ user.role }}</span>
            </div>
          </li>
        </ul>
      </div>

      <div v-if="isChannel" class="form-group">
        <label class="form-label">Description (Optional)</label>
        <textarea 
          v-model="chatDescription" 
          placeholder="Describe the channel purpose..." 
          class="form-textarea"
        ></textarea>
      </div>
    </div>

    <div v-else class="dialog-content">
      <p class="confirmation-text">Start conversation with <strong>{{ selectedUser.name }}</strong>?</p>
      <img :src="selectedUser.avatar" :alt="selectedUser.name" class="user-avatar-large">
      <p class="user-role">{{ selectedUser.role }}</p>
    </div>

    <div class="form-actions">
      <button class="btn-cancel" @click="cancel">Cancel</button>
      <button 
        v-if="!selectedUser && !isChannel"
        class="btn-create" 
        @click="confirmDM"
        :disabled="filteredUsers.length === 0"
        style="display: none;"
      >
        Select User
      </button>
      <button 
        v-if="selectedUser || isChannel"
        class="btn-create" 
        @click="createChat" 
        :disabled="!isFormValid"
      >
        {{ isChannel ? 'Create Channel' : 'Start Conversation' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDialog } from 'primevue/usedialog';

const props = defineProps({
  isChannel: {
    type: Boolean,
    required: true
  },
  allUsers: {
    type: Array,
    default: () => []
  },
  currentUserId: {
    type: String,
    required: true
  }
});

const dialog = useDialog();

const chatName = ref('');
const chatDescription = ref('');
const searchQuery = ref('');
const selectedUser = ref(null);

const filteredUsers = computed(() => {
  return props.allUsers
    .filter(user => user.id !== props.currentUserId)
    .filter(user =>
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const isFormValid = computed(() => {
  if (props.isChannel) {
    return chatName.value.trim().length > 0;
  } else {
    return selectedUser.value !== null;
  }
});

const selectUser = (user) => {
  selectedUser.value = user;
};

const confirmDM = () => {
  // Este botón está oculto, no se necesita
};

const createChat = () => {
  console.log('Creating chat...', { isChannel: props.isChannel, selectedUser: selectedUser.value, chatName: chatName.value });
  
  if (!isFormValid.value) {
    console.warn('Form is not valid');
    return;
  }

  if (props.isChannel) {
    const newChat = {
      id: chatName.value.toLowerCase().replace(/\s+/g, '-'),
      name: chatName.value,
      type: 'channel',
      description: chatDescription.value,
      members: [props.currentUserId],
      messages: [],
      isFavorited: false,
    };
    console.log('Closing dialog with new channel:', newChat);
    dialog.close({ data: newChat });
  } else {
    if (!selectedUser.value) {
      console.warn('No user selected');
      return;
    }
    const newChat = {
      id: `${props.currentUserId}-${selectedUser.value.id}-dm`,
      name: selectedUser.value.name,
      type: 'dm',
      members: [props.currentUserId, selectedUser.value.id],
      messages: [],
      isFavorited: false,
    };
    console.log('Closing dialog with new DM:', newChat);
    dialog.close({ data: newChat });
  }
};

const cancel = () => {
  console.log('Canceling dialog');
  dialog.close();
};
</script>

<style scoped>
.create-chat-dialog {
  padding: 2rem;
  min-width: 400px;
}

.dialog-content {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.user-list {
  margin-bottom: 1.5rem;
}

.search-results {
  position: relative;
  list-style: none;
  padding: 0.5rem 0;
  margin: 0.5rem 0 0 0;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.result-item:hover {
  background: #f3f4f6;
}

.result-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.result-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.result-name {
  font-weight: 500;
  color: #111827;
  font-size: 0.9rem;
}

.result-role {
  font-size: 0.75rem;
  color: #6b7280;
}

.confirmation-text {
  text-align: center;
  color: #374151;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.user-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  margin: 0 auto 1rem;
}

.user-role {
  text-align: center;
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn-cancel,
.btn-create {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.btn-cancel {
  background: #e5e7eb;
  color: #374151;
}

.btn-cancel:hover {
  background: #d1d5db;
}

.btn-create {
  background: #2563eb;
  color: white;
}

.btn-create:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-create:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
