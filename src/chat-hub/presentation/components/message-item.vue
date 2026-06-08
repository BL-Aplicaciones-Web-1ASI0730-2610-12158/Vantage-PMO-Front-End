<template>
  <div class="message-row">
    <img :src="authorAvatar" :alt="authorName" class="avatar" />
    <div class="content">
      <div class="header">
        <span class="author">{{ authorName }}</span>
        <span class="time">{{ message.timestamp }}</span>
      </div>
      <p class="body">{{ message.text }}</p>

      <div v-if="message.attachments?.length" class="attachments">
        <a
          v-for="(att, i) in message.attachments"
          :key="i"
          :href="att.url || '#'"
          target="_blank"
          class="attachment"
        >
          <span :class="['file-icon', att.type || att.icon || 'file']">
            {{ fileLabel(att) }}
          </span>
          <span class="file-name">{{ att.name }}</span>
        </a>
      </div>

      <div v-if="displayReactions.length" class="reactions">
        <button
          v-for="(r, i) in displayReactions"
          :key="i"
          class="reaction"
          @click="emit('react', r.emoji)"
        >
          {{ r.emoji }} {{ r.count }}
        </button>
        <button class="reaction add" title="Add reaction" @click="emit('react', '👍')">+</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  message: { type: Object, required: true },
  users:   { type: Array, required: true },
});

const emit = defineEmits(['react']);

const author = computed(() => props.users.find(u => u.id === props.message.authorId));
const authorName   = computed(() => author.value?.name ?? 'Unknown');
const authorAvatar = computed(() => author.value?.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${props.message.authorId}`);

const displayReactions = computed(() => props.message.reactions ?? []);

function fileLabel(att) {
  const t = att.type || att.icon || 'file';
  if (t === 'pdf') return 'PDF';
  if (t === 'excel') return 'XLS';
  return '📎';
}
</script>

<style scoped>
.message-row {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: flex-start;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.content { flex: 1; min-width: 0; }

.header {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
}

.author {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}

.time {
  font-size: 11px;
  color: #94a3b8;
}

.body {
  font-size: 14px;
  color: #334155;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
}

.attachments {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.attachment {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: background 0.15s;
  max-width: 280px;
}
.attachment:hover { background: #f1f5f9; }

.file-icon {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 800;
  color: white;
  flex-shrink: 0;
}
.file-icon.pdf   { background: #dc2626; }
.file-icon.excel { background: #217346; }
.file-icon.doc   { background: #2563eb; }
.file-icon.file  { background: #64748b; font-size: 16px; }

.file-name {
  font-size: 12px;
  font-weight: 600;
  color: #334155;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.reactions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.reaction {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 99px;
  font-size: 12px;
  cursor: pointer;
  color: #475569;
}
.reaction:hover { background: #e2e8f0; }
.reaction.add {
  font-weight: 700;
  color: #94a3b8;
  padding: 3px 8px;
}
</style>
