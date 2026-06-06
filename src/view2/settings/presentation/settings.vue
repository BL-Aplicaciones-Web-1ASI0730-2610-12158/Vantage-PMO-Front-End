<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSettingsStore } from '../../application/settings.store.js';

const { t, locale } = useI18n();
const store = useSettingsStore();

const form    = ref(null);
const saved   = ref(false);
const section = ref('organization');
const dirty   = ref(false);

/* ── Enterprise flags ─────────────────────────────────────────────── */
const ORG_LOCKED = true; // VIEW2: enforced by organization policy

/* ── Apply theme globally ─────────────────────────────────────────── */
function applyTheme(theme) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
  document.documentElement.classList.toggle('app-dark', isDark);
}

/* ── Apply accent color globally ──────────────────────────────────── */
function applyAccent(color) {
  document.documentElement.style.setProperty('--accent', color);
}

/* ── Nav (ENTERPRISE) ─────────────────────────────────────────────── */
const NAV = [
  { key: 'organization', icon: 'pi-building', labelKey: 'settings.nav.organization' },
  { key: 'appearance',   icon: 'pi-palette', labelKey: 'settings.nav.appearance' },
  { key: 'regional',     icon: 'pi-globe',   labelKey: 'settings.nav.regional' },
  { key: 'notifications',icon: 'pi-bell',    labelKey: 'settings.nav.notifications' },
  { key: 'security',     icon: 'pi-shield',  labelKey: 'settings.nav.security' },
  { key: 'integrations', icon: 'pi-link',    labelKey: 'settings.nav.integrations' },
];

/* ── Watchers ─────────────────────────────────────────────────────── */
onMounted(async () => {
  await store.fetchSettings();
  if (store.settings) {
    form.value = { ...store.settings };
    applyTheme(form.value.theme);
    applyAccent(form.value.accentColor);
  }
});

watch(() => form.value?.theme, v => { if (v) applyTheme(v); dirty.value = true; });
watch(() => form.value?.accentColor, v => { if (v) applyAccent(v); dirty.value = true; });
watch(form, () => { dirty.value = true; }, { deep: true });

async function save() {
  await store.saveSettings(form.value);
  saved.value = true;
  dirty.value = false;
  setTimeout(() => (saved.value = false), 2500);
}
</script>

