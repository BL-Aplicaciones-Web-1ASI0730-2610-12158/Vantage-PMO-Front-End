<template>
  <div class="message-row">
    <!-- Primer Hijo - Bloque de la Izquierda (.avatar-container) -->
    <div class="avatar-container">
      <img class="message-avatar" :src="message.avatar" :alt="message.author + ' Avatar'">
    </div>

    <!-- Segundo Hijo - Bloque de la Derecha (.message-content-wrapper) -->
    <div class="message-content-wrapper">
      <!-- Línea Superior (.message-header) -->
      <div class="message-header">
        <span class="message-author">{{ message.author }}</span>
        <span class="message-timestamp">{{ message.timestamp }}</span>
      </div>

      <!-- Línea Inferior (.message-body) -->
      <p class="message-body">{{ message.text }}</p>

      <!-- Bloque de Archivos Adjuntos -->
      <div v-if="message.attachments && message.attachments.length" class="message-attachments">
        <a v-for="(attachment, index) in message.attachments" :key="index" href="#" class="attachment-card">
          <span class="attachment-icon">{{ attachment.icon || '📄' }}</span>
          <span class="attachment-name">{{ attachment.name }}</span>
        </a>
      </div>

      <!-- Reacciones -->
      <div v-if="message.reactions && message.reactions.length" class="message-reactions">
        <div v-for="(reaction, index) in message.reactions" :key="index" class="reaction-pill">
          <span class="emoji">{{ reaction.emoji }}</span>
          <span>{{ reaction.count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
@import url('../../styles/_variables.css');

/* 1. Estructura de código HTML/JSX requerida */
/* Contenedor Padre General (.message-row) */
.message-row {
  display: flex;
  gap: 12px; /* Espacio entre avatar y contenido del mensaje */
  align-items: flex-start; /* Alinea el avatar y el texto al inicio */
  width: 100%; /* Ocupa todo el ancho disponible */
  margin-bottom: 16px; /* Margen inferior para separar mensajes */
}

/* Primer Hijo - Bloque de la Izquierda (.avatar-container) */
.avatar-container {
  width: 40px; /* Dimensiones fijas */
  height: 40px; /* Dimensiones fijas */
  min-width: 40px; /* Asegura que no se encoja */
  border-radius: 50%; /* Hace el contenedor circular */
  overflow: hidden; /* Recorta la imagen para que sea circular */
  flex-shrink: 0; /* Evita que el contenedor se comprima */
}

/* La etiqueta <img> interior */
.message-avatar {
  width: 100%; /* La imagen ocupa todo el ancho del contenedor */
  height: 100%; /* La imagen ocupa todo el alto del contenedor */
  object-fit: cover; /* Asegura que la imagen cubra el área sin deformarse */
}

/* Segundo Hijo - Bloque de la Derecha (.message-content-wrapper) */
.message-content-wrapper {
  flex-grow: 1; /* Ocupa el espacio restante */
}

/* Línea Superior (.message-header) */
.message-header {
  display: flex;
  gap: 8px; /* Espacio entre nombre y timestamp */
  align-items: center; /* Alinea verticalmente nombre y timestamp */
  margin-bottom: 4px; /* Espacio debajo de la cabecera del mensaje */
}

.message-author {
  font-weight: bold;
  color: var(--color-gray-dark);
  font-size: 0.95rem;
}

.message-timestamp {
  font-size: 0.8rem;
  color: var(--color-gray-medium);
}

/* Línea Inferior (.message-body) */
.message-body {
  margin: 0; /* Asegura que no tenga márgenes por defecto */
  line-height: 1.4;
  color: var(--color-gray-dark);
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
