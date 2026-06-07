<template>
  <div class="pinned-assets-panel card">
    <div class="card-header">
      <h3 class="card-title">PINNED ASSETS</h3>
    </div>
    <div class="card-body">
      <ul class="asset-list">
        <li class="asset-item">
          <div class="asset-icon excel">XLS</div>
          <div class="asset-info">
            <span class="asset-name">master_pmo_roadmap_v2.xls</span>
            <span class="asset-meta">Modified 2h ago</span>
          </div>
        </li>
        <li class="asset-item">
          <div class="asset-icon pdf">PDF</div>
          <div class="asset-info">
            <span class="asset-name">strategic_alignment_brief.pdf</span>
            <span class="asset-meta">Pinned by Marcus</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// Lógica del componente PinnedAssetsPanel
// Podrías añadir props para los datos de los assets, etc.
</script>

<style scoped>
@import url('../../../styles/_variables.css');

.pinned-assets-panel {
  background-color: var(--color-white);
  border-radius: 12px; /* Bordes redondeados de 12px */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08); /* Sombra tenue */
  overflow: hidden;
  font-family: Arial, sans-serif;
}

.pinned-assets-panel .card-header {
  padding: 1rem;
  border-bottom: 1px solid var(--color-gray-light);
  background-color: var(--color-gray-lightest);
}

.pinned-assets-panel .card-title {
  font-size: 0.9rem;
  font-weight: bold;
  margin: 0;
  color: var(--color-gray-dark);
  text-transform: uppercase;
}

.pinned-assets-panel .card-body {
  padding: 1rem; /* Padding interno generoso */
}

.pinned-assets-panel .asset-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.pinned-assets-panel .asset-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  cursor: pointer;
}

.pinned-assets-panel .asset-item:last-child {
  margin-bottom: 0;
}

.pinned-assets-panel .asset-icon {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: var(--color-white);
  font-size: 0.7rem;
  flex-shrink: 0;
  margin-right: 0.75rem;
}

.pinned-assets-panel .asset-icon.excel {
  background-color: #217346; /* Excel green */
}

.pinned-assets-panel .asset-icon.pdf {
  background-color: #b30b00; /* PDF red */
}

.pinned-assets-panel .asset-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.pinned-assets-panel .asset-name {
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--color-gray-dark);
  line-height: 1.3;
}

.pinned-assets-panel .asset-meta {
  font-size: 0.75rem;
  color: var(--color-gray-medium);
}
</style>
