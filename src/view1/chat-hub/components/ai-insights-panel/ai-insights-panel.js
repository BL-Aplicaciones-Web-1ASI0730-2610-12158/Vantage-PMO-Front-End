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
                this.addEventListeners();
            })
            .catch(error => console.error('Error loading AiInsightsPanel HTML:', error));
    }

    addEventListeners() {
        const viewTranscriptButton = this.container.querySelector('.full-transcript-button');
        if (viewTranscriptButton) {
            viewTranscriptButton.addEventListener('click', () => {
                console.log('View Full Transcript button clicked!');
                // Implement logic to show full transcript
            });
        }
    }
}
