<template>
    <div class="settings-sidebar">
        <div class="sidebar-header">
            <h3>{{ $t('systemAdministration.settings') }}</h3>
        </div>

        <nav class="sidebar-nav">
            <!-- ACCOUNT Section -->
            <div class="nav-group">
                <div class="nav-group-label">ACCOUNT</div>
                <div
                    v-for="item in accountItems"
                    :key="item.key"
                    :class="['nav-item', { active: activeSection === item.key }]"
                    @click="handleSectionChange(item.key)"
                >
                    <i :class="item.icon"></i>
                    <span class="nav-label">{{ item.label }}</span>
                </div>
            </div>

            <!-- WORKSPACE Section -->
            <div class="nav-group">
                <div class="nav-group-label">WORKSPACE</div>
                <div
                    v-for="item in workspaceItems"
                    :key="item.key"
                    :class="['nav-item', { active: activeSection === item.key }]"
                    @click="handleSectionChange(item.key)"
                >
                    <i :class="item.icon"></i>
                    <span class="nav-label">{{ item.label }}</span>
                </div>
            </div>

            <!-- SECURITY Section -->
            <div class="nav-group">
                <div class="nav-group-label">SECURITY</div>
                <div
                    v-for="item in securityItems"
                    :key="item.key"
                    :class="['nav-item', { active: activeSection === item.key }]"
                    @click="handleSectionChange(item.key)"
                >
                    <i :class="item.icon"></i>
                    <span class="nav-label">{{ item.label }}</span>
                </div>
            </div>
        </nav>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
    activeSection: {
        type: String,
        default: 'branding'
    }
});

const emit = defineEmits(['section-change']);

const accountItems = computed(() => [
    {
        key: 'branding',
        label: t('systemAdministration.branding'),
        icon: 'pi pi-palette'
    },
    {
        key: 'subscription',
        label: t('systemAdministration.subscription'),
        icon: 'pi pi-credit-card'
    }
]);

const workspaceItems = computed(() => [
    {
        key: 'notifications',
        label: t('systemAdministration.notifications'),
        icon: 'pi pi-bell'
    },
    {
        key: 'integrations',
        label: t('systemAdministration.integrations'),
        icon: 'pi pi-plug'
    }
]);

const securityItems = computed(() => [
    {
        key: 'policies',
        label: t('systemAdministration.globalPolicies'),
        icon: 'pi pi-shield'
    },
    {
        key: 'security',
        label: t('systemAdministration.security'),
        icon: 'pi pi-lock'
    }
]);

const handleSectionChange = (sectionKey) => {
    emit('section-change', sectionKey);
};
</script>

<style scoped>
.settings-sidebar {
    width: 280px;
    background: white;
    border-right: 1px solid #e9ecef;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.sidebar-header {
    padding: 2rem 1.5rem 1rem;
    border-bottom: 1px solid #f1f5f9;
}

.sidebar-header h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #1a1a1a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem;
}

.nav-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.nav-group-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.5rem 0;
    margin-bottom: 0.25rem;
    border-bottom: 1px solid #e5e7eb;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #374151;
    font-weight: 500;
}

.nav-item:hover {
    background-color: #f3f4f6;
    color: #1f2937;
}

.nav-item.active {
    background-color: #dbeafe;
    color: #1d4ed8;
    font-weight: 600;
}

.nav-item i {
    font-size: 1.125rem;
    width: 1.125rem;
    text-align: center;
}

.nav-label {
    font-size: 0.875rem;
}
</style>