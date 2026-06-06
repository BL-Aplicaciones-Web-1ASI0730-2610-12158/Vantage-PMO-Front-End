<template>
  <div class="members-list-dialog">
    <div class="members-section">
      <h4 class="section-title">Current Members</h4>
      <ul class="members-list">
        <li v-for="member in chatMembers" :key="member.id" class="member-item">
          <img :src="member.avatar" :alt="member.name" class="member-avatar">
          <div class="member-info">
            <span class="member-name">{{ member.name }}</span>
            <span class="member-role">{{ member.role }}</span>
          </div>
          <span :class="['status-badge', member.status]">{{ member.status }}</span>
        </li>
      </ul>
    </div>

    <div class="add-members-section">
      <h4 class="section-title">Add Members</h4>
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search users..." 
          class="search-input"
        >
      </div>
      <ul class="available-users-list">
        <li v-for="user in filteredUsers" :key="user.id" class="user-item" @click="addMember(user.id)">
          <img :src="user.avatar" :alt="user.name" class="user-avatar">
          <div class="user-info">
            <span class="user-name">{{ user.name }}</span>
            <span class="user-role">{{ user.role }}</span>
          </div>
          <button class="add-button">
            <i class="pi pi-plus"></i>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDialog } from 'primevue/usedialog';

const props = defineProps({
  chatMembers: {
    type: Array,
    default: () => []
  },
  allUsers: {
    type: Array,
    default: () => []
  },
  chatId: {
    type: String,
    required: true
  }
});

const dialog = useDialog();
const searchQuery = ref('');

// Usuarios disponibles que no están en el chat
const filteredUsers = computed(() => {
  const memberIds = new Set((props.chatMembers || []).filter(m => m).map(m => m.id));
  return props.allUsers
    .filter(user => !memberIds.has(user.id))
    .filter(user => 
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const addMember = (userId) => {
  dialog.close({ data: { newMemberId: userId } });
};
</script>

<style scoped>
.members-list-dialog {
  padding: 1.5rem;
  max-height: 500px;
  overflow-y: auto;
}

.section-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
}

.members-section {
  margin-bottom: 2rem;
}

.members-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.member-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.member-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.member-name {
  font-weight: 500;
  color: #111827;
  font-size: 0.9rem;
}

.member-role {
  font-size: 0.75rem;
  color: #6b7280;
}

.status-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  font-weight: 500;
}

.status-badge.online {
  background: #dcfce7;
  color: #166534;
}

.status-badge.offline {
  background: #f3f4f6;
  color: #6b7280;
}

.add-members-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
}

.search-box {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.available-users-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.user-item:hover {
  background: #f3f4f6;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  color: #111827;
  font-size: 0.9rem;
}

.user-role {
  font-size: 0.75rem;
  color: #6b7280;
}

.add-button {
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.add-button:hover {
  background: #1d4ed8;
}
</style>