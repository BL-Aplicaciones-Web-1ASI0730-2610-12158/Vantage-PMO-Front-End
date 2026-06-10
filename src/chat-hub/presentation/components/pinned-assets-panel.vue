<template>
  <div class="pinned-panel">
    <h3 class="panel-title">PINNED ASSETS</h3>
    <ul class="asset-list">
      <li
        v-for="asset in assets"
        :key="asset.id"
        class="asset-item"
        @click="openAsset(asset)"
      >
        <span :class="['asset-icon', asset.type]">{{ iconLabel(asset.type) }}</span>
        <div class="asset-info">
          <span class="asset-name">{{ asset.name }}</span>
          <span class="asset-meta">{{ asset.meta }}</span>
        </div>
      </li>
      <li v-if="!assets.length" class="empty">No pinned assets for this channel</li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useChatHubStore } from '../../application/chat-hub.store.js';

const store = useChatHubStore();

const assets = computed(() => store.assetsForChat(store.activeChatId));

function iconLabel(type) {
  if (type === 'excel') return 'XLS';
  if (type === 'pdf') return 'PDF';
  return '📎';
}

function openAsset(asset) {
  alert(`Opening: ${asset.name}`);
}
</script>

<style scoped>
.pinned-panel {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
}

.panel-title {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.6px;
  margin: 0 0 16px;
}

.asset-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.asset-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: opacity 0.15s;
}
.asset-item:last-child { border-bottom: none; }
.asset-item:hover { opacity: 0.85; }

.asset-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 800;
  color: white;
  flex-shrink: 0;
}
.asset-icon.excel { background: #217346; }
.asset-icon.pdf   { background: #dc2626; }

.asset-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.asset-name {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.asset-meta {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
}

.empty {
  font-size: 12px;
  color: #94a3b8;
  padding: 8px 0;
}
</style>
