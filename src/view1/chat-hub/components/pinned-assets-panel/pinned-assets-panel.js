// src/chat-hub/components/pinned-assets-panel/pinned-assets-panel.js

export class PinnedAssetsPanel {
    constructor(containerElement) {
        this.container = containerElement;
        this.render();
    }

    render() {
        fetch('./src/chat-hub/components/pinned-assets-panel/pinned-assets-panel.html')
            .then(response => response.text())
            .then(html => {
                this.container.innerHTML = html;
                this.addEventListeners();
            })
            .catch(error => console.error('Error loading PinnedAssetsPanel HTML:', error));
    }

    addEventListeners() {
        // Example: Add click listeners to asset items if needed
        this.container.querySelectorAll('.asset-item').forEach(item => {
            item.addEventListener('click', () => {
                const assetName = item.querySelector('.asset-name').textContent;
                console.log(`Pinned asset clicked: ${assetName}`);
                // In a real app, you might open the asset or show more details
            });
        });
    }
}
