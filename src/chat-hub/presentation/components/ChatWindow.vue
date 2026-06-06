<template>
  <div class="chat-window">
    <header class="chat-header">
      <div class="channel-info">
        <h2 class="channel-title">pmo-strategic-alignment</h2>
        <p class="channel-description">Strategic discussions for Q3 planning.</p>
      </div>
      <div class="header-actions">
        <span class="members-badge">
          <i class="pi pi-users"></i> 12 Members
        </span>
        <i class="pi pi-star"></i> <!-- Star icon for favorite -->
      </div>
    </header>

    <div class="message-list">
      <div class="date-separator">TODAY</div>
      <MessageItem v-for="message in messages" :key="message.id" :message="message" />
    </div>

    <div class="message-composer-wrapper">
      <div class="message-composer">
        <div class="toolbar-container">
          <button class="toolbar-button"><i class="pi pi-bold"></i></button>
          <button class="toolbar-button"><i class="pi pi-italic"></i></button>
          <button class="toolbar-button"><i class="pi pi-link"></i></button>
          <button class="toolbar-button"><i class="pi pi-list"></i></button>
        </div>
        <div class="input-area">
          <textarea class="message-input" placeholder="Message #pmo-strategic-alignment"></textarea>
          <div class="input-controls">
            <button class="control-button"><i class="pi pi-plus"></i></button>
            <button class="control-button"><i class="pi pi-face-smile"></i></button>
            <button class="send-button"><i class="pi pi-send"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import MessageItem from './MessageItem.vue';

const messages = ref([
  {
    id: 'msg1',
    avatar: 'https://via.placeholder.com/30/FF5733/FFFFFF?text=MJ',
    author: 'Marcus J.',
    timestamp: '10:30 AM',
    text: 'Team, great progress on the Q3 planning. Let\'s ensure all strategic alignment documents are finalized by end of day.',
    attachments: [],
    reactions: [{ emoji: '👍', count: 3 }]
  },
  {
    id: 'msg2',
    avatar: 'https://via.placeholder.com/30/3366FF/FFFFFF?text=EL',
    author: 'Elena L.',
    timestamp: '10:35 AM',
    text: 'Agreed, Marcus. I\'m currently reviewing the resource_reallocation_impact.pdf. It looks solid.',
    attachments: [{ name: 'resource_reallocation_impact.pdf', icon: '📄' }],
    reactions: [{ emoji: '🚀', count: 1 }]
  },
  {
    id: 'msg3',
    avatar: 'https://via.placeholder.com/30/FF5733/FFFFFF?text=MJ',
    author: 'Marcus J.',
    timestamp: '10:40 AM',
    text: 'Excellent, Elena. Once you\'re done, please upload the final version to the shared drive.',
    attachments: [],
    reactions: []
  }
]);

// Lógica para enviar mensajes, etc.
</script>

<style scoped>
@import url('../../styles/_variables.css');

.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%; /* Ocupa el 100% del chat-hub-main-content */
  background-color: var(--color-white);
  /* border-left: 1px solid var(--color-gray-light); */ /* Estos bordes se manejan en ChatHub.vue */
  /* border-right: 1px solid var(--color-gray-light); */
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-gray-light);
  background-color: var(--color-white);
  flex-shrink: 0; /* Evita que la cabecera se encoja */
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
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.members-badge {
  background-color: var(--color-gray-light);
  color: var(--color-gray-dark);
  padding: 0.4rem 0.7rem;
  border-radius: 15px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.pi-star {
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--color-gray-medium);
}

.message-list {
  flex-grow: 1; /* Ocupa todo el espacio disponible */
  padding: 1rem 1.5rem;
  overflow-y: auto; /* Permite el scroll solo en esta área */
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
  flex-shrink: 0; /* Evita que el wrapper del composer se encoja */
  padding: 1rem 1.5rem; /* Padding para separar el composer de los bordes del chat-window */
}

.message-composer {
  background-color: var(--color-white); /* Fondo blanco para la tarjeta flotante */
  border: 1px solid var(--color-gray-light); /* Borde sutil */
  border-radius: 16px; /* Bordes muy redondeados */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Sombra para efecto flotante */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Para que los bordes redondeados se apliquen a los hijos */
}

.toolbar-container {
  background-color: var(--color-gray-lightest); /* Fondo gris claro para la barra de herramientas */
  padding: 0.5rem 1rem;
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid var(--color-gray-light); /* Separador del input */
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
  align-items: flex-end; /* Alinea los controles al final del textarea */
  padding: 0.75rem 1rem; /* Padding interno para el área de input */
  gap: 0.5rem;
}

.message-input {
  flex-grow: 1;
  min-height: 60px;
  border: none; /* El borde ahora lo tiene el .message-composer */
  border-radius: 8px; /* Bordes redondeados para el textarea */
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  resize: vertical;
  outline: none;
  font-family: Arial, sans-serif;
  color: var(--color-gray-dark);
  background-color: transparent; /* Para que el fondo del composer se vea */
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
</style>
