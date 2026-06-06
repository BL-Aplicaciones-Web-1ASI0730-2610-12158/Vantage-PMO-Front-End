// src/chat-hub/components/chat-window/chat-window.js

import { MessageItem } from '../message-item/message-item.js';

export class ChatWindow {
    constructor(containerElement) {
        this.container = containerElement;
        this.render();
    }

    render() {
        fetch('./src/chat-hub/components/chat-window/chat-window.html')
            .then(response => response.text())
            .then(html => {
                this.container.innerHTML = html;
                this.initializeMessageItems();
                this.addEventListeners();
            })
            .catch(error => console.error('Error loading ChatWindow HTML:', error));
    }

    initializeMessageItems() {
        // Example messages - in a real app, these would come from a service
        const messages = [
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
        ];

        messages.forEach((msg, index) => {
            const messageContainer = this.container.querySelector(`#message-item-container-${index + 1}`);
            if (messageContainer) {
                new MessageItem(messageContainer, msg);
            }
        });
    }

    addEventListeners() {
        // Add event listeners for toolbar buttons, send button, etc.
        const sendButton = this.container.querySelector('.send-button');
        if (sendButton) {
            sendButton.addEventListener('click', () => this.sendMessage());
        }

        const messageInput = this.container.querySelector('.message-input');
        if (messageInput) {
            messageInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    this.sendMessage();
                }
            });
        }
    }

    sendMessage() {
        const messageInput = this.container.querySelector('.message-input');
        const messageText = messageInput.value.trim();
        if (messageText) {
            console.log('Sending message:', messageText);
            // In a real application, you would send this message via a service
            // and then add it to the message list.
            messageInput.value = ''; // Clear the input
        }
    }
}
