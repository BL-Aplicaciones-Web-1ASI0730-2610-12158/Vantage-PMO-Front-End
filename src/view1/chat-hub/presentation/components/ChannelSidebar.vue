<template>
  <div class="channel-sidebar">
    <section class="channels-section">
      <h3 class="section-title">CHANNELS</h3>
      <ul class="channel-list">
        <li
          v-for="channel in channels"
          :key="channel.id"
          :class="['channel-item', { active: channel.id === activeChannelId }]"
          @click="selectChannel(channel.id)"
        >
          # {{ channel.name }}
        </li>
      </ul>
    </section>

    <section class="direct-messages-section">
      <h3 class="section-title">DIRECT MESSAGES</h3>
      <ul class="dm-list">
        <li v-for="dm in directMessages" :key="dm.id" class="dm-item">
          <span :class="['status-indicator', dm.status]"></span>
          {{ dm.name }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeChannelId = ref('pmo-strategic-alignment'); // Canal activo por defecto

const channels = ref([
  { id: 'global-announcements', name: 'global-announcements' },
  { id: 'pmo-strategic-alignment', name: 'pmo-strategic-alignment' },
  { id: 'budget-steering-comm', name: 'budget-steering-comm' },
  { id: 'risk-mitigation-log', name: 'risk-mitigation-log' },
]);

const directMessages = ref([
  { id: 'sarah-jenkins', name: 'Sarah Jenkins (CTO)', status: 'online' },
  { id: 'david-chen', name: 'David Chen', status: 'offline' },
]);

const selectChannel = (channelId) => {
  activeChannelId.value = channelId;
  console.log(`Channel selected: ${channelId}`);
  // Aquí podrías emitir un evento o llamar a una acción Vuex/Pinia
};
</script>

<style scoped>
@import url('../../styles/_variables.css');

.channel-sidebar {
  padding: 1rem;
  background-color: #f5f7fa; /* Fondo gris muy claro uniforme */
  color: var(--color-gray-dark);
  font-family: Arial, sans-serif;
  height: 100%; /* Asegura que ocupe todo el alto disponible */
  overflow-y: auto; /* Permite scroll si hay muchos elementos */
}

.section-title {
  font-size: 0.75rem;
  color: var(--color-gray-medium);
  text-transform: uppercase;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  letter-spacing: 0.05em;
}

.channel-list, .dm-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.channel-item {
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.25rem;
  cursor: pointer;
  border-radius: 4px;
  display: block; /* Asegura que ocupe todo el ancho */
  font-size: 0.9rem;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.channel-item:hover {
  background-color: var(--color-gray-light); /* Efecto hover sutil */
}

.channel-item.active {
  background-color: rgba(0, 123, 255, 0.1); /* Fondo azul muy sutil */
  color: #0056b3; /* Azul oscuro brillante */
  font-weight: 700; /* Negrita */
}

.dm-item {
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.25rem;
  cursor: pointer;
  border-radius: 4px;
  display: flex; /* Para alinear el indicador de estado y el nombre */
  align-items: center; /* Alineación vertical */
  gap: 8px; /* Espacio entre el círculo y el nombre */
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.dm-item:hover {
  background-color: var(--color-gray-light); /* Efecto hover sutil */
}

.status-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0; /* Evita que el indicador se comprima */
}

.status-indicator.online {
  background-color: var(--color-status-online); /* Verde */
}

.status-indicator.offline {
  background-color: var(--color-status-offline); /* Gris */
}
</style>
