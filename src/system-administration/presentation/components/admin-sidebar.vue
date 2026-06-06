<template>
    <Sidebar
        v-model:visible="isOpen"
        :showCloseIcon="true"
        class="admin-sidebar"
        @hide="$emit('close')"
    >
        <div class="sidebar-header">
            <h2>{{ $t('systemAdministration.administration') }}</h2>
        </div>

        <nav class="sidebar-nav">
            <router-link
                v-for="item in menuItems"
                :key="item.id"
                :to="item.path"
                class="nav-item"
                :class="{ active: isActive(item.path) }"
                @click="handleItemClick"
            >
                <i :class="item.icon"></i>
                <span>{{ $t(item.label) }}</span>
            </router-link>
        </nav>

        <Divider />

        <div class="sidebar-footer">
            <div class="admin-info">
                <div class="admin-avatar">
                    <i class="pi pi-user"></i>
                </div>
                <div class="admin-details">
                    <p class="admin-name">{{ adminName }}</p>
                    <p class="admin-role">{{ adminRole }}</p>
                </div>
            </div>
        </div>
    </Sidebar>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from 'primevue/sidebar';
import Divider from 'primevue/divider';

const props = defineProps({
    visible: Boolean,
    adminName: {
        type: String,
        default: 'Administrator'
    },
    adminRole: {
        type: String,
        default: 'System Admin'
    }
});

const emit = defineEmits(['update:visible', 'close']);

const route = useRoute();

const isOpen = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val)
});

const menuItems = [
    { id: 'dashboard', path: '/system-administration', label: 'systemAdministration.dashboard', icon: 'pi pi-home' },
    { id: 'branding', path: '/system-administration/branding', label: 'systemAdministration.branding', icon: 'pi pi-palette' },
    { id: 'subscription', path: '/system-administration/subscription', label: 'systemAdministration.subscription', icon: 'pi pi-credit' },
    { id: 'policies', path: '/system-administration/policies', label: 'systemAdministration.globalPolicies', icon: 'pi pi-shield' },
    { id: 'security', path: '/system-administration/security', label: 'systemAdministration.security', icon: 'pi pi-lock' },
    { id: 'notifications', path: '/system-administration/notifications', label: 'systemAdministration.notifications', icon: 'pi pi-bell' }
];

const isActive = (path) => {
    return route.path === path;
};

const handleItemClick = () => {
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
        isOpen.value = false;
    }
};
</script>

<style scoped>
.sidebar-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e9ecef;
}

.sidebar-header h2 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    color: #1a1a1a;
}

.sidebar-nav {
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    color: #666;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;
}

.nav-item:hover {
    background-color: #f3f4f6;
    color: #3b82f6;
}

.nav-item.active {
    background-color: #eff6ff;
    color: #3b82f6;
    border-left: 3px solid #3b82f6;
    padding-left: calc(1.5rem - 3px);
}

.nav-item i {
    width: 20px;
    text-align: center;
}

.sidebar-footer {
    padding: 1.5rem;
    border-top: 1px solid #e9ecef;
}

.admin-info {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.admin-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: #e0e7ff;
    color: #3b82f6;
    border-radius: 50%;
    font-size: 1.2rem;
}

.admin-details {
    flex: 1;
}

.admin-name {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 600;
    color: #1a1a1a;
}

.admin-role {
    margin: 0.25rem 0 0 0;
    font-size: 0.8rem;
    color: #999;
}
</style>
