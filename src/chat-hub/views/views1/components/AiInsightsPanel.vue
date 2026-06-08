<template>
  <div class="ai-panel">
    <div class="panel-body">
      <div class="panel-header">
        <i class="pi pi-sparkles"></i>
        <h3>AI INSIGHTS</h3>
      </div>

      <div class="meeting-meta">
        <span class="tag">{{ insight.meetingTag }}</span>
        <span class="ago">{{ insight.timeAgo }}</span>
      </div>
      <h4 class="meeting-title">{{ insight.meetingTitle }}</h4>

      <ul class="insights-list">
        <li v-for="item in insight.insights" :key="item.id">
          <i :class="['pi', item.type === 'Decision' ? 'pi-check-square decision' : 'pi-exclamation-circle action']"></i>
          <p><strong>{{ item.type }}:</strong> {{ item.text }}</p>
        </li>
      </ul>

      <div class="sentiment">
        <span class="sentiment-label">CHANNEL SENTIMENT</span>
        <div class="sentiment-row">
          <div class="sentiment-bar">
            <div class="productive" :style="{ width: insight.sentimentProductive + '%' }"></div>
            <div class="negative" :style="{ width: (100 - insight.sentimentProductive) + '%' }"></div>
          </div>
          <span class="sentiment-text">{{ insight.sentimentText }}</span>
        </div>
      </div>
    </div>

    <button class="transcript-btn" @click="viewTranscript">
      VIEW FULL TRANSCRIPT
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useDialog } from 'primevue/usedialog';
import { useChatHubStore } from '../../../application/chat-hub.store.js';
import FullTranscriptDialog from './FullTranscriptDialog.vue';

const store  = useChatHubStore();
const dialog = useDialog();

const insight = computed(() => store.insights);

function viewTranscript() {
  dialog.open(FullTranscriptDialog, {
    props: {
      header: 'Full Meeting Transcript',
      modal: true,
      style: { width: '60vw' },
      breakpoints: { '960px': '90vw' },
    },
  });
}
</script>

<style scoped>
.ai-panel {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-body { padding: 20px; flex: 1; }

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}
.panel-header i { color: #06b6d4; font-size: 16px; }
.panel-header h3 {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  margin: 0;
  letter-spacing: 0.6px;
}

.meeting-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}
.tag {
  font-size: 10px;
  font-weight: 700;
  color: #10b981;
  letter-spacing: 0.4px;
}
.ago { font-size: 11px; color: #94a3b8; }

.meeting-title {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px;
  line-height: 1.4;
}

.insights-list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
}
.insights-list li {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
}
.insights-list p { margin: 0; }
.insights-list i {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 11px;
  color: white;
  margin-top: 2px;
}
.insights-list i.decision { background: #10b981; }
.insights-list i.action { background: #2563eb; border-radius: 50%; }

.sentiment-label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.sentiment-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sentiment-bar {
  flex: 1;
  height: 6px;
  border-radius: 99px;
  overflow: hidden;
  display: flex;
  background: #e2e8f0;
}
.productive { background: #10b981; height: 100%; }
.negative   { background: #ef4444; height: 100%; }

.sentiment-text {
  font-size: 12px;
  font-weight: 600;
  color: #10b981;
  flex-shrink: 0;
}

.transcript-btn {
  width: 100%;
  padding: 12px;
  background: #1e293b;
  color: white;
  border: none;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: background 0.15s;
}
.transcript-btn:hover { background: #334155; }
</style>
