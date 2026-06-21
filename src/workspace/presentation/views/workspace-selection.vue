<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useWorkspaceStore } from '../../application/workspace.store.js';
import useIamStore from '../../../iam/application/iam.store.js';

const router = useRouter();
const workspaceStore = useWorkspaceStore();
const iamStore = useIamStore();

const selectedWorkspace = ref(null);
const loading = ref(false);
const error = ref('');

const workspaceOptions = [
  {
    id: 'project-leader',
    name: 'Project Leader',
    icon: 'pi pi-compass',
    description: 'Manage projects, teams, and deliverables with comprehensive project oversight.',
    color: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    features: ['Project Management', 'Team Coordination', 'Instant Sprint Reports']
  },
  {
    id: 'enterprise-owner',
    name: 'Enterprise/Owner',
    icon: 'pi pi-building',
    description: 'Strategic oversight, portfolio management, and enterprise-level reporting.',
    color: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    features: ['Portfolio Management', 'Resource Planning', 'Executive Reporting']
  }
];

const selectWorkspace = async () => {
  if (!selectedWorkspace.value) {
    error.value = 'Please select a workspace';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    // Save workspace selection to current user
    await workspaceStore.setUserWorkspace(selectedWorkspace.value, iamStore.currentUserId);

    // Redirect to dashboard
    router.push({ name: 'home' });
  } catch (err) {
    error.value = 'Failed to save workspace selection. Please try again.';
    console.error('Error:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="workspace-page">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-brand">
          <div class="logo-icon">
            <i class="pi pi-compass"></i>
          </div>
          <span class="brand-text">Vantage PMO</span>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="workspace-main">
      <div class="workspace-card">
        <div class="card-header">
          <h1>Select Your Workspace</h1>
          <p>Choose how you'd like to work with Vantage PMO</p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="error-message">
          <i class="pi pi-exclamation-circle"></i>
          {{ error }}
        </div>

        <!-- Workspace Options -->
        <div class="workspace-grid">
          <div
            v-for="option in workspaceOptions"
            :key="option.id"
            class="workspace-option"
            :class="{ selected: selectedWorkspace === option.id }"
            @click="selectedWorkspace = option.id"
          >
            <div class="option-header" :style="{ background: option.color }">
              <i :class="option.icon"></i>
            </div>
            <div class="option-content">
              <h3 class="option-name">{{ option.name }}</h3>
              <p class="option-description">{{ option.description }}</p>
              <div class="option-features">
                <div
                  v-for="(feature, idx) in option.features"
                  :key="idx"
                  class="feature-tag"
                >
                  <i class="pi pi-check-circle"></i>
                  {{ feature }}
                </div>
              </div>
            </div>
            <div class="option-checkbox">
              <div class="checkbox" :class="{ checked: selectedWorkspace === option.id }">
                <i v-if="selectedWorkspace === option.id" class="pi pi-check"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Continue Button -->
        <div class="form-actions">
          <pv-button
            label="Continue to Dashboard"
            :loading="loading"
            :disabled="!selectedWorkspace || loading"
            @click="selectWorkspace"
            class="continue-btn"
          />
        </div>

        <!-- Info Text -->
        <div class="info-text">
          <i class="pi pi-info-circle"></i>
          <p>You can change your workspace setting anytime from your account preferences.</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-container">
        <p>&copy; 2026 Vantage PMO. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.workspace-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: radial-gradient(circle at 20% 50%, rgba(37, 99, 235, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
              linear-gradient(135deg, #ffffff 0%, #f5f7fb 100%);
  font-family: 'Inter', sans-serif;
}

/* Navbar */
.navbar {
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: 12px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
}

.brand-text {
  font-weight: 700;
  font-size: 14px;
  color: #1e293b;
}

/* Main Content */
.workspace-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
}

.workspace-card {
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 16px;
  padding: 48px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.card-header {
  text-align: center;
  margin-bottom: 36px;
}

.card-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px;
}

.card-header p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 24px;
}

.workspace-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.workspace-option {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.workspace-option:hover {
  border-color: #2563eb;
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.1);
}

.workspace-option.selected {
  border-color: #2563eb;
  background: #f0f9ff;
  box-shadow: 0 12px 32px rgba(37, 99, 235, 0.15);
}

.option-header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
}

.option-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-name {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.option-description {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.option-features {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}

.feature-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #475569;
  font-weight: 500;
}

.feature-tag i {
  font-size: 10px;
  color: #22c55e;
}

.option-checkbox {
  padding: 12px 20px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

.checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.checkbox.checked {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
  font-size: 12px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

:deep(.continue-btn) {
  width: 100% !important;
  padding: 12px !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  border-radius: 8px !important;
  background: #2563eb !important;
  border: none !important;
  color: white !important;
  cursor: pointer !important;
  transition: all 0.2s !important;
}

:deep(.continue-btn:hover:not(:disabled)) {
  background: #1d4ed8 !important;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3) !important;
}

:deep(.continue-btn:disabled) {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
}

.info-text {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #f0f9ff;
  border: 1px solid #bfdbfe;
  color: #0369a1;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
}

.info-text i {
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-text p {
  margin: 0;
  line-height: 1.5;
}

/* Footer */
.footer {
  background: white;
  border-top: 1px solid #e9ecef;
  padding: 20px 0;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: center;
  font-size: 12px;
  color: #64748b;
}

.footer-container p {
  margin: 0;
}

@media (max-width: 768px) {
  .workspace-card {
    padding: 36px 24px;
  }

  .card-header h1 {
    font-size: 24px;
  }

  .workspace-grid {
    grid-template-columns: 1fr;
  }
}
</style>

