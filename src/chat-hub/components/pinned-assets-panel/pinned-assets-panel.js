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
                // In a real app, you might have a method here to populate dynamic pinned assets
                // this.populatePinnedAssets();
            })
            .catch(error => console.error('Error loading PinnedAssetsPanel HTML:', error));
    }

    // Example method to dynamically populate assets if needed
    populatePinnedAssets(assetsData) {
        const ulElement = this.container.querySelector('.pinned-assets-panel ul');
        if (!ulElement || !assetsData || assetsData.length === 0) return;

        ulElement.innerHTML = ''; // Clear static content

        assetsData.forEach(asset => {
            const li = document.createElement('li');
            li.classList.add('flex', 'align-items-center', 'mb-3');

            let iconClass = 'pi pi-file'; // Default icon
            let iconColorClass = 'text-500'; // Default color

            if (asset.name) {
                const fileNameLower = asset.name.toLowerCase();
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
                } else if (fileNameLower.endsWith('.jpg') || fileNameLower.endsWith('.png') || fileNameLower.endsWith('.gif')) {
                    iconClass = 'pi pi-image';
                    iconColorClass = 'text-teal-500';
                }
            }

            li.innerHTML = `
                <i class="${iconClass} ${iconColorClass} text-2xl mr-3"></i>
                <div class="flex flex-column">
                    <span class="font-medium text-900">${asset.name}</span>
                    <span class="text-sm text-600">${asset.metadata}</span>
                </div>
            `;
            ulElement.appendChild(li);
        });
    }
}