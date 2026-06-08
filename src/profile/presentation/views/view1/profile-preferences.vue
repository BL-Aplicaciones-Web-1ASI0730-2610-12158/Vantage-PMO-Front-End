<script setup>
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

const prefs = ref({
  emailNotifications: true,
  pushNotifications:  false,
  weeklyDigest:       true,
  projectUpdates:     true,
  language:           locale.value,
  timezone:           'America/New_York',
  dateFormat:         'MM/DD/YYYY',
});

onMounted(() => {
  const saved = localStorage.getItem('profilePreferences');
  if (saved) {
    try { prefs.value = { ...prefs.value, ...JSON.parse(saved) }; } catch { /* ignore */ }
  }
});

watch(prefs, (val) => {
  localStorage.setItem('profilePreferences', JSON.stringify(val));
}, { deep: true });

watch(() => prefs.value.language, (lang) => {
  locale.value = lang;
  localStorage.setItem('locale', lang);
});

const saved = ref(false);
function savePreferences() {
  localStorage.setItem('profilePreferences', JSON.stringify(prefs.value));
  saved.value = true;
  setTimeout(() => { saved.value = false; }, 2000);
}
</script>

<template>
  <div class="prefs-page">
    <div class="card">
      <h2 class="page-title">{{ $t('profile.prefs.title') }}</h2>
      <p class="page-desc">{{ $t('profile.prefs.subtitle') }}</p>

      <section class="prefs-section">
        <h3 class="section-label">{{ $t('profile.prefs.notifications') }}</h3>
        <div class="toggle-row">
          <div>
            <span class="toggle-title">{{ $t('profile.prefs.emailNotif') }}</span>
            <span class="toggle-desc">{{ $t('profile.prefs.emailNotifDesc') }}</span>
          </div>
          <pv-checkbox v-model="prefs.emailNotifications" binary />
        </div>
        <div class="toggle-row">
          <div>
            <span class="toggle-title">{{ $t('profile.prefs.pushNotif') }}</span>
            <span class="toggle-desc">{{ $t('profile.prefs.pushNotifDesc') }}</span>
          </div>
          <pv-checkbox v-model="prefs.pushNotifications" binary />
        </div>
        <div class="toggle-row">
          <div>
            <span class="toggle-title">{{ $t('profile.prefs.weeklyDigest') }}</span>
            <span class="toggle-desc">{{ $t('profile.prefs.weeklyDigestDesc') }}</span>
          </div>
          <pv-checkbox v-model="prefs.weeklyDigest" binary />
        </div>
        <div class="toggle-row">
          <div>
            <span class="toggle-title">{{ $t('profile.prefs.projectUpdates') }}</span>
            <span class="toggle-desc">{{ $t('profile.prefs.projectUpdatesDesc') }}</span>
          </div>
          <pv-checkbox v-model="prefs.projectUpdates" binary />
        </div>
      </section>

      <section class="prefs-section">
        <h3 class="section-label">{{ $t('profile.prefs.regional') }}</h3>
        <div class="field-row">
          <label>{{ $t('profile.prefs.language') }}</label>
          <pv-select
            v-model="prefs.language"
            :options="[
              { label: 'English', value: 'en' },
              { label: 'Español', value: 'es' },
            ]"
            option-label="label"
            option-value="value"
            class="field-input"
          />
        </div>
        <div class="field-row">
          <label>{{ $t('profile.prefs.timezone') }}</label>
          <pv-select
            v-model="prefs.timezone"
            :options="[
              { label: 'Eastern (US)', value: 'America/New_York' },
              { label: 'Central (US)', value: 'America/Chicago' },
              { label: 'London (UK)', value: 'Europe/London' },
            ]"
            option-label="label"
            option-value="value"
            class="field-input"
          />
        </div>
        <div class="field-row">
          <label>{{ $t('profile.prefs.dateFormat') }}</label>
          <pv-select
            v-model="prefs.dateFormat"
            :options="[
              { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
              { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
              { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
            ]"
            option-label="label"
            option-value="value"
            class="field-input"
          />
        </div>
      </section>

      <div class="save-row">
        <span v-if="saved" class="saved-msg"><i class="pi pi-check"></i> {{ $t('profile.prefs.saved') }}</span>
        <pv-button :label="$t('profile.prefs.save')" @click="savePreferences" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.prefs-page { max-width: 720px; }

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

.prefs-section {
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid #f1f5f9;
}

.prefs-section:last-of-type { border-bottom: none; }

.section-label {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin: 0 0 16px;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f8fafc;
}

.toggle-title {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.toggle-desc {
  display: block;
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.field-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.field-row label {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.field-input { width: 100%; max-width: 320px; }

.save-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.saved-msg {
  font-size: 13px;
  color: #16a34a;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
