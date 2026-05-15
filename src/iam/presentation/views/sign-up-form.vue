<script setup>
import useIamStore from "../../application/iam.store.js";
import {reactive} from "vue";
import {SignUpCommand} from "../../domain/sign-up.command.js";
import {useRouter} from "vue-router";

const router = useRouter();
const store = useIamStore();
const {signUp} = store;
const form = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

function performSignUp() {
  if (form.password !== form.confirmPassword) {
    alert('Passwords do not match');
    return;
  }
  let signUpCommand = new SignUpCommand({
    email: form.email,
    password: form.password,
    username: form.email.split('@')[0]
  });
  console.log(signUpCommand);
  signUp(signUpCommand, router);
}

function goToSignIn() {
  router.push({name: 'iam-sign-in'});
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
      <div class="auth-card">
        <div class="card-header">
          <h1>Create Account</h1>
          <p>Join Vantage PMO to manage your projects efficiently</p>
        </div>

        <form @submit.prevent="performSignUp" class="auth-form">
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
                type="password"
                class="form-input"
              />
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
                type="password"
                class="form-input"
              />
            </div>
          </div>

          <!-- Terms Checkbox -->
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" required />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </label>
          </div>

          <!-- Sign Up Button -->
          <pv-button
            type="submit"
            class="signup-btn"
            label="Create Account"
          />
        </form>

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
  gap: 24px;
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