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
import ChannelSidebar from './components/ChannelSidebar.vue';
import ChatWindow from './components/ChatWindow.vue';
import AiInsightsPanel from './components/AiInsightsPanel.vue';
import PinnedAssetsPanel from './components/PinnedAssetsPanel.vue';
</script>

<style scoped>
@import url('../styles/_variables.css');

/* 1. El Contenedor Padre Central (ChatHubContainer) */
.chat-hub-wrapper {
  height: calc(100vh - 70px); /* Altura calculada para ocupar el espacio de trabajo disponible */
  overflow: hidden; /* Evita el scroll general del navegador */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-gray-lightest); /* Fondo general de la app */
}

.chat-hub-container {
  display: flex;
  width: 100%;
  height: 100%; /* Ocupa el 100% del chat-hub-wrapper */
  border-radius: 8px; /* Bordes redondeados para el contenedor general del chat */
  overflow: hidden; /* Asegura que los bordes redondeados se apliquen correctamente a los hijos */
  font-family: Arial, sans-serif; /* Fuente por defecto */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Sombra sutil para el contenedor principal */
}

/* 2. Columna Izquierda: Panel de Canales y DMs */
.chat-hub-sidebar {
  flex: 0 0 260px; /* Ancho fijo y compacto */
  background-color: #f5f7fa; /* Fondo gris muy claro uniforme */
  border-right: 1px solid var(--color-gray-light);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* 3. Columna Central: Ventana del Chat */
.chat-hub-main-content {
  flex: 1; /* Flexible y toma todo el espacio restante */
  background-color: #ffffff; /* Fondo blanco puro */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Vital para fijar cabecera y input */
  height: 100%; /* Asegura que ocupe toda la altura disponible */
  box-sizing: border-box;
}

/* 4. Columna Derecha: Panel de AI Insights y Pinned Assets */
.chat-hub-info-panel {
  flex: 0 0 320px; /* Ancho fijo y compacto */
  background-color: #f5f7fa; /* Fondo gris muy sutil, igual que la izquierda */
  border-left: 1px solid var(--color-gray-light);
  display: flex;
  flex-direction: column;
  padding: 16px; /* Padding interno */
  box-sizing: border-box;
  gap: 16px; /* Espaciado entre las tarjetas */
}
</style>
