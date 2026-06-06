// src/chat-hub/components/ai-insights-panel/ai-insights-panel.js

export class AiInsightsPanel {
    constructor(containerElement) {
        this.container = containerElement;
        this.render();
    }

    render() {
        fetch('./src/chat-hub/components/ai-insights-panel/ai-insights-panel.html')
            .then(response => response.text())
            .then(html => {
                this.container.innerHTML = html;
            })
            .catch(error => console.error('Error loading AiInsightsPanel HTML:', error));
    }
}