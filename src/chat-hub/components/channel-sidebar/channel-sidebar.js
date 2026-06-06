// src/chat-hub/components/channel-sidebar/channel-sidebar.js

export class ChannelSidebar {
    constructor(containerElement) {
        this.container = containerElement;
        this.render();
    }

    render() {
        fetch('./src/chat-hub/components/channel-sidebar/channel-sidebar.html')
            .then(response => response.text())
            .then(html => {
                this.container.innerHTML = html;
                this.addEventListeners();
            })
            .catch(error => console.error('Error loading ChannelSidebar HTML:', error));
    }

    addEventListeners() {
        // Example: Add click listener to channel items
        this.container.querySelectorAll('.channel-item').forEach(item => {
            item.addEventListener('click', (event) => {
                this.handleChannelClick(event.currentTarget);
            });
        });
    }

    handleChannelClick(clickedItem) {
        // Remove active class from previously active item
        this.container.querySelectorAll('.channel-item').forEach(item => {
            item.classList.remove('active');
        });
        // Add active class to the clicked item
        clickedItem.classList.add('active');
        const channelName = clickedItem.textContent.trim();
        console.log(`Channel selected: ${channelName}`);
        // In a real app, you would dispatch an event or call a service to load chat messages for this channel
    }
}
