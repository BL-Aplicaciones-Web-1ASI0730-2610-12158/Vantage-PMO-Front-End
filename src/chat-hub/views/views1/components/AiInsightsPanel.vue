<template>
  <div class="ai-insights-panel">
    <div class="card-content-wrapper">
      <!-- Cabecera de la Tarjeta: Icono y Título -->
      <div class="card-header-section">
        <i class="pi pi-sparkles ai-icon"></i>
        <h3 class="card-title">AI INSIGHTS</h3>
      </div>

      <!-- Subetiqueta de Reunión y Tiempo -->
      <div class="meeting-meta">
        <span class="meeting-tag">{{ meetingTag }}</span>
        <span class="time-ago">{{ timeAgo }}</span>
      </div>
      <!-- Título del Meeting -->
      <h4 class="meeting-title">{{ meetingTitle }}</h4>

      <!-- Lista de Insights (Decisiones y Acciones) -->
      <ul class="insights-list">
        <li v-for="insight in insightsList" :key="insight.id" class="insight-item">
          <i :class="['insight-icon', insight.iconClass]"></i>
          <p><span class="insight-type">{{ insight.type }}:</span> {{ insight.text }}</p>
        </li>
      </ul>

      <!-- Barra de Sentimiento (Channel Sentiment) -->
      <div class="sentiment-section">
        <span class="sentiment-label-title">CHANNEL SENTIMENT</span>
        <div class="sentiment-bar-row">
          <div class="sentiment-bar-container">
            <div class="sentiment-bar productive" :style="{ width: sentimentProductivePercentage + '%' }"></div>
            <div class="sentiment-bar unproductive" :style="{ width: (100 - sentimentProductivePercentage) + '%' }"></div>
          </div>
          <span class="sentiment-text">{{ sentimentText }}</span>
        </div>
      </div>
    </div>

    <!-- Botón Inferior de Transcripción (CTA Button) -->
    <div class="card-footer">
      <button class="full-transcript-button" @click="viewFullTranscript">VIEW FULL TRANSCRIPT</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useDialog } from 'primevue/usedialog'; // Importar useDialog
import FullTranscriptDialog from './FullTranscriptDialog.vue'; // Importar el nuevo componente de diálogo

const dialog = useDialog(); // Inicializar useDialog

// Datos reactivos para el panel de insights
const meetingTag = ref('');
const timeAgo = ref('');
const meetingTitle = ref('');
const insightsList = ref([]);
const sentimentProductivePercentage = ref(0);
const sentimentText = ref('');

// Función para cargar los datos (simulada)
const loadInsights = () => {
  meetingTag.value = 'RECENT MEETING';
  timeAgo.value = '45m ago';
  meetingTitle.value = 'Q3 Planning Sync: Steering Committee';
  insightsList.value = [
    { id: 1, type: 'Decision', iconClass: 'pi pi-check-square check', text: 'Approved 12% budget shift to infrastructure phase.' },
    { id: 2, type: 'Action', iconClass: 'pi pi-exclamation-circle action', text: 'Elena to finalize Gantt by EOD Friday.' },
  ];
  sentimentProductivePercentage.value = 90; // 90% productivo
  sentimentText.value = 'Productive';
};

// Función para el botón "VIEW FULL TRANSCRIPT"
const viewFullTranscript = () => {
  dialog.open(FullTranscriptDialog, {
    props: {
      header: 'Full Meeting Transcript',
      modal: true,
      style: { width: '60vw' }, // Ancho del diálogo, ajusta según necesidad
      breakpoints:{ '960px': '75vw', '641px': '100vw' }
    },
    // Puedes pasar datos al FullTranscriptDialog si fuera necesario
    // data: {
    //   meetingId: 'Q3-Planning-Sync'
    // }
  });
};

// Cargar los insights cuando el componente se monte
onMounted(() => {
  loadInsights();
});
</script>

<style scoped>
@import url('../../../styles/_variables.css');

.ai-insights-panel {
  background-color: var(--color-white); /* Fondo blanco puro */
  border-radius: 12px; /* Esquinas redondeadas */
  padding: 0; /* El padding se manejará dentro de .card-content-wrapper */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* Sombra muy sutil */
  overflow: hidden; /* Asegura que los bordes redondeados se apliquen a los hijos */
  font-family: Arial, sans-serif;
  display: flex; /* Para que el footer se pegue abajo */
  flex-direction: column;
}

