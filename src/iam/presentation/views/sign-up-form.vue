<script setup>
import useIamStore from "../../application/iam.store.js";
import { reactive, ref } from "vue";
import { RegisterAccountCommand } from "../../domain/register-account.command.js";
import WorkspaceSelector from "../../../workspace/presentation/components/workspace-selector.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useIamStore();
const { registerAccount } = store;

const currentStep = ref(1);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const errorMsg = ref('');
const loading = ref(false);
const selectedWorkspace = ref(null);

const form = reactive({
  name: '',
  username: '',
  role: '',
  birthDate: '',
  email: '',
  password: '',
  confirmPassword: '',
});

function goToNextStep() {
  errorMsg.value = '';
  if (form.password !== form.confirmPassword) {
    errorMsg.value = 'Passwords do not match. Please check and try again.';
    return;
  }
  currentStep.value = 2;
}

function goToPreviousStep() {
  errorMsg.value = '';
  currentStep.value = 1;
}

async function performRegisterAccount() {
  errorMsg.value = '';

  if (!selectedWorkspace.value) {
    errorMsg.value = 'Please select a workspace to continue.';
    return;
  }

  loading.value = true;

  const registerCommand = new RegisterAccountCommand({
    name: form.name,
    email: form.email,
    password: form.password,
    username: form.username || form.email.split('@')[0],
    role: form.role,
    birthDate: form.birthDate,
    workspaceType: selectedWorkspace.value,
  });

  const ok = await registerAccount(registerCommand, router);
  loading.value = false;

  if (!ok) {
    const lastError = store.errors.at(-1);
    errorMsg.value = lastError?.message
      || 'Registration failed. Please check your details and try again.';
  }
}

function goToSignIn() {
  router.push({ name: 'iam-sign-in' });
}

function contactAdmin() {
  window.location.href = 'mailto:admin@vantagepmo.io';
}
</script>

<template>
  <div class="auth-page">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-brand">
          <div class="logo-icon">
            <i class="pi pi-compass"></i>
          </div>
          <span class="brand-text">Vantage PMO</span>
        </div>
        <div class="navbar-links">
          <a href="#features" class="nav-link">Features</a>
          <a href="#pricing" class="nav-link">Pricing</a>
          <a href="#about" class="nav-link">About</a>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="auth-main">
      <!-- Card Container -->
      <div class="auth-card" :class="{ 'auth-card-wide': currentStep === 2 }">
        <div class="card-header">
          <div class="step-indicator">
            <span class="step" :class="{ active: currentStep === 1, completed: currentStep > 1 }">1</span>
            <span class="step-line" :class="{ completed: currentStep > 1 }"></span>
            <span class="step" :class="{ active: currentStep === 2 }">2</span>
          </div>
          <h1>{{ currentStep === 1 ? 'Create Account' : 'Select Your Segment' }}</h1>
          <p>
            {{ currentStep === 1
              ? 'Join Vantage PMO to manage your projects efficiently'
              : 'Choose Segment 1 or Segment 2 to personalize your workspace' }}
          </p>
        </div>

        <form v-if="currentStep === 1" @submit.prevent="goToNextStep" class="auth-form">

          <!-- Two-column row: Name + Username -->
          <div class="form-row">
            <div class="form-group">
              <label for="name">Full Name</label>
              <div class="input-wrapper">
                <i class="pi pi-id-card input-icon"></i>
                <pv-input-text
                  id="name"
                  v-model="form.name"
                  placeholder="Your full name"
                  class="form-input"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="username">Username</label>
              <div class="input-wrapper">
                <i class="pi pi-at input-icon"></i>
                <pv-input-text
                  id="username"
                  v-model="form.username"
                  placeholder="Choose a username"
                  class="form-input"
                  required
                />
              </div>
            </div>
          </div>

          <!-- Two-column row: Role + Date of Birth -->
          <div class="form-row">
            <div class="form-group">
              <label for="role">Role / Position</label>
              <div class="input-wrapper">
                <i class="pi pi-briefcase input-icon"></i>
                <pv-input-text
                  id="role"
                  v-model="form.role"
                  placeholder="e.g. Project Manager"
                  class="form-input"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="birthDate">Date of Birth</label>
              <div class="input-wrapper">
                <i class="pi pi-calendar input-icon"></i>
                <input
                  id="birthDate"
                  v-model="form.birthDate"
                  type="date"
                  class="form-input date-input"
                  required
                />
              </div>
            </div>
          </div>

          <!-- Email Field -->
          <div class="form-group">
            <label for="email">Email Address</label>
            <div class="input-wrapper">
              <i class="pi pi-envelope input-icon"></i>
              <pv-input-text
                id="email"
                v-model="form.email"
                placeholder="Enter your email"
                type="email"
                class="form-input"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-wrapper">
              <i class="pi pi-lock input-icon"></i>
              <pv-input-text
                id="password"
                v-model="form.password"
                placeholder="Create a strong password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
              />
              <button type="button" class="eye-btn" @click="showPassword = !showPassword" tabindex="-1">
                <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div class="form-group">
            <label for="confirm-password">Confirm Password</label>
            <div class="input-wrapper">
              <i class="pi pi-lock input-icon"></i>
              <pv-input-text
                id="confirm-password"
                v-model="form.confirmPassword"
                placeholder="Confirm your password"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-input"
              />
              <button type="button" class="eye-btn" @click="showConfirmPassword = !showConfirmPassword" tabindex="-1">
                <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>
            </div>
          </div>

          <!-- Error message -->
          <div v-if="errorMsg" class="error-msg">
            <i class="pi pi-exclamation-triangle"></i>
            {{ errorMsg }}
          </div>

          <!-- Terms Checkbox -->
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" required />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </label>
          </div>

          <!-- Continue Button -->
          <pv-button
            type="submit"
            class="signup-btn"
            label="Continue"
            icon="pi pi-arrow-right"
            iconPos="right"
          />
        </form>

        <div v-else class="workspace-step">
          <workspace-selector v-model="selectedWorkspace" />

          <div v-if="selectedWorkspace" class="selection-hint">
            <i class="pi pi-check-circle"></i>
            <span>Segment selected. Click Create Account to finish.</span>
          </div>

          <div v-if="errorMsg" class="error-msg">
            <i class="pi pi-exclamation-triangle"></i>
            {{ errorMsg }}
          </div>

          <div class="workspace-actions">
            <pv-button
              label="Back"
              class="back-btn"
              icon="pi pi-arrow-left"
              @click="goToPreviousStep"
            />
            <pv-button
              label="Create Account"
              class="signup-btn"
              :loading="loading"
              :disabled="loading"
              icon="pi pi-check"
              @click="performRegisterAccount"
            />
          </div>
        </div>

        <!-- Divider -->
        <div class="divider">
          <span>or</span>
        </div>

        <!-- Admin Contact & Sign In -->
        <div class="form-footer">
          <button class="contact-btn" @click="contactAdmin">
            <i class="pi pi-phone"></i>
            <span>Contact Administrator</span>
          </button>
        </div>

        <!-- Sign In Link -->
        <div class="signin-prompt">
          <span>Already have an account?</span>
          <button class="signin-link" @click="goToSignIn">Sign in here</button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-container">
        <p>&copy; 2026 Vantage PMO. All rights reserved.</p>
        <div class="footer-links">
          <a href="#privacy">Privacy Policy</a>
          <span class="separator">•</span>
          <a href="#terms">Terms of Service</a>
          <span class="separator">•</span>
          <a href="#support">Support</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.auth-page {
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

.navbar-links {
  display: flex;
  gap: 32px;
}

.nav-link {
  color: #64748b;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #2563eb;
}

/* Main Content */
.auth-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
}

