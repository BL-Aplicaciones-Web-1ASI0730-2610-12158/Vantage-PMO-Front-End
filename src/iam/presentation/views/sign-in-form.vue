<script setup>
import useIamStore from "../../application/iam.store.js";
import {reactive, ref} from "vue";
import {SignInCommand} from "../../domain/sign-in.command.js";
import {useRouter} from "vue-router";

const router = useRouter();
const store = useIamStore();
const showPassword = ref(false);
const errorMsg = ref('');
const loading = ref(false);

const form = reactive({ username: '', password: '' });

async function performSignIn() {
  errorMsg.value = '';
  loading.value = true;
  const ok = await store.signIn(new SignInCommand(form), router);
  loading.value = false;
  if (!ok) {
    errorMsg.value = 'Incorrect username / email or password. Please try again.';
  }
}

function goToSignUp() {
  router.push({name: 'iam-sign-up'});
}

function goToForgotPassword() {
  router.push({ name: 'iam-forgot-password' });
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
      <div class="auth-card">
        <div class="card-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account to continue</p>
        </div>

        <form @submit.prevent="performSignIn" class="auth-form">
          <!-- Username Field -->
          <div class="form-group">
            <label for="username">Username or Email</label>
            <div class="input-wrapper">
              <i class="pi pi-user input-icon"></i>
              <pv-input-text
                id="username"
                v-model="form.username"
                placeholder="Enter your username"
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
                placeholder="Enter your password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
              />
              <button type="button" class="eye-btn" @click="showPassword = !showPassword" tabindex="-1">
                <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>
            </div>
          </div>

          <!-- Remember and Forgot -->
          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a class="forgot-link" @click.prevent="goToForgotPassword" href="#">Forgot password?</a>
          </div>

          <!-- Error message -->
          <div v-if="errorMsg" class="error-msg">
            <i class="pi pi-exclamation-triangle"></i>
            {{ errorMsg }}
          </div>

          <!-- Sign In Button -->
          <pv-button
            type="submit"
            class="sign-in-btn"
            :label="loading ? 'Signing in...' : 'Sign In'"
            :disabled="loading"
          />
        </form>

        <!-- Divider -->
        <div class="divider">
          <span>or</span>
        </div>

        <!-- Sign Up Link -->
        <div class="signup-prompt">
          <span>Don't have an account?</span>
          <button class="signup-link" @click="goToSignUp">Create one now</button>
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
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(255, 255, 255, 0.5) 100%),
              linear-gradient(225deg, rgba(59, 130, 246, 0.03) 0%, rgba(147, 112, 219, 0.03) 100%);
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
  max-width: 420px;
  background: white;
  border-radius: 12px;
  padding: 40px 36px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.card-header {
  text-align: center;
  margin-bottom: 32px;
}

.card-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px;
}

.card-header p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  left: 12px;
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
  padding: 11px 14px 11px 40px !important;
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
}

.checkbox-label input {
  cursor: pointer;
  width: 16px;
  height: 16px;
}

.forgot-link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

:deep(.sign-in-btn) {
  width: 100% !important;
  padding: 11px !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  border-radius: 8px !important;
  background: #2563eb !important;
  border: none !important;
  color: white !important;
  cursor: pointer !important;
  transition: all 0.2s !important;
  margin-top: 8px !important;
}

:deep(.sign-in-btn:hover) {
  background: #1d4ed8 !important;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3) !important;
}

.divider {
  display: flex;
  align-items: center;
  margin: 24px 0;
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

.signup-prompt {
  text-align: center;
  font-size: 13px;
  color: #64748b;
}

.signup-link {
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

.signup-link:hover {
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
    padding: 32px 24px;
  }

  .footer-container {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}
</style>

