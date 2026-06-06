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
            // Use varied Unsplash placeholder images for professional faces
            const unsplashAvatars = [
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=320&h=320&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=320&h=320&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                'https://images.unsplash.com/photo-1507003211169-e695c6edd231?auto=format&fit=crop&q=80&w=320&h=320&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=320&h=320&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=320&h=320&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            ];
            // Assign a random Unsplash avatar if none is provided
            const finalAvatarSrc = this.message.avatar || unsplashAvatars[Math.floor(Math.random() * unsplashAvatars.length)];
            avatar.src = finalAvatarSrc;
            avatar.alt = `${this.message.author} Avatar`;

            console.log('Message avatar data:', this.message.avatar); // Log the initial avatar data
            console.log('Assigned avatar src:', avatar.src); // Log the final assigned src
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
                const fileNameLower = attachment.name ? attachment.name.toLowerCase() : '';
                const isImage = fileNameLower.endsWith('.jpg') || fileNameLower.endsWith('.jpeg') || fileNameLower.endsWith('.png') || fileNameLower.endsWith('.gif');

                if (isImage && attachment.url) {
                    const imageElement = document.createElement('img');
                    imageElement.src = attachment.url;
                    imageElement.alt = attachment.name || 'Attached Image';
                    imageElement.classList.add('attached-image', 'max-w-full', 'h-auto', 'rounded-lg', 'shadow-md', 'my-2'); // Tailwind classes for styling
                    attachmentsContainer.appendChild(imageElement);
                } else {
                    const attachmentLink = document.createElement('a');
                    attachmentLink.href = attachment.url || '#'; // Use attachment URL if available
                    attachmentLink.target = '_blank'; // Open in new tab
                    // Updated classes for card-like appearance
                    attachmentLink.classList.add(
                        'attachment-item', 'flex', 'align-items-center', 'p-3', 'bg-white',
                        'border', 'border-slate-200', 'rounded-lg', 'hover:bg-slate-50',
                        'transition-colors', 'transition-duration-150',
                        'no-underline', 'text-color'
                    );

                    let iconClass = 'pi pi-file'; // Default icon
                    let iconColorClass = 'text-slate-500'; // Default color

                    if (attachment.name) {
                        if (fileNameLower.endsWith('.pdf')) {
                            iconClass = 'pi pi-file-pdf';
                            iconColorClass = 'text-red-500';
                        } else if (fileNameLower.endsWith('.doc') || fileNameLower.endsWith('.docx')) {
                            iconClass = 'pi pi-file-word';
                            iconColorClass = 'text-blue-500';
                        } else if (fileNameLower.endsWith('.xls') || fileNameLower.endsWith('.xlsx')) {
                            iconClass = 'pi pi-file-excel';
                            iconColorClass = 'text-green-500';
                        } else if (fileNameLower.endsWith('.ppt') || fileNameLower.endsWith('.pptx')) {
                            iconClass = 'pi pi-file-powerpoint';
                            iconColorClass = 'text-orange-500';
                        } else if (fileNameLower.endsWith('.zip') || fileNameLower.endsWith('.rar')) {
                            iconClass = 'pi pi-file-zip';
                            iconColorClass = 'text-purple-500';
                        } else if (isImage) { // This case is now handled by the image element above, but keeping for completeness if logic changes
                            iconClass = 'pi pi-image';
                            iconColorClass = 'text-teal-500';
                        }
                    }

                    attachmentLink.innerHTML = `
                        <i class="${iconClass} text-2xl ${iconColorClass} mr-3"></i>
                        <span class="text-sm font-medium text-900">${attachment.name}</span>
                    `;
                    attachmentsContainer.appendChild(attachmentLink);
                }
            });
        }
    }

    renderReactions() {
        const reactionsContainer = this.container.querySelector('.message-reactions');
        if (reactionsContainer && this.message.reactions && this.message.reactions.length > 0) {
            reactionsContainer.innerHTML = ''; // Clear existing
            this.message.reactions.forEach(reaction => {
                const reactionPill = document.createElement('div');
                // Updated classes for reaction pills
                reactionPill.classList.add(
                    'reaction-pill', 'flex', 'align-items-center', 'px-2', 'py-0.5', // py-0.5 for smaller height
                    'bg-slate-100', 'rounded-full', 'text-sm', 'cursor-pointer',
                    'hover:bg-slate-200', 'transition-colors', 'transition-duration-150',
                    'text-slate-700' // Ensure text color is readable
                );
                reactionPill.innerHTML = `
                    <span class="emoji mr-1">${reaction.emoji}</span>
                    <span class="count font-medium">${reaction.count}</span>
                `;
                reactionsContainer.appendChild(reactionPill);
            });
        }
    }
}