.auth-card {
  width: 100%;
  max-width: 440px;
  background: white;
  border-radius: 16px;
  padding: 48px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.8);
  transition: max-width 0.3s ease;
}

.auth-card-wide {
  max-width: 800px;
}

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: 20px;
}

.step {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  background: #e2e8f0;
  color: #94a3b8;
  transition: all 0.2s;
}

.step.active {
  background: #2563eb;
  color: white;
}

.step.completed {
  background: #22c55e;
  color: white;
}

.step-line {
  width: 48px;
  height: 2px;
  background: #e2e8f0;
  transition: background 0.2s;
}

.step-line.completed {
  background: #22c55e;
}

.workspace-step {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.selection-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #16a34a;
  font-size: 13px;
  font-weight: 600;
}

.workspace-actions {
  display: flex;
  gap: 12px;
}

:deep(.back-btn) {
  flex: 0 0 auto !important;
  padding: 12px 20px !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  border-radius: 8px !important;
  background: #f3f4f6 !important;
  border: 1px solid #e5e7eb !important;
  color: #64748b !important;
}

:deep(.back-btn:hover) {
  background: #e5e7eb !important;
  color: #374151 !important;
}

.workspace-actions :deep(.signup-btn) {
  flex: 1 !important;
  margin-top: 0 !important;
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

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 480px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  color: #94a3b8;
  font-size: 16px;
  pointer-events: none;
}

.eye-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  font-size: 16px;
  padding: 0;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}
.eye-btn:hover { color: #2563eb; }

.date-input {
  padding-left: 44px !important;
  color: #1e293b;
  cursor: pointer;
}
.date-input::-webkit-calendar-picker-indicator {
  opacity: 0.5;
  cursor: pointer;
}

.error-msg {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 12px 14px 12px 44px !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 8px !important;
  font-size: 14px !important;
  background: #f8fafc !important;
  font-family: 'Inter', sans-serif !important;
  transition: all 0.2s !important;
}

.form-input:focus {
  background: white !important;
  border-color: #2563eb !important;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1) !important;
  outline: none !important;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #64748b;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  font-size: 13px;
  line-height: 1.6;
}

.checkbox-label input {
  cursor: pointer;
  width: 16px;
  height: 16px;
  margin-top: 2px;
  flex-shrink: 0;
}

:deep(.signup-btn) {
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
  margin-top: 4px !important;
}

:deep(.signup-btn:hover) {
  background: #1d4ed8 !important;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3) !important;
}

.divider {
  display: flex;
  align-items: center;
  margin: 28px 0;
  font-size: 13px;
  color: #94a3b8;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.divider span {
  padding: 0 12px;
  font-weight: 500;
}

.form-footer {
  display: flex;
  justify-content: center;
}

.contact-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #64748b;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 13px;
  transition: all 0.2s;
  width: 100%;
  justify-content: center;
}

.contact-btn:hover {
  background: #e5e7eb;
  color: #374151;
  border-color: #d1d5db;
}

.signin-prompt {
  text-align: center;
  font-size: 13px;
  color: #64748b;
  margin-top: 20px;
}

.signin-link {
  background: none;
  border: none;
  color: #2563eb;
  cursor: pointer;
  font-weight: 600;
  transition: color 0.2s;
  padding: 0;
  font-size: 13px;
  text-decoration: none;
}

.signin-link:hover {
  color: #1d4ed8;
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
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #64748b;
}

.footer-container p {
  margin: 0;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-links a {
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #2563eb;
}

.separator {
  color: #cbd5e1;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-links {
    display: none;
  }

  .auth-card {
    padding: 36px 24px;
  }

  .footer-container {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}
</style>