<template>
  <div class="chat-hub-wrapper">
    <!-- Main Chat Container -->
    <div class="chat-hub-container">
      <aside class="chat-hub-sidebar">
        <ChannelSidebar
          :activeChatId="activeChatId"
          :chats="chats"
          :users="users"
          @update:activeChatId="handleChatSelection"
          @add:chat="addChat"
          @add:member="addMemberToChat"
        />
      </aside>
      <main class="chat-hub-main-content">
        <ChatWindow
          :activeChatId="activeChatId"
          :chats="chats"
          :users="users"
          @update:chat="updateChat"
          @add:message="addMessageToChat"
          @add:member="addMemberToChat"
        />
      </main>
      <aside class="chat-hub-info-panel">
        <AiInsightsPanel />
        <PinnedAssetsPanel />
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ChannelSidebar from './components/ChannelSidebar.vue';
import ChatWindow from './components/ChatWindow.vue';
import AiInsightsPanel from './components/AiInsightsPanel.vue';
import PinnedAssetsPanel from './components/PinnedAssetsPanel.vue';

// --- Global States (simulating Fake API data) ---

// All users in the system
const users = ref([
  { id: 'marcus', name: 'Marcus J.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80', status: 'online', role: 'Project Lead' },
  { id: 'elena', name: 'Elena L.', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80', status: 'online', role: 'Senior Analyst' },
  { id: 'sarah', name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80', status: 'online', role: 'CTO' },
  { id: 'david', name: 'David Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', status: 'offline', role: 'Risk Manager' },
  { id: 'anna', name: 'Anna K.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna', status: 'online', role: 'Budget Analyst' },
  { id: 'peter', name: 'Peter G.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Peter', status: 'offline', role: 'Stakeholder' },
]);

// All chats (channels and DMs)
const chats = ref([
  {
    id: 'global-announcements',
    name: 'global-announcements',
    type: 'channel',
    description: 'Important announcements for everyone.',
    members: ['marcus', 'elena', 'sarah', 'david', 'anna', 'peter'],
    messages: [
      { id: 'msg4', authorId: 'sarah', timestamp: '09:00 AM', text: 'Welcome to the global announcements channel! Please keep an eye out for important updates here.', attachments: [], reactions: [] }
    ],
    isFavorited: false,
  },
  {
    id: 'pmo-strategic-alignment',
    name: 'pmo-strategic-alignment',
    type: 'channel',
    description: 'Strategic discussions for Q3 planning.',
    members: ['marcus', 'elena', 'sarah', 'david'],
    messages: [
      { id: 'msg1', authorId: 'marcus', timestamp: '10:30 AM', text: 'Team, great progress on the Q3 planning. Let\'s ensure all strategic alignment documents are finalized by end of day.', attachments: [], reactions: [{ emoji: '👍', count: 3 }] },
      { id: 'msg2', authorId: 'elena', timestamp: '10:35 AM', text: 'Agreed, Marcus. I\'m currently reviewing the resource_reallocation_impact.pdf. It looks solid.', attachments: [{ name: 'resource_reallocation_impact.pdf', icon: '📄' }], reactions: [{ emoji: '🚀', count: 1 }] },
      { id: 'msg3', authorId: 'marcus', timestamp: '10:40 AM', text: 'Excellent, Elena. Once you\'re done, please upload the final version to the shared drive.', attachments: [], reactions: [] }
    ],
    isFavorited: false,
  },
  {
    id: 'budget-steering-comm',
    name: 'budget-steering-comm',
    type: 'channel',
    description: 'Discussions for budget steering committee.',
    members: ['marcus', 'anna'],
    messages: [],
    isFavorited: false,
  },
  {
    id: 'risk-mitigation-log',
    name: 'risk-mitigation-log',
    type: 'channel',
    description: 'Logging and mitigation strategies for project risks.',
    members: ['marcus', 'david'],
    messages: [],
    isFavorited: false,
  },
  {
    id: 'sarah-dm', // Changed from 'sarah-jenkins' to avoid conflict with user ID
    name: 'Sarah Jenkins',
    type: 'dm',
    members: ['marcus', 'sarah'],
    messages: [
      { id: 'msg5', authorId: 'sarah', timestamp: '11:00 AM', text: 'Hi Marcus, can we discuss the Q3 budget adjustments later today?', attachments: [], reactions: [] },
      { id: 'msg6', authorId: 'marcus', timestamp: '11:05 AM', text: 'Sure, Sarah. I\'m free after 2 PM. Let me know what time works best for you.', attachments: [], reactions: [] }
    ],
    isFavorited: false,
  },
  {
    id: 'david-dm', // Changed from 'david-chen' to avoid conflict with user ID
    name: 'David Chen',
    type: 'dm',
    members: ['marcus', 'david'],
    messages: [],
    isFavorited: false,
  },
]);

// Current active chat
const activeChatId = ref('pmo-strategic-alignment');

// --- Global Actions ---

const handleChatSelection = (chatId) => {
  activeChatId.value = chatId;
};

const addChat = (newChat) => {
  chats.value.push(newChat);
  activeChatId.value = newChat.id; // Automatically select new chat
};

const addMessageToChat = ({ chatId, message }) => {
  const chat = chats.value.find(c => c.id === chatId);
  if (chat) {
    chat.messages.push(message);
  }
};

const updateChat = ({ chatId, key, value }) => {
  const chat = chats.value.find(c => c.id === chatId);
  if (chat) {
    chat[key] = value;
  }
};

const addMemberToChat = ({ chatId, userId }) => {
  const chat = chats.value.find(c => c.id === chatId);
  if (chat && !chat.members.includes(userId)) {
    chat.members.push(userId);
  }
};
</script>

<style scoped>
@import url('../styles/_variables.css');

/* Main Wrapper - Flex Container */
.chat-hub-wrapper {
  height: calc(100vh - 70px);
  overflow: hidden;
  display: flex;
  background-color: var(--color-gray-lightest);
}

/* Main Chat Container */
.chat-hub-container {
  display: flex;
  flex: 1;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Sidebar (Channels) */
.chat-hub-sidebar {
  flex: 0 0 260px;
  background-color: var(--color-gray-lightest);
  border-right: 1px solid var(--color-gray-light);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: auto;
}

/* Main Content */
.chat-hub-main-content {
  flex: 1;
  background-color: var(--color-white);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  box-sizing: border-box;
}

/* Right Info Panel */
.chat-hub-info-panel {
  flex: 0 0 320px;
  background-color: var(--color-gray-lightest);
  border-left: 1px solid var(--color-gray-light);
  display: flex;
  flex-direction: column;
  padding: 16px;
  box-sizing: border-box;
  gap: 16px;
  overflow-y: auto;
}

/* Scrollbar Styling */
.chat-hub-sidebar::-webkit-scrollbar,
.chat-hub-info-panel::-webkit-scrollbar {
  width: 8px;
}

.chat-hub-sidebar::-webkit-scrollbar-track,
.chat-hub-info-panel::-webkit-scrollbar-track {
  background: transparent;
}

.chat-hub-sidebar::-webkit-scrollbar-thumb,
.chat-hub-info-panel::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.chat-hub-sidebar::-webkit-scrollbar-thumb:hover,
.chat-hub-info-panel::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>