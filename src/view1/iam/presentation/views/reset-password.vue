<script setup>
import useIamStore from "../../application/iam.store.js";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useIamStore();

const form = reactive({ password: '', confirmPassword: '' });
const loading = ref(false);
const done = ref(false);
const errorMsg = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

async function performReset() {
  errorMsg.value = '';
  if (form.password !== form.confirmPassword) {
    errorMsg.value = 'Passwords do not match.';
    return;
  }
  if (form.password.length < 6) {
    errorMsg.value = 'Password must be at least 6 characters.';
    return;
  }
  if (!store.recoveryUserId) {
    errorMsg.value = 'Recovery session expired. Please start again.';
    return;
  }
  loading.value = true;
  const ok = await store.resetPassword(form.password);
  loading.value = false;
  if (ok) {
    done.value = true;
  } else {
    errorMsg.value = 'Something went wrong. Please try again.';
  }
}

function goToSignIn() {
  router.push({ name: 'iam-sign-in' });
}

function goToForgot() {
  router.push({ name: 'iam-forgot-password' });
}
</script>

<template>
  <div class="auth-page">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-brand">
          <div class="logo-icon"><i class="pi pi-compass"></i></div>
          <span class="brand-text">Vantage PMO</span>
        </div>
      </div>
    </nav>

    <!-- Main -->
    <div class="auth-main">
      <div class="auth-card">

        <!-- Step 1: Reset form -->
        <template v-if="!done">
          <div class="card-header">
            <div class="icon-wrap"><i class="pi pi-key"></i></div>
            <h1>Set New Password</h1>
            <p>Choose a strong password for your account.</p>
          </div>

          <form @submit.prevent="performReset" class="auth-form">
            <div class="form-group">
              <label for="password">New Password</label>
              <div class="input-wrapper">
                <i class="pi pi-lock input-icon"></i>
                <pv-input-text
                  id="password"
                  v-model="form.password"
                  placeholder="Enter new password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  required
                />
                <button type="button" class="eye-btn" @click="showPassword = !showPassword" tabindex="-1">
                  <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="confirm-password">Confirm Password</label>
              <div class="input-wrapper">
                <i class="pi pi-lock input-icon"></i>
                <pv-input-text
                  id="confirm-password"
                  v-model="form.confirmPassword"
                  placeholder="Confirm new password"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="form-input"
                  required
                />
                <button type="button" class="eye-btn" @click="showConfirmPassword = !showConfirmPassword" tabindex="-1">
                  <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                </button>
              </div>
            </div>

            <!-- Password strength hint -->
            <div class="strength-hint" v-if="form.password">
              <div class="strength-bar">
                <div
                  class="strength-fill"
                  :class="{
                    weak: form.password.length < 6,
                    medium: form.password.length >= 6 && form.password.length < 10,
                    strong: form.password.length >= 10
                  }"
                ></div>
              </div>
              <span class="strength-label" :class="{
                weak: form.password.length < 6,
                medium: form.password.length >= 6 && form.password.length < 10,
                strong: form.password.length >= 10
              }">
                {{ form.password.length < 6 ? 'Weak' : form.password.length < 10 ? 'Medium' : 'Strong' }}
              </span>
            </div>

            <div v-if="errorMsg" class="error-msg">
              <i class="pi pi-exclamation-triangle"></i>
              {{ errorMsg }}
            </div>

            <pv-button
              type="submit"
              class="reset-btn"
              :label="loading ? 'Updating...' : 'Update Password'"
              :disabled="loading"
            />
          </form>

          <div class="back-link">
            <button class="text-btn" @click="goToForgot">
              <i class="pi pi-arrow-left"></i> Back
            </button>
          </div>
        </template>

        <!-- Step 2: Success -->
        <template v-else>
          <div class="card-header">
            <div class="icon-wrap success"><i class="pi pi-check-circle"></i></div>
            <h1>Password Updated!</h1>
            <p>Your password has been successfully changed. You can now sign in with your new credentials.</p>
          </div>
          <pv-button
            class="reset-btn"
            label="Go to Sign In"
            @click="goToSignIn"
          />
        </template>

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
* { box-sizing: border-box; }

.auth-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: radial-gradient(circle at 20% 50%, rgba(37, 99, 235, 0.08) 0%, transparent 50%),
              linear-gradient(135deg, #ffffff 0%, #f5f7fb 100%);
  font-family: 'Inter', sans-serif;
}

.navbar {
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: 12px 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
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
  box-shadow: 0 20px 60px rgba(0,0,0,0.12);
  border: 1px solid rgba(255,255,255,0.8);
}

.card-header {
  text-align: center;
  margin-bottom: 32px;
}
.icon-wrap {
  width: 56px;
  height: 56px;
  background: #eff6ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 24px;
  color: #2563eb;
}
.icon-wrap.success {
  background: #f0fdf4;
  color: #16a34a;
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
  line-height: 1.6;
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

.strength-hint {
  display: flex;
  align-items: center;
  gap: 10px;
}
.strength-bar {
  flex: 1;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}
.strength-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s, background 0.3s;
}
.strength-fill.weak   { width: 33%; background: #ef4444; }
.strength-fill.medium { width: 66%; background: #f59e0b; }
.strength-fill.strong { width: 100%; background: #22c55e; }
.strength-label {
  font-size: 12px;
  font-weight: 600;
  min-width: 44px;
}
.strength-label.weak   { color: #ef4444; }
.strength-label.medium { color: #f59e0b; }
.strength-label.strong { color: #22c55e; }

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

:deep(.reset-btn) {
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
:deep(.reset-btn:hover) {
  background: #1d4ed8 !important;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3) !important;
}
:deep(.reset-btn:disabled) {
  opacity: 0.6 !important;
  cursor: not-allowed !important;
}

.back-link {
  text-align: center;
  margin-top: 24px;
}
.text-btn {
  background: none;
  border: none;
  color: #2563eb;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s;
}
.text-btn:hover { color: #1d4ed8; }

.footer {
  background: white;
  border-top: 1px solid #e9ecef;
  padding: 20px 0;
  text-align: center;
  font-size: 12px;
  color: #64748b;
}
.footer-container p { margin: 0; }
</style>

