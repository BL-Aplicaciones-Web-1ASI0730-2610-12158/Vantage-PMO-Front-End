// src/chat-hub/components/message-item/message-item.js

export class MessageItem {
    constructor(containerElement, messageData) {
        this.container = containerElement;
        this.message = messageData;
        this.render();
    }

    render() {
        fetch('./src/chat-hub/components/message-item/message-item.html')
            .then(response => response.text())
            .then(html => {
                this.container.innerHTML = html;
                this.populateMessageData();
            })
            .catch(error => console.error('Error loading MessageItem HTML:', error));
    }

    populateMessageData() {
        const avatar = this.container.querySelector('.message-avatar');
        if (avatar) {
            avatar.src = this.message.avatar;
            avatar.alt = `${this.message.author} Avatar`;
        }

        const author = this.container.querySelector('.message-author');
        if (author) {
            author.textContent = this.message.author;
        }

        const timestamp = this.container.querySelector('.message-timestamp');
        if (timestamp) {
            timestamp.textContent = this.message.timestamp;
        }

        const text = this.container.querySelector('.message-text');
        if (text) {
            text.textContent = this.message.text;
        }

        this.renderAttachments();
        this.renderReactions();
    }

    renderAttachments() {
        const attachmentsContainer = this.container.querySelector('.message-attachments');
        if (attachmentsContainer && this.message.attachments && this.message.attachments.length > 0) {
            attachmentsContainer.innerHTML = ''; // Clear existing
            this.message.attachments.forEach(attachment => {
                const attachmentItem = document.createElement('a');
                attachmentItem.href = '#'; // Placeholder for actual file link
                attachmentItem.classList.add('attachment-item');
                attachmentItem.innerHTML = `
                    <span class="attachment-icon">${attachment.icon || '📄'}</span>
                    <span>${attachment.name}</span>
                `;
                attachmentsContainer.appendChild(attachmentItem);
            });
        }
    }

    renderReactions() {
        const reactionsContainer = this.container.querySelector('.message-reactions');
        if (reactionsContainer && this.message.reactions && this.message.reactions.length > 0) {
            reactionsContainer.innerHTML = ''; // Clear existing
            this.message.reactions.forEach(reaction => {
                const reactionPill = document.createElement('div');
                reactionPill.classList.add('reaction-pill');
                reactionPill.innerHTML = `
                    <span class="emoji">${reaction.emoji}</span>
                    <span>${reaction.count}</span>
                `;
                reactionsContainer.appendChild(reactionPill);
            });
        }
    }
}