<template>
  <div class="st-page">

    <!-- Header -->
    <div class="st-header">
      <div>
        <h1 class="st-title">{{ t('settings.enterpriseTitle') }}</h1>
        <p class="st-subtitle">{{ t('settings.enterpriseSubtitle') }}</p>
      </div>
      <div class="st-header-actions">
        <span v-if="dirty && !saved" class="st-unsaved">
          <i class="pi pi-circle-fill" style="font-size:.5rem" /> Unsaved changes
        </span>
        <transition name="fade">
          <span v-if="saved" class="st-saved">
            <i class="pi pi-check-circle" /> {{ t('settings.saved') }}
          </span>
        </transition>
        <pv-button
            :label="t('settings.save')"
            icon="pi pi-check"
            :loading="store.saving"
            class="st-save-btn"
            @click="save"
        />
      </div>
    </div>

    <div v-if="store.loading" class="st-loading">
      <i class="pi pi-spin pi-spinner" style="font-size:2rem;color:#3b82f6" />
      <span>Loading organization settings…</span>
    </div>

    <div v-else-if="form" class="st-body">

      <!-- Sidebar -->
      <nav class="st-nav">
        <button
            v-for="item in NAV"
            :key="item.key"
            :class="['st-nav-item', { 'st-nav-item--active': section === item.key }]"
            @click="section = item.key"
        >
          <i :class="['pi', item.icon]" />
          <span>{{ t(item.labelKey) }}</span>
        </button>
      </nav>

      <!-- Content -->
      <div class="st-content">

        <!-- ══ ORGANIZATION ═══════════════════════════════════════ -->
        <section v-if="section === 'organization'">
          <div class="st-section-head">
            <div class="st-section-icon"><i class="pi pi-building"/></div>
            <div>
              <h2 class="st-section-title">Organization</h2>
              <p class="st-section-sub">Company-wide configuration and portfolio governance</p>
            </div>
          </div>

          <div class="st-block">
            <label class="st-label">Organization Name</label>
            <pv-input-text v-model="form.organizationName" class="w-full" />
          </div>

          <div class="st-block">
            <label class="st-label">Default Portfolio Visibility</label>
            <pv-select v-model="form.defaultPortfolioVisibility"
                       :options="['Private','PMO','Organization']"
                       class="w-full" />
          </div>

          <div class="st-info-box">
            <i class="pi pi-lock" />
            <div>
              <span class="st-info-title">Enterprise policy enforced</span>
              <span class="st-info-desc">
                Some settings are locked by your organization administrator.
              </span>
            </div>
          </div>
        </section>

        <!-- ══ APPEARANCE ════════════════════════════════════════ -->
        <section v-else-if="section === 'appearance'">
          <div class="st-section-head">
            <div class="st-section-icon"><i class="pi pi-palette"/></div>
            <div>
              <h2 class="st-section-title">Branding & Appearance</h2>
              <p class="st-section-sub">Applied across all portfolios</p>
            </div>
          </div>

          <div class="st-block">
            <label class="st-label">Theme</label>
            <pv-select v-model="form.theme"
                       :options="['light','dark','system']"
                       class="w-full"
                       :disabled="ORG_LOCKED" />
          </div>

          <div class="st-block">
            <label class="st-label">Primary Accent Color</label>
            <input type="color" v-model="form.accentColor" />
          </div>
        </section>

        <!-- ══ REGIONAL ═════════════════════════════════════════ -->
        <section v-else-if="section === 'regional'">
          <div class="st-section-head">
            <div class="st-section-icon"><i class="pi pi-globe"/></div>
            <div>
              <h2 class="st-section-title">Regional Defaults</h2>
              <p class="st-section-sub">Applied to new portfolios</p>
            </div>
          </div>

          <pv-select v-model="form.timezone" :options="['UTC','America/Lima','America/New_York']" />
        </section>

        <!-- ══ NOTIFICATIONS ═════════════════════════════════════ -->
        <section v-else-if="section === 'notifications'">
          <div class="st-section-head">
            <div class="st-section-icon"><i class="pi pi-bell"/></div>
            <div>
              <h2 class="st-section-title">Org Notifications</h2>
              <p class="st-section-sub">Default communication rules</p>
            </div>
          </div>

          <div class="st-toggle-item">
            <span>Email digests for portfolio risks</span>
            <button class="st-toggle st-toggle--on"><span class="st-toggle-knob"/></button>
          </div>
        </section>

        <!-- ══ SECURITY ═════════════════════════════════════════ -->
        <section v-else-if="section === 'security'">
          <div class="st-section-head">
            <div class="st-section-icon"><i class="pi pi-shield"/></div>
            <div>
              <h2 class="st-section-title">Security & Compliance</h2>
              <p class="st-section-sub">Enterprise access rules</p>
            </div>
          </div>

          <div class="st-info-box">
            <i class="pi pi-shield" />
            <div>
              <span class="st-info-title">SSO Enabled</span>
              <span class="st-info-desc">Authentication managed by organization identity provider</span>
            </div>
          </div>
        </section>

        <!-- ══ INTEGRATIONS ═════════════════════════════════════ -->
        <section v-else-if="section === 'integrations'">
          <div class="st-section-head">
            <div class="st-section-icon"><i class="pi pi-link"/></div>
            <div>
              <h2 class="st-section-title">Enterprise Integrations</h2>
              <p class="st-section-sub">Shared across all portfolios</p>
            </div>
          </div>

          <p>Slack, Jira, Power BI, Azure DevOps</p>
        </section>

      </div>
    </div>
  </div>
</template>

<style scoped>

</style>