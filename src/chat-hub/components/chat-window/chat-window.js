// src/chat-hub/components/chat-window/chat-window.js

import { MessageItem } from '../message-item/message-item.js';

export class ChatWindow {
    constructor(containerElement) {
        this.container = containerElement;
        // Initialize messages as a class property
        this.messages = [
            {
                id: 'msg1',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150', // Marcus Vane
                author: 'Marcus J.',
                timestamp: '10:30 AM',
                text: 'Team, great progress on the Q3 planning. Let\'s ensure all strategic alignment documents are finalized by end of day.',
                attachments: [],
                reactions: [{ emoji: '👍', count: 3 }, { emoji: '🎉', count: 1 }]
            },
            {
                id: 'msg2',
                avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150', // Elena Rodriguez
                author: 'Elena L.',
                timestamp: '10:35 AM',
                text: 'Agreed, Marcus. I\'m currently reviewing the resource_reallocation_impact.pdf. It looks solid. I\'ll upload the final version shortly.',
                attachments: [{ name: 'resource_reallocation_impact.pdf', url: 'https://www.africau.edu/images/default/sample.pdf' }],
                reactions: [{ emoji: '🚀', count: 1 }, { emoji: '✅', count: 2 }]
            },
            {
                id: 'msg3',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150', // Marcus Vane
                author: 'Marcus J.',
                timestamp: '10:40 AM',
                text: 'Excellent, Elena. Once you\'re done, please upload the final version to the shared drive. Also, remember to check the Q3 budget spreadsheet.',
                attachments: [{ name: 'Q3_Budget_Overview.xlsx', url: 'https://file-examples.com/storage/fe53f1f0616347200a04576/2017/02/file_example_XLSX_10.xlsx' }],
                reactions: []
            },
            {
                id: 'msg4',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150', // Sarah Jenkins (used for David Chen as a distinct placeholder)
                author: 'David Chen',
                timestamp: '10:45 AM',
                text: 'I\'ve just finished my part on the strategic alignment document. Ready for review!',
                attachments: [],
                reactions: [{ emoji: '👏', count: 1 }]
            }
        ];
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
        const messageListContainer = this.container.querySelector('.message-list');
        if (messageListContainer) {
            // Remove all dynamically added message items, keep the date separator
            Array.from(messageListContainer.children).forEach(child => {
                if (child.id && child.id.startsWith('message-item-container-')) {
                    child.remove();
                }
            });

            this.messages.forEach((msg, index) => { // Use this.messages
                const messageContainer = document.createElement('div');
                messageContainer.id = `message-item-container-${index + 1}`;
                messageListContainer.appendChild(messageContainer);
                new MessageItem(messageContainer, msg);
            });
            // Scroll to the bottom of the chat window to show the latest message
            messageListContainer.scrollTop = messageListContainer.scrollHeight;
        }
    }

    addEventListeners() {
        const sendButton = this.container.querySelector('.message-input-area .input-controls .send-button');
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
            // Create a new message object
            const newMessage = {
                id: `msg${this.messages.length + 1}`,
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150', // Placeholder for current user
                author: 'You', // Assuming the sender is 'You' for now
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                text: messageText,
                attachments: [],
                reactions: []
            };

            // Add the new message to the messages array
            this.messages.push(newMessage);

            // Re-render the messages to display the new one
            this.initializeMessageItems();

            // Clear the input field
            messageInput.value = '';
        }
    }
}