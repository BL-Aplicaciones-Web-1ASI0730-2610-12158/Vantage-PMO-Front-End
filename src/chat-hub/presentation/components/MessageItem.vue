<template>
  <div class="message-row">
    <!-- Bloque de la Izquierda (.avatar-container) -->
    <div class="avatar-container">
      <img :src="messageAuthorAvatar" :alt="messageAuthorName + ' Avatar'" class="message-avatar" />
    </div>

    <!-- Bloque de la Derecha (.message-content-wrapper) -->
    <div class="message-content-wrapper">
      <!-- Línea Superior (.message-header) -->
      <div class="message-header">
        <span class="message-author">{{ messageAuthorName }}</span>
        <span class="message-timestamp">{{ message.timestamp }}</span>
      </div>
      <!-- Línea Inferior (.message-body) -->
      <p class="message-body">{{ message.text }}</p>

      <!-- Bloque de Archivos Adjuntos -->
      <div v-if="message.attachments && message.attachments.length" class="message-attachments">
        <a v-for="(attachment, index) in message.attachments" :key="index" :href="attachment.url" target="_blank" class="attachment-card">
          <span class="attachment-icon">{{ attachment.icon || '📄' }}</span>
          <span class="attachment-name">{{ attachment.name }}</span>
        </a>
      </div>

      <!-- Reacciones -->
      <div v-if="localReactions && localReactions.length" class="message-reactions">
        <div
          v-for="(reaction, index) in localReactions"
          :key="index"
          class="reaction-pill"
          @click="toggleReaction(reaction.emoji)"
        >
          <span class="emoji">{{ reaction.emoji }}</span>
          <span>{{ reaction.count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  users: { // Recibir la lista de usuarios para resolver el nombre
    type: Array,
    required: true
  }
});

// Usamos una ref local para las reacciones para poder modificarlas
const localReactions = ref([]);

// Inicializar localReactions con las props.message.reactions
watch(() => props.message.reactions, (newReactions) => {
  localReactions.value = newReactions ? JSON.parse(JSON.stringify(newReactions)) : [];
}, { immediate: true });

// Computed para obtener el nombre del autor del mensaje
const messageAuthorName = computed(() => {
  const author = props.users.find(user => user.id === props.message.authorId);
  return author ? author.name : 'Unknown User';
});

// Computed para obtener el avatar del autor del mensaje
const messageAuthorAvatar = computed(() => {
  const author = props.users.find(user => user.id === props.message.authorId);
  return author?.avatar || 'https://via.placeholder.com/40?text=?';
});

const toggleReaction = (emoji) => {
  const existingReactionIndex = localReactions.value.findIndex(r => r.emoji === emoji);

  if (existingReactionIndex !== -1) {
    // Si la reacción ya existe, la incrementamos
    localReactions.value[existingReactionIndex].count++;
  } else {
    // Si no existe, la añadimos con count 1
    localReactions.value.push({ emoji, count: 1 });
  }
  // En una aplicación real, aquí se enviaría la actualización al backend
  console.log(`Reaction ${emoji} toggled for message ${props.message.id}. New state:`, localReactions.value);
};
</script>

<style scoped>
@import url('../../styles/_variables.css');

/* Contenedor Padre General (.message-row) */
.message-row {
  display: flex;
  gap: 12px; /* Espacio entre avatar y contenido del mensaje */
  align-items: flex-start; /* Alinea el avatar y el texto al inicio */
  width: 100%; /* Ocupa todo el ancho disponible */
  margin-bottom: 20px; /* Margen inferior para separar mensajes */
}

/* Bloque de la Izquierda (.avatar-container) */
.avatar-container {
  width: 40px; /* Dimensiones fijas */
  height: 40px; /* Dimensiones fijas */
  min-width: 40px; /* Asegura que no se encoja */
  min-height: 40px; /* Asegura que no se encoja */
  border-radius: 50%; /* Hace el contenedor circular */
  overflow: hidden; /* Recorta la imagen para que sea circular */
  flex-shrink: 0; /* Evita que el contenedor se comprima */
}

/* La etiqueta <img> interior (.message-avatar) */
.message-avatar {
  width: 100%; /* La imagen ocupa todo el ancho del contenedor */
  height: 100%; /* La imagen ocupa todo el alto del contenedor */
  object-fit: cover; /* Asegura que la imagen cubra el área sin deformarse */
}

/* Bloque de la Derecha (.message-content-wrapper) */
.message-content-wrapper {
  flex-grow: 1; /* Ocupa el espacio restante */
  display: flex; /* Para organizar el header y el body verticalmente */
  flex-direction: column;
}

/* Línea Superior (.message-header) */
.message-header {
  display: flex;
  gap: 8px; /* Espacio entre nombre y timestamp */
  align-items: center; /* Alinea verticalmente nombre y timestamp */
  margin-bottom: 4px; /* Espacio debajo de la cabecera del mensaje */
}

.message-author {
  font-weight: 700; /* Negrita */
  color: var(--color-black); /* Negro para el nombre de usuario */
  font-size: 0.95rem;
}

.message-timestamp {
  font-size: 12px; /* Fuente pequeña */
  color: #9CA3AF; /* Gris claro */
}

/* Línea Inferior (.message-body) */
.message-body {
  color: #374151; /* Color de texto del mensaje */
  margin: 0; /* Asegura que no tenga márgenes por defecto */
  line-height: 1.5;
  font-size: 0.95rem;
}

/* Bloque de Archivos Adjuntos */
.message-attachments {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem; /* Espacio entre tarjetas de adjuntos */
  margin-top: 0.75rem;
}

.attachment-card {
  display: flex;
  align-items: center;
  background-color: #f4f5f7; /* Fondo gris muy claro */
  padding: 0.6rem 1rem; /* Padding interno */
  border-radius: 8px; /* Bordes redondeados */
  font-size: 0.85rem;
  color: var(--color-gray-dark);
  text-decoration: none;
  transition: background-color 0.2s ease;
  border: 1px solid var(--color-gray-light); /* Borde sutil */
}

.attachment-card:hover {
  background-color: var(--color-gray-light);
}

.attachment-icon {
  margin-right: 0.5rem;
  color: var(--color-primary-blue); /* Icono de documento azul */
  font-size: 1rem;
}

.attachment-name {
  font-weight: 500;
}

/* Reacciones */
.message-reactions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.reaction-pill {
  display: inline-flex;
  align-items: center;
  background-color: var(--color-gray-light);
  border-radius: 15px;
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
  color: var(--color-gray-dark);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.reaction-pill:hover {
  background-color: var(--color-gray-medium);
}

.reaction-pill .emoji {
  margin-right: 0.3rem;
}
</style>
