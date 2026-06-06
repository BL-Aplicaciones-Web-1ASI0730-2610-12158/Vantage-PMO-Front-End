<template>
    <div class="integrations-section">
        <div class="section-header">
            <h2>{{ $t('systemAdministration.integrations') }}</h2>
            <p class="section-description">{{ $t('systemAdministration.integrationsDesc') }}</p>
        </div>

        <div class="integrations-grid">
            <div class="integration-card">
                <div class="integration-header">
                    <div class="integration-icon slack">
                        <i class="pi pi-slack"></i>
                    </div>
                    <div class="integration-info">
                        <h3>Slack</h3>
                        <p>{{ $t('systemAdministration.slackDesc') }}</p>
                    </div>
                </div>
                <div class="integration-actions">
                    <Button
                        :label="$t('systemAdministration.connect')"
                        icon="pi pi-link"
                        class="p-button-outlined"
                        @click="handleConnect('slack')"
                    />
                </div>
            </div>

            <div class="integration-card">
                <div class="integration-header">
                    <div class="integration-icon jira">
                        <i class="pi pi-external-link"></i>
                    </div>
                    <div class="integration-info">
                        <h3>Jira</h3>
                        <p>{{ $t('systemAdministration.jiraDesc') }}</p>
                    </div>
                </div>
                <div class="integration-actions">
                    <Button
                        :label="$t('systemAdministration.connect')"
                        icon="pi pi-link"
                        class="p-button-outlined"
                        @click="handleConnect('jira')"
                    />
                </div>
            </div>

            <div class="integration-card">
                <div class="integration-header">
                    <div class="integration-icon github">
                        <i class="pi pi-github"></i>
                    </div>
                    <div class="integration-info">
                        <h3>GitHub</h3>
                        <p>{{ $t('systemAdministration.githubDesc') }}</p>
                    </div>
                </div>
                <div class="integration-actions">
                    <Button
                        :label="$t('systemAdministration.connect')"
                        icon="pi pi-link"
                        class="p-button-outlined"
                        @click="handleConnect('github')"
                    />
                </div>
            </div>

            <div class="integration-card">
                <div class="integration-header">
                    <div class="integration-icon teams">
                        <i class="pi pi-microsoft"></i>
                    </div>
                    <div class="integration-info">
                        <h3>Microsoft Teams</h3>
                        <p>{{ $t('systemAdministration.teamsDesc') }}</p>
                    </div>
                </div>
                <div class="integration-actions">
                    <Button
                        :label="$t('systemAdministration.connect')"
                        icon="pi pi-link"
                        class="p-button-outlined"
                        @click="handleConnect('teams')"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Button from 'primevue/button';

const emit = defineEmits(['connect']);

const handleConnect = (integration) => {
    emit('connect', integration);
};
</script>

<style scoped>
.integrations-section {
    padding: 2rem;
}

.section-header {
    margin-bottom: 2rem;
}

.section-header h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.75rem;
    font-weight: 700;
    color: #1a1a1a;
}

.section-description {
    margin: 0;
    color: #64748b;
    font-size: 1rem;
    line-height: 1.5;
}

.integrations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1.5rem;
}

.integration-card {
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s ease;
}

.integration-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border-color: #cbd5e1;
}

.integration-header {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.integration-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
}

.integration-icon.slack {
    background: #4a154b;
    color: white;
}

.integration-icon.jira {
    background: #0052cc;
    color: white;
}

.integration-icon.github {
    background: #24292e;
    color: white;
}

.integration-icon.teams {
    background: #464eb8;
    color: white;
}

.integration-info h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #1a1a1a;
}

.integration-info p {
    margin: 0;
    color: #64748b;
    font-size: 0.9rem;
}

.integration-actions {
    flex-shrink: 0;
}
</style>