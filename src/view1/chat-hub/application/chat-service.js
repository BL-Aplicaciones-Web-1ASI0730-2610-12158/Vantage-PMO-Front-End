import { predefinedQuestions, chatCategories } from '../domain/chat-data.js';

export function getBotResponse(userQuestion) {
  const lowerCaseQuestion = userQuestion.toLowerCase();
  let response = { text: 'Lo siento, no logré entender tu consulta. Por favor, intenta refrasearla o elige una de las opciones del menú.', routeName: null };

  // Check for category-specific questions first
  for (const q of predefinedQuestions) {
    // Improved keyword matching: check if user question contains key phrases from predefined questions
    const keywords = q.question.toLowerCase().replace(/[¿?]/g, '').split(' ').filter(word => word.length > 2);
    if (keywords.some(keyword => lowerCaseQuestion.includes(keyword))) {
      response = { text: q.response, routeName: q.routeName };
      break;
    }
  }

  // If no specific question matched, check if the user is asking about categories
  if (!response.routeName && response.text.includes('Lo siento')) {
    if (lowerCaseQuestion.includes('categorías') || lowerCaseQuestion.includes('menu') || lowerCaseQuestion.includes('opciones')) {
      response.text = 'Claro, tengo preguntas sobre las siguientes categorías: ' + chatCategories.join(', ') + '. ¿Cuál te interesa?';
    }
  }

  return response;
}

export function getQuestionsByCategory(category) {
  return predefinedQuestions.filter(q => q.category === category);
}

export function getAllCategories() {
  return chatCategories;
}