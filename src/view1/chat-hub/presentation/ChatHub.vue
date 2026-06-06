<template>
  <div class="chat-hub-container">
    <h1 class="chat-hub-title">Chat Hub</h1>

    <div class="chat-window">
      <div class="messages" ref="messagesContainer">
        <div v-for="(message, index) in messages" :key="index" :class="['message', message.sender]">
          <p>{{ message.text }}</p>
          <button v-if="message.routeName" @click="goToRoute(message.routeName)" class="navigate-button">
            Ir a {{ getRouteDisplayName(message.routeName) }}
          </button>
        </div>
      </div>

      <div class="category-menu">
        <button
          v-for="category in allCategories"
          :key="category"
          @click="selectCategory(category)"
          :class="['category-button', { 'active-category': selectedCategory === category }]"
        >
          {{ category }}
        </button>
      </div>

      <div class="quick-questions" v-if="displayedQuickQuestions.length > 0">
        <button
          v-for="(q, index) in displayedQuickQuestions"
          :key="index"
          @click="selectQuestion(q.question)"
          class="quick-question-button"
        >
          {{ q.question }}
        </button>
      </div>

      <div class="input-area">
        <input
          v-model="userInput"
          @keyup.enter="sendMessage"
          placeholder="Haz una pregunta..."
          class="chat-input"
        />
        <button @click="sendMessage" class="send-button">Enviar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { predefinedQuestions } from '../domain/chat-data.js'; // Still needed for initial data structure reference if not using service for all
import { getBotResponse, getQuestionsByCategory, getAllCategories } from '../application/chat-service.js';

export default {
  name: 'ChatHub',
  data() {
    return {
      userInput: '',
      messages: [
        { sender: 'bot', text: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy? Puedes empezar seleccionando una categoría o escribiendo tu pregunta.' },
      ],
      allCategories: [],
      selectedCategory: 'General', // Default selected category
      displayedQuickQuestions: [],
    };
  },
  created() {
    this.allCategories = getAllCategories();
    this.selectCategory(this.selectedCategory); // Load initial quick questions
  },
  updated() {
    this.scrollToBottom();
  },
  methods: {
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    sendMessage() {
      if (this.userInput.trim() === '') return;

      this.messages.push({ sender: 'user', text: this.userInput });
      this.processBotResponse(this.userInput);
      this.userInput = '';
    },
    selectQuestion(question) {
      this.userInput = question;
      this.sendMessage();
    },
    selectCategory(category) {
      this.selectedCategory = category;
      this.displayedQuickQuestions = getQuestionsByCategory(category);
      // Optionally, add a bot message indicating the selected category
      this.messages.push({ sender: 'bot', text: `Has seleccionado la categoría: ${category}. Aquí tienes algunas preguntas rápidas:` });
    },
    processBotResponse(userQuestion) {
      const botResponse = getBotResponse(userQuestion);
      this.messages.push({ sender: 'bot', text: botResponse.text, routeName: botResponse.routeName });
    },
    goToRoute(routeName) {
      this.$router.push({ name: routeName });
    },
    getRouteDisplayName(routeName) {
      const routeMap = {
        'active-projects': 'Proyectos Activos',
        'settings': 'Ajustes',
        'support': 'Soporte',
        'profile': 'Perfil',
        'reports': 'Reportes',
        'schedule': 'Agenda',
        'meetings': 'Reuniones',
        'system-administration': 'Administración del Sistema',
        'team': 'Equipo',
      };
      return routeMap[routeName] || routeName;
    }
  },
};
</script>

<style scoped>
.chat-hub-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  background-color: var(--bg-content);
  font-family: var(--sans);
  color: var(--text-primary);
  max-width: 900px;
  margin: 0 auto;
}

.chat-hub-title {
  color: var(--text-primary);
  margin-bottom: 25px;
  text-align: center;
  font-size: 2em;
  font-weight: bold;
}

.chat-window {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-card);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.messages {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  margin-bottom: 5px;
  padding: 12px 18px;
  border-radius: 20px;
  max-width: 75%;
  word-wrap: break-word;
  line-height: 1.5;
  font-size: 0.95em;
}

.message.user {
  background-color: var(--active-color);
  color: white;
  align-self: flex-end;
  margin-left: auto;
  border-bottom-right-radius: 4px;
}

.message.bot {
  background-color: var(--hover-bg);
  color: var(--text-primary);
  align-self: flex-start;
  margin-right: auto;
  border-bottom-left-radius: 4px;
}

.message p {
  margin: 0;
}

.navigate-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 0.85em;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.navigate-button:hover {
  background-color: #218838;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.category-menu {
  padding: 10px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  background-color: var(--bg-card);
}

.category-button {
  background-color: var(--input-bg);
  color: var(--text-secondary);
  border: 1px solid var(--input-border);
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s ease;
}

.category-button:hover {
  background-color: var(--hover-bg);
  color: var(--text-primary);
  border-color: var(--active-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.category-button.active-category {
  background-color: var(--active-color);
  color: white;
  border-color: var(--active-color);
}

.quick-questions {
  padding: 15px 20px;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  background-color: var(--bg-card);
}

.quick-question-button {
  background-color: var(--input-bg);
  color: var(--text-secondary);
  border: 1px solid var(--input-border);
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s ease;
}

.quick-question-button:hover {
  background-color: var(--hover-bg);
  color: var(--text-primary);
  border-color: var(--active-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.input-area {
  display: flex;
  padding: 15px 20px;
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-card);
}

.chat-input {
  flex-grow: 1;
  padding: 12px 15px;
  border: 1px solid var(--input-border);
  background-color: var(--input-bg);
  color: var(--text-primary);
  border-radius: 8px;
  margin-right: 10px;
  font-size: 1em;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.chat-input:focus {
  outline: none;
  border-color: var(--active-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2); /* Using a hardcoded rgba for active-color-rgb */
}

.send-button {
  background-color: var(--active-color);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 600;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.send-button:hover {
  background-color: #1a56db;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .chat-hub-container {
    padding: 15px;
  }

  .chat-hub-title {
    font-size: 1.8em;
    margin-bottom: 20px;
  }

  .messages {
    padding: 15px;
  }

  .message {
    max-width: 85%;
    padding: 10px 15px;
  }

  .category-menu,
  .quick-questions {
    padding: 10px 15px;
    gap: 8px;
  }

  .category-button,
  .quick-question-button {
    padding: 7px 12px;
    font-size: 0.85em;
  }

  .input-area {
    padding: 10px 15px;
  }

  .chat-input {
    padding: 10px 12px;
    font-size: 0.95em;
  }

  .send-button {
    padding: 10px 20px;
    font-size: 0.95em;
  }
}
</style>