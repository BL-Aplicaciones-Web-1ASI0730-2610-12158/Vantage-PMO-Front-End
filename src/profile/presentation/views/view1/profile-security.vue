<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useIamStore from '../../../../iam/application/iam.store.js';

const router   = useRouter();
const { t }    = useI18n();
const iamStore = useIamStore();

const showPwDialog = ref(false);
const pwForm       = ref({ current: '', newPw: '', confirm: '' });
const pwError      = ref('');
const pwSaved      = ref(false);

const twoFactorEnabled = ref(false);
const sessionAlerts    = ref(true);

function openPwDialog() {
  pwForm.value = { current: '', newPw: '', confirm: '' };
  pwError.value = '';
  showPwDialog.value = true;
}

function submitPassword() {
  if (!pwForm.value.current.trim()) {
    pwError.value = t('profile.security.currentRequired');
    return;
  }
  if (pwForm.value.newPw.length < 8) {
    pwError.value = t('profile.security.passwordMin');
    return;
  }
  if (pwForm.value.newPw !== pwForm.value.confirm) {
    pwError.value = t('profile.security.mismatch');
    return;
  }
  showPwDialog.value = false;
  pwSaved.value = true;
  setTimeout(() => { pwSaved.value = false; }, 2500);
}

function signOutAll() {
  iamStore.signOut();
  router.push({ name: 'sign-in' });
}
</script>

<template>
  <div class="security-page">
    <div class="card">
      <h2 class="page-title">{{ $t('profile.security.title') }}</h2>
      <p class="page-desc">{{ $t('profile.security.subtitle') }}</p>

      <section class="sec-section">
        <h3 class="section-label">{{ $t('profile.security.password') }}</h3>
        <div class="sec-row">
          <div>
            <span class="sec-title">{{ $t('profile.security.changePassword') }}</span>
            <span class="sec-desc">{{ $t('profile.security.changePasswordDesc') }}</span>
          </div>
          <button class="btn-action" @click="openPwDialog">{{ $t('profile.security.update') }}</button>
        </div>
        <p v-if="pwSaved" class="success-msg"><i class="pi pi-check"></i> {{ $t('profile.security.passwordUpdated') }}</p>
      </section>

      <section class="sec-section">
        <h3 class="section-label">{{ $t('profile.security.authentication') }}</h3>
        <div class="sec-row">
          <div>
            <span class="sec-title">{{ $t('profile.security.twoFactor') }}</span>
            <span class="sec-desc">{{ $t('profile.security.twoFactorDesc') }}</span>
          </div>
          <pv-checkbox v-model="twoFactorEnabled" binary />
        </div>
        <div class="sec-row">
          <div>
            <span class="sec-title">{{ $t('profile.security.sessionAlerts') }}</span>
            <span class="sec-desc">{{ $t('profile.security.sessionAlertsDesc') }}</span>
          </div>
          <pv-checkbox v-model="sessionAlerts" binary />
        </div>
      </section>

      <section class="sec-section danger">
        <h3 class="section-label">{{ $t('profile.security.sessions') }}</h3>
        <div class="sec-row">
          <div>
            <span class="sec-title">{{ $t('profile.security.signOutAll') }}</span>
            <span class="sec-desc">{{ $t('profile.security.signOutAllDesc') }}</span>
          </div>
          <button class="btn-danger" @click="signOutAll">{{ $t('profile.security.signOut') }}</button>
        </div>
      </section>
    </div>

    <pv-dialog
      v-model:visible="showPwDialog"
      :header="$t('profile.security.changePassword')"
      modal
      :style="{ width: '440px' }"
    >
      <div class="pw-form">
        <div class="field">
          <label>{{ $t('profile.security.currentPassword') }}</label>
          <pv-input-text v-model="pwForm.current" type="password" class="w-full" />
        </div>
        <div class="field">
          <label>{{ $t('profile.security.newPassword') }}</label>
          <pv-input-text v-model="pwForm.newPw" type="password" class="w-full" />
        </div>
        <div class="field">
          <label>{{ $t('profile.security.confirmPassword') }}</label>
          <pv-input-text v-model="pwForm.confirm" type="password" class="w-full" />
        </div>
        <p v-if="pwError" class="pw-error">{{ pwError }}</p>
      </div>
      <template #footer>
        <pv-button :label="$t('profile.form.cancel')" severity="secondary" text @click="showPwDialog = false" />
        <pv-button :label="$t('profile.security.update')" @click="submitPassword" />
      </template>
    </pv-dialog>
  </div>
</template>

<style scoped>
.security-page { max-width: 720px; }

.card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  padding: 28px;
}

.page-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 6px;
}

.page-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 28px;
}

.sec-section {
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid #f1f5f9;
}

.section-label {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin: 0 0 16px;
}

.sec-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  gap: 16px;
}

.sec-title {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.sec-desc {
  display: block;
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.btn-action {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  white-space: nowrap;
}
.btn-action:hover { background: #f8fafc; }

.btn-danger {
  padding: 8px 16px;
  border: 1px solid #fecaca;
  border-radius: 8px;
  background: #fef2f2;
  font-size: 13px;
  font-weight: 600;
  color: #dc2626;
  cursor: pointer;
  white-space: nowrap;
}
.btn-danger:hover { background: #fee2e2; }

.success-msg {
  font-size: 13px;
  color: #16a34a;
  font-weight: 600;
  margin: 8px 0 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.pw-form { display: flex; flex-direction: column; gap: 14px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 12px; font-weight: 600; color: #475569; }
.w-full { width: 100%; }
.pw-error { font-size: 12px; color: #dc2626; margin: 0; }
</style>