.card-content-wrapper {
  padding: 20px; /* Padding interno generoso */
  flex-grow: 1; /* Permite que el contenido crezca */
}

.card-header-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 1rem; /* Espacio debajo del título principal */
}

.ai-icon {
  font-size: 1.2rem;
  color: #00bcd4; /* Turquesa/verde brillante para el icono de IA */
}

.card-title {
  font-size: 0.9rem;
  font-weight: bold;
  margin: 0;
  color: var(--color-gray-dark); /* Gris oscuro/negro */
  text-transform: uppercase;
}

.meeting-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.meeting-tag {
  font-size: 0.75rem;
  color: var(--color-ai-insights-green); /* Verde para "RECENT MEETING" */
  font-weight: bold;
  text-transform: uppercase;
}

.time-ago {
  font-size: 0.75rem;
  color: var(--color-gray-medium); /* Gris claro para el tiempo */
}

.meeting-title {
  font-size: 1.1rem; /* Fuente más grande */
  font-weight: 700; /* Negrita */
  color: var(--color-gray-dark); /* Color oscuro destacado */
  margin-top: 0;
  margin-bottom: 1.5rem; /* Espacio debajo del título de la reunión */
}

.insights-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0; /* Espacio debajo de la lista de insights */
}

.insight-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-bottom: 12px;
  font-size: 0.9rem;
  color: var(--color-gray-dark);
}

.insight-item p {
  margin: 0; /* Eliminar margen por defecto del párrafo */
  line-height: 1.4;
}

.insight-item .insight-type {
  font-weight: bold; /* "Decision:" y "Action:" en negrita */
}

.insight-icon {
  font-size: 1rem;
  flex-shrink: 0; /* Evita que el icono se comprima */
  width: 20px; /* Ancho fijo para el icono */
  height: 20px; /* Alto fijo para el icono */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px; /* Bordes sutilmente redondeados para el icono */
}

.insight-icon.check {
  color: var(--color-white); /* Check blanco */
  background-color: var(--color-ai-insights-green); /* Fondo verde */
}

.insight-icon.action {
  color: var(--color-white); /* Exclamación blanca */
  background-color: var(--color-primary-blue); /* Fondo azul */
  border-radius: 50%; /* Circular para el icono de acción */
}

.sentiment-section {
  margin-top: 1rem;
}

.sentiment-label-title {
  font-size: 0.85rem;
  color: var(--color-gray-medium); /* Gris medio */
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

.sentiment-bar-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sentiment-bar-container {
  flex-grow: 1;
  height: 6px;
  border-radius: 9999px; /* Muy redondeado (píldora) */
  background: #e5e7eb; /* Fondo gris claro de la barra */
  position: relative;
  overflow: hidden;
  display: flex; /* Para que las barras internas se alineen */
}

.sentiment-bar.productive {
  background-color: var(--color-productive-green); /* Verde */
}

.sentiment-bar.unproductive {
  background-color: var(--color-unproductive-red); /* Rojo */
}

.sentiment-text {
  font-size: 0.8rem;
  color: var(--color-gray-medium); /* Gris o verde, según el diseño */
  flex-shrink: 0; /* Evita que el texto se comprima */
}

.card-footer {
  padding: 1rem 20px; /* Padding para el footer, consistente con el wrapper */
  border-top: 1px solid var(--color-gray-light); /* Separador */
  background-color: var(--color-gray-lightest); /* Fondo del footer */
}

.full-transcript-button {
  width: 100%; /* Ocupa todo el ancho */
  background-color: #1e293b; /* Gris muy oscuro/negro */
  color: var(--color-white); /* Texto blanco */
  border: none;
  padding: 0.75rem 1rem; /* Padding vertical cómodo */
  border-radius: 6px; /* Esquinas sutilmente redondeadas */
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase; /* Texto en mayúsculas */
  transition: background-color 0.2s ease;
}

.full-transcript-button:hover {
  background-color: #334155; /* Un tono un poco más claro al pasar el ratón */
}
</style>
