// src/chat-hub/ChatHub.js

import { ChannelSidebar } from './components/channel-sidebar/channel-sidebar.js';
import { ChatWindow } from './components/chat-window/chat-window.js';
import { AiInsightsPanel } from './components/ai-insights-panel/ai-insights-panel.js';
import { PinnedAssetsPanel } from './components/pinned-assets-panel/pinned-assets-panel.js';

export class ChatHub {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with ID "${containerId}" not found.`);
            return;
        }
        this.render();
    }

    render() {
        // Load the HTML structure
        fetch('./ChatHub.html')
            .then(response => response.text())
            .then(html => {
                this.container.innerHTML = html;
                this.initializeComponents();
            })
            .catch(error => console.error('Error loading ChatHub HTML:', error));
    }

    initializeComponents() {
        // Initialize and render ChannelSidebar
        const channelSidebarContainer = this.container.querySelector('#channel-sidebar-container');
        if (channelSidebarContainer) {
            new ChannelSidebar(channelSidebarContainer);
        }

        // Initialize and render ChatWindow
        const chatWindowContainer = this.container.querySelector('#chat-window-container');
        if (chatWindowContainer) {
            new ChatWindow(chatWindowContainer);
        }

        // Initialize and render AiInsightsPanel
        const aiInsightsPanelContainer = this.container.querySelector('#ai-insights-panel-container');
        if (aiInsightsPanelContainer) {
            new AiInsightsPanel(aiInsightsPanelContainer);
        }

        // Initialize and render PinnedAssetsPanel
        const pinnedAssetsPanelContainer = this.container.querySelector('#pinned-assets-panel-container');
        if (pinnedAssetsPanelContainer) {
            new PinnedAssetsPanel(pinnedAssetsPanelContainer);
        }
    }
}

// Example of how to instantiate (assuming a div with id="app" in your main index.html)
// document.addEventListener('DOMContentLoaded', () => {
//     new ChatHub('app');
// });
