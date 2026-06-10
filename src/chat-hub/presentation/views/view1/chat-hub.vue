<template>
  <div class="chat-hub-wrapper">
    <div class="chat-hub-container">
      <aside class="chat-hub-sidebar">
        <ChannelSidebar />
      </aside>
      <main class="chat-hub-main-content">
        <ChatWindow />
      </main>
      <aside class="chat-hub-info-panel">
        <AiInsightsPanel />
        <PinnedAssetsPanel />
      </aside>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useChatHubStore } from '../../../application/chat-hub.store.js';
import ChannelSidebar from '../../components/channel-sidebar.vue';
import ChatWindow from '../../components/chat-window.vue';
import AiInsightsPanel from '../../components/ai-insights-panel.vue';
import PinnedAssetsPanel from '../../components/pinned-assets-panel.vue';

const store = useChatHubStore();

onMounted(() => store.initialize());
</script>

<style scoped>
.chat-hub-wrapper {
  height: calc(100vh - 116px);
  min-height: 520px;
  overflow: hidden;
  display: flex;
  background: #f8fafc;
  margin: -28px;
  padding: 0;
}

.chat-hub-container {
  display: flex;
  flex: 1;
  overflow: hidden;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.chat-hub-sidebar {
  flex: 0 0 280px;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-hub-main-content {
  flex: 1;
  background: #fff;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.chat-hub-info-panel {
  flex: 0 0 300px;
  background: #f8fafc;
  border-left: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
  overflow-y: auto;
}

.chat-hub-info-panel::-webkit-scrollbar { width: 6px; }
.chat-hub-info-panel::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }

@media (max-width: 1100px) {
  .chat-hub-info-panel { display: none; }
}

@media (max-width: 768px) {
  .chat-hub-wrapper { height: calc(100vh - 100px); margin: -16px; }
  .chat-hub-sidebar { flex: 0 0 220px; }
}
</style>
