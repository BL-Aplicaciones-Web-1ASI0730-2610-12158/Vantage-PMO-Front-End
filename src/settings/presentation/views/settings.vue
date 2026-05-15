<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSettingsStore } from '../../application/settings.store.js';

const { t, locale } = useI18n();
const store = useSettingsStore();

const form    = ref(null);
const saved   = ref(false);
const section = ref('appearance');
const dirty   = ref(false);

/* ── Apply theme globally ───────────────────────────────────────────────── */
function applyTheme(theme) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
    document.documentElement.classList.toggle('app-dark', isDark);
}

/* ── Apply accent color globally ────────────────────────────────────────── */
function applyAccent(color) {
    document.documentElement.style.setProperty('--accent', color);
}

/* ── Change-password dialog ─────────────────────────────────────────────── */
const showPwDialog = ref(false);
const pwForm       = ref({ current: '', newPw: '', confirm: '' });
const pwError      = ref('');
const pwSaved      = ref(false);
function openPwDialog() { pwForm.value = { current:'', newPw:'', confirm:'' }; pwError.value = ''; showPwDialog.value = true; }
function submitPassword() {
    if (!pwForm.value.current.trim()) { pwError.value = 'Please enter your current password.'; return; }
    if (pwForm.value.newPw.length < 8) { pwError.value = 'Password must be at least 8 characters.'; return; }
    if (pwForm.value.newPw !== pwForm.value.confirm) { pwError.value = t('settings.passwordDialog.mismatch'); return; }
    showPwDialog.value = false; pwSaved.value = true;
    setTimeout(() => (pwSaved.value = false), 2500);
}

/* ── FAQ ────────────────────────────────────────────────────────────────── */
const openFaqIdx = ref(null);
const FAQ_ITEMS = computed(() => [
    { q: t('settings.faq.q1'), a: t('settings.faq.a1') },
    { q: t('settings.faq.q2'), a: t('settings.faq.a2') },
    { q: t('settings.faq.q3'), a: t('settings.faq.a3') },
]);

/* ── Nav ────────────────────────────────────────────────────────────────── */
const NAV = [
    { key: 'appearance',    icon: 'pi-palette',  labelKey: 'settings.nav.appearance'    },
    { key: 'regional',      icon: 'pi-globe',    labelKey: 'settings.nav.regional'      },
    { key: 'notifications', icon: 'pi-bell',     labelKey: 'settings.nav.notifications' },
    { key: 'security',      icon: 'pi-shield',   labelKey: 'settings.nav.security'      },
    { key: 'account',       icon: 'pi-user',     labelKey: 'settings.nav.account'       },
    { key: 'integrations',  icon: 'pi-link',     labelKey: 'settings.nav.integrations'  },
];

/* ── Options ────────────────────────────────────────────────────────────── */
const THEME_OPTIONS = [
    { label: 'Light',  value: 'light',  icon: 'pi-sun'     },
    { label: 'Dark',   value: 'dark',   icon: 'pi-moon'    },
    { label: 'System', value: 'system', icon: 'pi-desktop' },
];
const ACCENT_COLORS = [
    { value: '#3b82f6', name: 'Blue'   },
    { value: '#8b5cf6', name: 'Violet' },
    { value: '#10b981', name: 'Green'  },
    { value: '#f59e0b', name: 'Amber'  },
    { value: '#ef4444', name: 'Red'    },
    { value: '#ec4899', name: 'Pink'   },
    { value: '#06b6d4', name: 'Cyan'   },
    { value: '#6366f1', name: 'Indigo' },
];
const DENSITY_OPTIONS = [
    { value: 'compact',     label: computed(() => t('settings.densityCompact')),      icon: 'pi-minus', desc: 'More items visible at once' },
    { value: 'comfortable', label: computed(() => t('settings.densityComfortable')), icon: 'pi-equals', desc: 'Balanced spacing' },
    { value: 'spacious',    label: computed(() => t('settings.densitySpaciousLabel')),icon: 'pi-plus',  desc: 'Easier to read' },
];
const LANG_OPTIONS = [
    { label: 'English', value: 'en', flag: '🇺🇸', locale: 'en-US' },
    { label: 'Español', value: 'es', flag: '🇪🇸', locale: 'es-ES' },
];
const TIMEZONE_OPTIONS = [
    'UTC','America/New_York','America/Chicago','America/Los_Angeles',
    'America/Bogota','America/Lima','America/Santiago',
    'Europe/London','Europe/Madrid','Europe/Paris','Europe/Berlin',
    'Asia/Tokyo','Asia/Singapore','Asia/Dubai','Asia/Kolkata','Australia/Sydney',
];
const DATE_FORMAT_OPTIONS = ['MM/DD/YYYY','DD/MM/YYYY','YYYY-MM-DD','D MMM YYYY'];
const CURRENCY_OPTIONS    = ['USD','EUR','GBP','JPY','BRL','MXN','CAD','AUD','CHF'];
const FIRST_DAY_OPTIONS   = ['Sunday','Monday'];
const VISIBILITY_OPTIONS  = [
    { label: 'Team Only', value: 'team'    },
    { label: 'Public',    value: 'public'  },
    { label: 'Private',   value: 'private' },
];
const INTEGRATIONS = [
    { key:'slack',    name:'Slack',        icon:'pi-comments',  color:'#4a154b', desc:'Notifications in Slack channels.',       connected:true,  lastSync:'2 min ago'   },
    { key:'github',   name:'GitHub',       icon:'pi-github',    color:'#24292e', desc:'Auto-link commits to tasks.',             connected:false, lastSync:null          },
    { key:'jira',     name:'Jira',         icon:'pi-ticket',    color:'#0052cc', desc:'Sync issues and sprints.',                connected:false, lastSync:null          },
    { key:'gmail',    name:'Google Mail',  icon:'pi-envelope',  color:'#ea4335', desc:'Send report summaries via Gmail.',        connected:true,  lastSync:'1 hour ago'  },
    { key:'teams',    name:'MS Teams',     icon:'pi-microsoft', color:'#6264a7', desc:'Alerts inside Microsoft Teams.',          connected:false, lastSync:null          },
    { key:'notion',   name:'Notion',       icon:'pi-file',      color:'#191919', desc:'Sync project docs with Notion.',          connected:false, lastSync:null          },
    { key:'figma',    name:'Figma',        icon:'pi-desktop',   color:'#f24e1e', desc:'Attach Figma designs to tasks.',          connected:false, lastSync:null          },
    { key:'dropbox',  name:'Dropbox',      icon:'pi-cloud',     color:'#0061ff', desc:'Auto-backup reports to Dropbox.',         connected:false, lastSync:null          },
];

/* ── Live preview computed ──────────────────────────────────────────────── */
const previewDate = computed(() => {
    if (!form.value) return '';
    const lang = LANG_OPTIONS.find(l => l.value === form.value.language);
    const locale2 = lang?.locale ?? 'en-US';
    const now = new Date();
    const datePart = now.toLocaleDateString(locale2, { dateStyle: 'long' });
    const hour = form.value.timeFormat === '24h'
        ? now.toLocaleTimeString(locale2, { hour: '2-digit', minute: '2-digit', hour12: false })
        : now.toLocaleTimeString(locale2, { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${datePart} · ${hour}`;
});

/* ── Password strength ──────────────────────────────────────────────────── */
const pwStrength = computed(() => {
    const p = pwForm.value.newPw;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8)  score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
});
const pwStrengthLabel = computed(() => ['','Weak','Fair','Good','Strong','Very Strong'][pwStrength.value] ?? '');
const pwStrengthColor = computed(() => ['','#ef4444','#f59e0b','#eab308','#22c55e','#10b981'][pwStrength.value] ?? '');

/* ── Avatar initials ────────────────────────────────────────────────────── */
const initials = computed(() => {
    const name = form.value?.displayName ?? 'Alex Sterling';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
});
const avatarBg = computed(() => form.value?.accentColor ?? '#3b82f6');

/* ── Watchers ───────────────────────────────────────────────────────────── */
onMounted(async () => {
    await store.fetchSettings();
    if (store.settings) {
        form.value = { ...store.settings };
        applyTheme(form.value.theme);
        applyAccent(form.value.accentColor);
    }
});
watch(() => store.settings, v => { if (v && !form.value) { form.value = { ...v }; applyTheme(v.theme); applyAccent(v.accentColor); } });
watch(() => form.value?.language, lang => { if (lang && locale.value !== lang) locale.value = lang; });
watch(() => form.value?.theme,       v => { if (v) applyTheme(v);  dirty.value = true; });
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

    <!-- ── Header ─────────────────────────────────────────────────────────── -->
    <div class="st-header">
      <div>
        <h1 class="st-title">{{ t('settings.title') }}</h1>
        <p class="st-subtitle">{{ t('settings.subtitle') }}</p>
      </div>
      <div class="st-header-actions">
        <span v-if="dirty && !saved" class="st-unsaved">
          <i class="pi pi-circle-fill" style="font-size:.5rem" /> Unsaved changes
        </span>
        <transition name="fade">
          <span v-if="saved || pwSaved" class="st-saved">
            <i class="pi pi-check-circle" /> {{ t('settings.saved') }}
          </span>
        </transition>
        <pv-button :label="t('settings.save')" icon="pi pi-check"
            :loading="store.saving" class="st-save-btn" @click="save" />
      </div>
    </div>

    <div v-if="store.loading" class="st-loading">
      <i class="pi pi-spin pi-spinner" style="font-size:2rem;color:#3b82f6" />
      <span style="font-size:.9rem;color:#6b7280;margin-top:.75rem">Loading your preferences…</span>
    </div>

    <div v-else-if="form" class="st-body">

      <!-- ── Sidebar nav ───────────────────────────────────────────────────── -->
      <nav class="st-nav">
        <div class="st-nav-profile">
          <div class="st-nav-avatar" :style="{ background: avatarBg }">{{ initials }}</div>
          <div>
            <span class="st-nav-name">{{ form.displayName }}</span>
            <span class="st-nav-role">{{ form.jobTitle }}</span>
          </div>
        </div>
        <div class="st-nav-divider" />

        <button
            v-for="item in NAV" :key="item.key"
            :class="['st-nav-item', { 'st-nav-item--active': section === item.key }]"
            @click="section = item.key"
        >
          <i :class="['pi', item.icon]" />
          <span>{{ t(item.labelKey) }}</span>
          <i class="pi pi-chevron-right st-nav-chevron" />
        </button>

        <!-- FAQ -->
        <div class="st-nav-divider" />
        <div class="st-nav-faq">
          <h4 class="st-faq-title"><i class="pi pi-question-circle" /> {{ t('settings.faq.title') }}</h4>
          <div v-for="(faq, i) in FAQ_ITEMS" :key="i">
            <button class="st-faq-q" @click="openFaqIdx = openFaqIdx === i ? null : i">
              {{ faq.q }}
              <i :class="['pi', openFaqIdx === i ? 'pi-chevron-up' : 'pi-chevron-down']" />
            </button>
            <div v-if="openFaqIdx === i" class="st-faq-a">{{ faq.a }}</div>
          </div>
        </div>
      </nav>

      <!-- ── Content panel ─────────────────────────────────────────────────── -->
      <div class="st-content">

        <!-- ══ APPEARANCE ══════════════════════════════════════════════════ -->
        <section v-if="section === 'appearance'">
          <div class="st-section-head">
            <div class="st-section-icon" style="background:#eff6ff;color:#3b82f6"><i class="pi pi-palette"/></div>
            <div>
              <h2 class="st-section-title">{{ t('settings.nav.appearance') }}</h2>
              <p class="st-section-sub">{{ t('settings.appearanceDesc') }}</p>
            </div>
          </div>

          <!-- Theme -->
          <div class="st-block">
            <label class="st-label">{{ t('settings.theme') }}</label>
            <div class="st-theme-grid">
              <div v-for="th in THEME_OPTIONS" :key="th.value"
                  :class="['st-theme-card', { 'st-theme-card--active': form.theme === th.value }]"
                  @click="form.theme = th.value">
                <!-- Mini UI preview -->
                <div class="st-theme-preview" :class="'st-theme-preview--' + th.value">
                  <div class="stp-sidebar" />
                  <div class="stp-main">
                    <div class="stp-topbar" />
                    <div class="stp-cards">
                      <div class="stp-card" /><div class="stp-card" /><div class="stp-card" />
                    </div>
                  </div>
                </div>
                <div class="st-theme-label">
                  <i :class="['pi', th.icon]" style="font-size:.85rem" />
                  <span>{{ th.label }}</span>
                </div>
                <div v-if="form.theme === th.value" class="st-theme-check"><i class="pi pi-check"/></div>
              </div>
            </div>
          </div>

          <!-- Accent Color -->
          <div class="st-block">
            <label class="st-label">{{ t('settings.accentColor') }}</label>
            <p class="st-hint">{{ t('settings.accentColorDesc') }}</p>
            <div class="st-accent-grid">
              <button
                v-for="ac in ACCENT_COLORS" :key="ac.value"
                class="st-accent-swatch"
                :style="{ background: ac.value, boxShadow: form.accentColor === ac.value ? `0 0 0 3px #fff, 0 0 0 5px ${ac.value}` : 'none' }"
                :title="ac.name"
                @click="form.accentColor = ac.value"
              />
            </div>
          </div>

          <!-- Density -->
          <div class="st-block">
            <label class="st-label">{{ t('settings.density') }}</label>
            <p class="st-hint">{{ t('settings.densityDesc') }}</p>
            <div class="st-density-grid">
              <div v-for="d in DENSITY_OPTIONS" :key="d.value"
                  :class="['st-density-card', { 'st-density-card--active': form.density === d.value }]"
                  @click="form.density = d.value">
                <i :class="['pi', d.icon]" class="st-density-icon" />
                <span class="st-density-label">{{ d.label.value }}</span>
                <span class="st-density-desc">{{ d.desc }}</span>
                <div v-if="form.density === d.value" class="st-theme-check"><i class="pi pi-check"/></div>
              </div>
            </div>
          </div>

          <!-- Language -->
          <div class="st-block">
            <label class="st-label">{{ t('settings.language') }}</label>
            <p class="st-hint">{{ t('settings.languageDesc') }}</p>
            <div class="st-lang-grid">
              <div v-for="lang in LANG_OPTIONS" :key="lang.value"
                  :class="['st-lang-card', { 'st-lang-card--active': form.language === lang.value }]"
                  @click="form.language = lang.value">
                <span class="st-lang-flag">{{ lang.flag }}</span>
                <div>
                  <span class="st-lang-name">{{ lang.label }}</span>
                  <span class="st-lang-locale">{{ lang.locale }}</span>
                </div>
                <div v-if="form.language === lang.value" class="st-lang-check"><i class="pi pi-check"/></div>
              </div>
            </div>
          </div>
        </section>

        <!-- ══ REGIONAL ════════════════════════════════════════════════════ -->
        <section v-else-if="section === 'regional'">
          <div class="st-section-head">
            <div class="st-section-icon" style="background:#f0fdf4;color:#16a34a"><i class="pi pi-globe"/></div>
            <div>
              <h2 class="st-section-title">{{ t('settings.nav.regional') }}</h2>
              <p class="st-section-sub">{{ t('settings.regionalDesc') }}</p>
            </div>
          </div>

          <!-- Live preview box -->
          <div class="st-preview-hero">
            <div class="st-preview-hero-label"><i class="pi pi-eye" style="margin-right:.4rem"/>{{ t('settings.datePreview') }}</div>
            <div class="st-preview-hero-value">{{ previewDate }}</div>
            <div class="st-preview-hero-meta">
              {{ form.timezone }} · {{ form.currency }} · Week starts {{ form.firstDayOfWeek }}
            </div>
          </div>

          <div class="st-field-grid">
            <div class="st-field">
              <label class="st-label">{{ t('settings.timezone') }}</label>
              <pv-select v-model="form.timezone" :options="TIMEZONE_OPTIONS" class="w-full" />
            </div>
            <div class="st-field">
              <label class="st-label">{{ t('settings.dateFormat') }}</label>
              <pv-select v-model="form.dateFormat" :options="DATE_FORMAT_OPTIONS" class="w-full" />
            </div>
            <div class="st-field">
              <label class="st-label">{{ t('settings.timeFormat') }}</label>
              <div class="st-toggle-row">
                <button :class="['st-seg-btn', { 'st-seg-btn--active': form.timeFormat === '12h' }]"
                    @click="form.timeFormat = '12h'">
                  <i class="pi pi-clock" /> {{ t('settings.timeFormat12') }}
                </button>
                <button :class="['st-seg-btn', { 'st-seg-btn--active': form.timeFormat === '24h' }]"
                    @click="form.timeFormat = '24h'">
                  <i class="pi pi-clock" /> {{ t('settings.timeFormat24') }}
                </button>
              </div>
            </div>
            <div class="st-field">
              <label class="st-label">{{ t('settings.firstDayOfWeek') }}</label>
              <div class="st-toggle-row">
                <button :class="['st-seg-btn', { 'st-seg-btn--active': form.firstDayOfWeek === 'Sunday' }]"
                    @click="form.firstDayOfWeek = 'Sunday'">Sunday</button>
                <button :class="['st-seg-btn', { 'st-seg-btn--active': form.firstDayOfWeek === 'Monday' }]"
                    @click="form.firstDayOfWeek = 'Monday'">Monday</button>
              </div>
            </div>
            <div class="st-field">
              <label class="st-label">{{ t('settings.currency') }}</label>
              <pv-select v-model="form.currency" :options="CURRENCY_OPTIONS" class="w-full" />
            </div>
          </div>
        </section>

        <!-- ══ NOTIFICATIONS ════════════════════════════════════════════════ -->
        <section v-else-if="section === 'notifications'">
          <div class="st-section-head">
            <div class="st-section-icon" style="background:#fef9c3;color:#ca8a04"><i class="pi pi-bell"/></div>
            <div>
              <h2 class="st-section-title">{{ t('settings.nav.notifications') }}</h2>
              <p class="st-section-sub">{{ t('settings.notificationsDesc') }}</p>
            </div>
          </div>

          <div class="st-notif-group">
            <div class="st-notif-header"><i class="pi pi-envelope"/>Email & Push</div>
            <div class="st-toggle-list">
              <div class="st-toggle-item">
                <div>
                  <span class="st-toggle-name">{{ t('settings.emailNotifications') }}</span>
                  <span class="st-toggle-desc">{{ t('settings.emailNotificationsDesc') }}</span>
                </div>
                <button :class="['st-toggle', { 'st-toggle--on': form.emailNotifications }]"
                    @click="form.emailNotifications = !form.emailNotifications">
                  <span class="st-toggle-knob" />
                </button>
              </div>
              <div class="st-toggle-item">
                <div>
                  <span class="st-toggle-name">{{ t('settings.pushNotifications') }}</span>
                  <span class="st-toggle-desc">{{ t('settings.pushNotificationsDesc') }}</span>
                </div>
                <button :class="['st-toggle', { 'st-toggle--on': form.pushNotifications }]"
                    @click="form.pushNotifications = !form.pushNotifications">
                  <span class="st-toggle-knob" />
                </button>
              </div>
            </div>
          </div>

          <div class="st-notif-group">
            <div class="st-notif-header"><i class="pi pi-calendar"/>Digests & Mentions</div>
            <div class="st-toggle-list">
              <div class="st-toggle-item">
                <div>
                  <span class="st-toggle-name">{{ t('settings.weeklyDigest') }}</span>
                  <span class="st-toggle-desc">{{ t('settings.weeklyDigestDesc') }}</span>
                </div>
                <button :class="['st-toggle', { 'st-toggle--on': form.weeklyDigest }]"
                    @click="form.weeklyDigest = !form.weeklyDigest">
                  <span class="st-toggle-knob" />
                </button>
              </div>
              <div class="st-toggle-item">
                <div>
                  <span class="st-toggle-name">{{ t('settings.mentionAlerts') }}</span>
                  <span class="st-toggle-desc">{{ t('settings.mentionAlertsDesc') }}</span>
                </div>
                <button :class="['st-toggle', { 'st-toggle--on': form.mentionAlerts }]"
                    @click="form.mentionAlerts = !form.mentionAlerts">
                  <span class="st-toggle-knob" />
                </button>
              </div>
            </div>
          </div>

          <!-- Quiet hours -->
          <div class="st-block" style="margin-top:1.25rem">
            <label class="st-label">Quiet Hours</label>
            <p class="st-hint">Pause all notifications during specific hours.</p>
            <div class="st-quiet-hours">
              <div class="st-quiet-from">
                <span class="st-quiet-label">From</span>
                <select class="st-quiet-select"><option>10:00 PM</option><option>9:00 PM</option><option>8:00 PM</option></select>
              </div>
              <i class="pi pi-arrow-right" style="color:#9ca3af;font-size:.8rem"/>
              <div class="st-quiet-from">
                <span class="st-quiet-label">Until</span>
                <select class="st-quiet-select"><option>7:00 AM</option><option>6:00 AM</option><option>8:00 AM</option></select>
              </div>
              <span class="st-quiet-badge">Mon – Fri</span>
            </div>
          </div>
        </section>

        <!-- ══ SECURITY ═════════════════════════════════════════════════════ -->
        <section v-else-if="section === 'security'">
          <div class="st-section-head">
            <div class="st-section-icon" style="background:#fef2f2;color:#dc2626"><i class="pi pi-shield"/></div>
            <div>
              <h2 class="st-section-title">{{ t('settings.nav.security') }}</h2>
              <p class="st-section-sub">{{ t('settings.securityDesc') }}</p>
            </div>
          </div>

          <!-- MFA -->
          <div class="st-toggle-list">
            <div class="st-toggle-item">
              <div>
                <span class="st-toggle-name">{{ t('settings.twoFactor') }}</span>
                <span class="st-toggle-desc">{{ t('settings.twoFactorDesc') }}</span>
              </div>
              <button :class="['st-toggle', { 'st-toggle--on': form.twoFactorEnabled }]"
                  @click="form.twoFactorEnabled = !form.twoFactorEnabled">
                <span class="st-toggle-knob" />
              </button>
            </div>
          </div>

          <!-- 2FA setup hint -->
          <div v-if="form.twoFactorEnabled" class="st-info-box">
            <i class="pi pi-mobile" style="font-size:1.2rem;color:#3b82f6"/>,
            <div>
              <span class="st-info-title">Authenticator app required</span>
              <span class="st-info-desc">Download Google Authenticator or Authy, then scan the QR code in your security setup flow.</span>
            </div>
          </div>

          <!-- Visibility -->
          <div class="st-block" style="margin-top:1.5rem">
            <label class="st-label">{{ t('settings.profileVisibility') }}</label>
            <div class="st-visibility-grid">
              <div v-for="opt in VISIBILITY_OPTIONS" :key="opt.value"
                  :class="['st-vis-card', { 'st-vis-card--active': form.profileVisibility === opt.value }]"
                  @click="form.profileVisibility = opt.value">
                <i :class="['pi', opt.value==='team'?'pi-users':opt.value==='public'?'pi-globe':'pi-lock']" />
                <span>{{ opt.label }}</span>
              </div>
            </div>
          </div>

          <!-- Sessions -->
          <div class="st-block" style="margin-top:1.5rem">
            <label class="st-label">{{ t('settings.activeSessions') }}</label>
            <p class="st-hint">{{ t('settings.sessionDesc') }}</p>
            <div class="st-sessions">
              <div class="st-session">
                <div class="st-session-icon"><i class="pi pi-desktop"/></div>
                <div class="st-session-body">
                  <span class="st-session-name">MacBook Pro · Chrome 124</span>
                  <span class="st-session-meta">New York, USA · <span class="st-session-current">Current session</span></span>
                </div>
                <span class="st-session-status st-session-status--active">Active</span>
              </div>
              <div class="st-session">
                <div class="st-session-icon"><i class="pi pi-mobile"/></div>
                <div class="st-session-body">
                  <span class="st-session-name">iPhone 15 · Safari Mobile</span>
                  <span class="st-session-meta">New York, USA · 2 hours ago</span>
                </div>
                <span class="st-session-status">Idle</span>
              </div>
              <div class="st-session">
                <div class="st-session-icon"><i class="pi pi-desktop"/></div>
                <div class="st-session-body">
                  <span class="st-session-name">Windows PC · Edge 123</span>
                  <span class="st-session-meta">Miami, USA · 1 day ago</span>
                </div>
                <button class="st-session-revoke">Revoke</button>
              </div>
            </div>
            <pv-button :label="t('settings.signOutAll')" severity="secondary" outlined icon="pi pi-sign-out" size="small" style="margin-top:.75rem" />
          </div>

          <!-- Danger zone -->
          <div class="st-danger-zone">
            <h3 class="st-danger-title"><i class="pi pi-exclamation-triangle"/> {{ t('settings.dangerZone') }}</h3>
            <div class="st-danger-row">
              <div>
                <span class="st-danger-item-name">{{ t('settings.changePassword') }}</span>
                <span class="st-danger-item-desc">Last changed 90 days ago</span>
              </div>
              <pv-button :label="t('settings.changePassword')" severity="secondary" outlined icon="pi pi-lock" size="small" @click="openPwDialog"/>
            </div>
            <div class="st-danger-row">
              <div>
                <span class="st-danger-item-name">{{ t('settings.deleteAccount') }}</span>
                <span class="st-danger-item-desc">{{ t('settings.deleteAccountDesc') }}</span>
              </div>
              <pv-button :label="t('settings.deleteAccount')" severity="danger" outlined icon="pi pi-trash" size="small"/>
            </div>
          </div>
        </section>

        <!-- ══ ACCOUNT ══════════════════════════════════════════════════════ -->
        <section v-else-if="section === 'account'">
          <div class="st-section-head">
            <div class="st-section-icon" style="background:#f5f3ff;color:#7c3aed"><i class="pi pi-user"/></div>
            <div>
              <h2 class="st-section-title">{{ t('settings.nav.account') }}</h2>
              <p class="st-section-sub">{{ t('settings.accountDesc') }}</p>
            </div>
          </div>

          <!-- Profile hero -->
          <div class="st-profile-hero">
            <div class="st-profile-avatar-wrap">
              <div class="st-profile-avatar" :style="{ background: avatarBg }">{{ initials }}</div>
              <button class="st-avatar-edit-btn" title="Change avatar"><i class="pi pi-camera"/></button>
            </div>
            <div class="st-profile-info">
              <span class="st-profile-name">{{ form.displayName }}</span>
              <span class="st-profile-job">{{ form.jobTitle }} · {{ form.department }}</span>
              <span class="st-profile-email"><i class="pi pi-envelope" style="margin-right:.3rem"/>alex.sterling@vantagepmo.io</span>
            </div>
          </div>

          <div class="st-field-grid" style="margin-top:1.5rem">
            <div class="st-field">
              <label class="st-label">{{ t('settings.displayName') }}</label>
              <pv-input-text v-model="form.displayName" class="w-full" />
            </div>
            <div class="st-field">
              <label class="st-label">{{ t('settings.jobTitle') }}</label>
              <pv-input-text v-model="form.jobTitle" class="w-full" />
            </div>
            <div class="st-field">
              <label class="st-label">{{ t('settings.department') }}</label>
              <pv-input-text v-model="form.department" class="w-full" />
            </div>
            <div class="st-field">
              <label class="st-label">{{ t('settings.phone') }}</label>
              <pv-input-text v-model="form.phone" class="w-full" :placeholder="t('settings.phonePlaceholder')" />
            </div>
            <div class="st-field st-field--full">
              <label class="st-label">{{ t('settings.bio') }}</label>
              <pv-textarea v-model="form.bio" rows="3" class="w-full" :placeholder="t('settings.bioPlaceholder')" />
            </div>
          </div>
        </section>

        <!-- ══ INTEGRATIONS ═════════════════════════════════════════════════ -->
        <section v-else-if="section === 'integrations'">
          <div class="st-section-head">
            <div class="st-section-icon" style="background:#fff7ed;color:#ea580c"><i class="pi pi-link"/></div>
            <div>
              <h2 class="st-section-title">{{ t('settings.nav.integrations') }}</h2>
              <p class="st-section-sub">{{ t('settings.integrationsDesc') }}</p>
            </div>
          </div>

          <div class="st-integrations">
            <div v-for="ig in INTEGRATIONS" :key="ig.key" class="st-integration">
              <div class="st-ig-icon" :style="{ background: ig.color + '18' }">
                <i :class="['pi', ig.icon]" :style="{ color: ig.color }" />
              </div>
              <div class="st-ig-body">
                <span class="st-ig-name">{{ ig.name }}</span>
                <span class="st-ig-desc">{{ ig.desc }}</span>
                <span v-if="ig.connected && ig.lastSync" class="st-ig-sync">
                  <i class="pi pi-refresh" style="font-size:.65rem"/> Last sync: {{ ig.lastSync }}
                </span>
              </div>
              <div class="st-ig-actions">
                <span v-if="ig.connected" class="st-ig-connected"><i class="pi pi-check-circle"/> {{ t('settings.connected') }}</span>
                <pv-button v-if="ig.connected" :label="t('settings.disconnect')" severity="secondary" outlined size="small" />
                <pv-button v-else :label="t('settings.connect')" size="small" />
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  </div>

  <!-- ── Change Password Dialog ──────────────────────────────────────────── -->
  <pv-dialog v-model:visible="showPwDialog" :header="t('settings.passwordDialog.title')" modal style="width:440px">
    <div class="st-pw-form">
      <div class="st-field">
        <label class="st-label">{{ t('settings.passwordDialog.current') }}</label>
        <input type="password" v-model="pwForm.current" class="st-pw-input" placeholder="Enter current password" />
      </div>
      <div class="st-field">
        <label class="st-label">{{ t('settings.passwordDialog.newPassword') }}</label>
        <input type="password" v-model="pwForm.newPw" class="st-pw-input" placeholder="At least 8 characters" />
        <!-- Strength bar -->
        <div v-if="pwForm.newPw" class="st-pw-strength">
          <div class="st-pw-bar">
            <div class="st-pw-fill" :style="{ width: (pwStrength/5*100)+'%', background: pwStrengthColor }" />
          </div>
          <span class="st-pw-label" :style="{ color: pwStrengthColor }">{{ pwStrengthLabel }}</span>
        </div>
      </div>
      <div class="st-field">
        <label class="st-label">{{ t('settings.passwordDialog.confirm') }}</label>
        <input type="password" v-model="pwForm.confirm" class="st-pw-input" placeholder="Repeat new password" />
      </div>
      <p v-if="pwError" class="st-pw-error"><i class="pi pi-exclamation-circle"/> {{ pwError }}</p>
    </div>
    <template #footer>
      <pv-button :label="t('settings.passwordDialog.cancel')" text @click="showPwDialog=false" />
      <pv-button :label="t('settings.passwordDialog.save')" icon="pi pi-check" @click="submitPassword" />
    </template>
  </pv-dialog>
</template>

<style scoped>
/* ── Page layout ───────────────────────────────────────────────────────── */
.st-page { display: flex; flex-direction: column; gap: 1.25rem; }

.st-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; }
.st-title  { font-size: 1.6rem; font-weight: 800; margin: 0; color: #111827; }
.st-subtitle { color: #6b7280; font-size: .9rem; margin: .2rem 0 0; }
.st-header-actions { display: flex; align-items: center; gap: .75rem; }
.st-save-btn { background: #1d4ed8 !important; border-color: #1d4ed8 !important; font-weight: 700; }
.st-saved   { display: flex; align-items: center; gap: .35rem; color: #059669; font-size: .85rem; font-weight: 600; }
.st-unsaved { display: flex; align-items: center; gap: .35rem; color: #f59e0b; font-size: .78rem; font-weight: 600; }
.fade-enter-active, .fade-leave-active { transition: opacity .3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.st-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 5rem; gap: .5rem; }

/* ── Body ───────────────────────────────────────────────────────────────── */
.st-body { display: flex; gap: 1.5rem; align-items: flex-start; }

/* ── Sidebar ────────────────────────────────────────────────────────────── */
.st-nav {
  width: 240px; flex-shrink: 0;
  background: #fff; border: 1px solid #e5e7eb; border-radius: 14px;
  padding: .75rem .5rem; display: flex; flex-direction: column; gap: .15rem;
}
.st-nav-profile {
  display: flex; align-items: center; gap: .75rem;
  padding: .5rem .6rem .75rem;
}
.st-nav-avatar {
  width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: .85rem; font-weight: 800; color: #fff;
}
.st-nav-name { display: block; font-size: .85rem; font-weight: 700; color: #111827; }
.st-nav-role { display: block; font-size: .72rem; color: #9ca3af; }

.st-nav-item {
  display: flex; align-items: center; gap: .7rem;
  background: none; border: none; border-radius: 9px;
  padding: .65rem .85rem; font-size: .88rem; font-weight: 600;
  color: #6b7280; cursor: pointer; text-align: left;
  transition: background .12s, color .12s; width: 100%;
}
.st-nav-item .pi:first-child { font-size: .95rem; flex-shrink: 0; }
.st-nav-item:hover { background: #f3f4f6; color: #111827; }
.st-nav-item--active { background: #eff6ff; color: #1d4ed8; }
.st-nav-chevron { margin-left: auto; font-size: .7rem; opacity: .4; }
.st-nav-divider { height: 1px; background: #f3f4f6; margin: .4rem 0; }

.st-nav-faq { padding: .4rem .6rem; }
.st-faq-title { font-size: .68rem; font-weight: 800; text-transform: uppercase; letter-spacing: .07em; color: #9ca3af; margin: 0 0 .4rem; display: flex; align-items: center; gap: .3rem; }
.st-faq-q {
  background: none; border: none; width: 100%; text-align: left;
  font-size: .76rem; font-weight: 600; color: #374151; cursor: pointer;
  display: flex; justify-content: space-between; align-items: flex-start; gap: .5rem;
  padding: .3rem .15rem; border-radius: 6px; transition: background .1s;
}
.st-faq-q:hover { background: #f9fafb; }
.st-faq-q .pi { font-size: .65rem; color: #9ca3af; flex-shrink: 0; margin-top: .15rem; }
.st-faq-a { font-size: .72rem; color: #6b7280; line-height: 1.5; padding: .2rem .15rem .4rem .5rem; border-left: 2px solid #e5e7eb; margin: .1rem 0 .3rem .1rem; }

/* ── Content panel ──────────────────────────────────────────────────────── */
.st-content {
  flex: 1; background: #fff; border: 1px solid #e5e7eb;
  border-radius: 14px; padding: 2rem; min-height: 480px;
}

/* Section head */
.st-section-head { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
.st-section-icon {
  width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 1.15rem;
}
.st-section-title { font-size: 1.1rem; font-weight: 800; color: #111827; margin: 0 0 .2rem; }
.st-section-sub   { font-size: .82rem; color: #6b7280; margin: 0; }

/* Generic block */
.st-block { margin-bottom: 2rem; }
.st-label { font-size: .72rem; font-weight: 800; text-transform: uppercase; letter-spacing: .07em; color: #374151; display: block; margin-bottom: .45rem; }
.st-hint  { font-size: .78rem; color: #6b7280; margin: -.25rem 0 .65rem; }

/* Field grid */
.st-field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
.st-field { display: flex; flex-direction: column; gap: .45rem; }
.st-field--full { grid-column: 1 / -1; }

/* ── Theme cards ────────────────────────────────────────────────────────── */
.st-theme-grid { display: flex; gap: 1rem; flex-wrap: wrap; }
.st-theme-card {
  flex: 1; min-width: 110px; max-width: 160px;
  border: 2px solid #e5e7eb; border-radius: 14px; padding: 1rem;
  cursor: pointer; transition: all .15s; position: relative;
  display: flex; flex-direction: column; gap: .65rem;
}
.st-theme-card:hover { border-color: #93c5fd; }
.st-theme-card--active { border-color: #3b82f6; box-shadow: 0 0 0 3px #eff6ff; }

/* Mini UI Previews */
.st-theme-preview {
  border-radius: 8px; overflow: hidden;
  display: flex; height: 64px; border: 1px solid #e5e7eb;
}
.st-theme-preview--light .stp-sidebar { width: 24px; background: #f8fafc; border-right: 1px solid #e5e7eb; }
.st-theme-preview--light .stp-main   { flex: 1; background: #f5f6fa; display: flex; flex-direction: column; }
.st-theme-preview--light .stp-topbar { height: 14px; background: #fff; border-bottom: 1px solid #e5e7eb; }
.st-theme-preview--light .stp-cards  { display: flex; gap: 2px; padding: 4px 3px; }
.st-theme-preview--light .stp-card   { flex: 1; height: 20px; background: #fff; border-radius: 3px; }

.st-theme-preview--dark .stp-sidebar { width: 24px; background: #1e293b; border-right: 1px solid #334155; }
.st-theme-preview--dark .stp-main    { flex: 1; background: #0f172a; display: flex; flex-direction: column; }
.st-theme-preview--dark .stp-topbar  { height: 14px; background: #1e293b; border-bottom: 1px solid #334155; }
.st-theme-preview--dark .stp-cards   { display: flex; gap: 2px; padding: 4px 3px; }
.st-theme-preview--dark .stp-card    { flex: 1; height: 20px; background: #1e293b; border-radius: 3px; }

.st-theme-preview--system .stp-sidebar { width: 24px; background: linear-gradient(180deg,#f8fafc 50%,#1e293b 50%); border-right: 1px solid #e5e7eb; }
.st-theme-preview--system .stp-main    { flex: 1; background: linear-gradient(180deg,#f5f6fa 50%,#0f172a 50%); display: flex; flex-direction: column; }
.st-theme-preview--system .stp-topbar  { height: 14px; background: linear-gradient(90deg,#fff 50%,#1e293b 50%); border-bottom: 1px solid #e5e7eb; }
.st-theme-preview--system .stp-cards   { display: flex; gap: 2px; padding: 4px 3px; }
.st-theme-preview--system .stp-card    { flex: 1; height: 20px; background: linear-gradient(90deg,#fff 50%,#1e293b 50%); border-radius: 3px; }

.st-theme-label { display: flex; align-items: center; gap: .4rem; font-size: .82rem; font-weight: 700; color: #374151; }
.st-theme-check {
  position: absolute; top: .45rem; right: .45rem;
  width: 20px; height: 20px; border-radius: 50%;
  background: #3b82f6; color: #fff;
  display: flex; align-items: center; justify-content: center; font-size: .6rem;
}

/* Accent colors */
.st-accent-grid { display: flex; gap: .6rem; flex-wrap: wrap; margin-top: .25rem; }
.st-accent-swatch {
  width: 32px; height: 32px; border-radius: 50%; border: none; cursor: pointer;
  transition: transform .12s, box-shadow .12s;
}
.st-accent-swatch:hover { transform: scale(1.15); }

/* Density */
.st-density-grid { display: flex; gap: .75rem; }
.st-density-card {
  flex: 1; border: 2px solid #e5e7eb; border-radius: 12px;
  padding: 1rem; cursor: pointer; transition: all .15s;
  display: flex; flex-direction: column; align-items: center; gap: .3rem;
  position: relative; text-align: center;
}
.st-density-card:hover { border-color: #93c5fd; background: #f8fafc; }
.st-density-card--active { border-color: #3b82f6; background: #eff6ff; }
.st-density-icon { font-size: 1.1rem; color: #6b7280; }
.st-density-card--active .st-density-icon { color: #3b82f6; }
.st-density-label { font-size: .82rem; font-weight: 700; color: #374151; }
.st-density-desc  { font-size: .68rem; color: #9ca3af; }

/* Language */
.st-lang-grid { display: flex; gap: .75rem; flex-wrap: wrap; }
.st-lang-card {
  display: flex; align-items: center; gap: .75rem;
  border: 2px solid #e5e7eb; border-radius: 10px; padding: .85rem 1.25rem;
  cursor: pointer; transition: all .15s; position: relative; min-width: 155px;
}
.st-lang-card:hover { border-color: #93c5fd; background: #f8fafc; }
.st-lang-card--active { border-color: #3b82f6; background: #eff6ff; }
.st-lang-flag { font-size: 1.5rem; flex-shrink: 0; }
.st-lang-name { display: block; font-size: .9rem; font-weight: 700; color: #111827; }
.st-lang-locale { display: block; font-size: .7rem; color: #9ca3af; }
.st-lang-check {
  margin-left: auto; width: 20px; height: 20px; border-radius: 50%;
  background: #3b82f6; color: #fff;
  display: flex; align-items: center; justify-content: center; font-size: .6rem;
}

/* Regional preview hero */
.st-preview-hero {
  background: linear-gradient(135deg, #eff6ff, #f5f3ff);
  border: 1px solid #c7d2fe; border-radius: 14px;
  padding: 1.25rem 1.5rem; margin-bottom: 1.75rem;
}
.st-preview-hero-label { font-size: .7rem; font-weight: 800; text-transform: uppercase; letter-spacing: .07em; color: #6366f1; margin-bottom: .4rem; }
.st-preview-hero-value { font-size: 1.35rem; font-weight: 800; color: #1e1b4b; margin-bottom: .25rem; }
.st-preview-hero-meta  { font-size: .78rem; color: #6b7280; }

/* Segmented buttons */
.st-toggle-row { display: flex; gap: 0; border: 1px solid #e5e7eb; border-radius: 9px; overflow: hidden; width: fit-content; }
.st-seg-btn {
  background: none; border: none; border-right: 1px solid #e5e7eb;
  padding: .55rem 1rem; font-size: .82rem; font-weight: 600; color: #6b7280;
  cursor: pointer; display: flex; align-items: center; gap: .35rem;
  transition: background .12s, color .12s; white-space: nowrap;
}
.st-seg-btn:last-child { border-right: none; }
.st-seg-btn:hover { background: #f3f4f6; color: #111827; }
.st-seg-btn--active { background: #eff6ff; color: #1d4ed8; }

/* Quiet hours */
.st-quiet-hours { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
.st-quiet-from { display: flex; flex-direction: column; gap: .25rem; }
.st-quiet-label { font-size: .68rem; font-weight: 700; color: #9ca3af; text-transform: uppercase; }
.st-quiet-select {
  border: 1px solid #e5e7eb; border-radius: 8px; padding: .45rem .75rem;
  font-size: .85rem; color: #374151; background: #f9fafb; outline: none; cursor: pointer;
}
.st-quiet-badge {
  background: #f3f4f6; color: #6b7280; font-size: .72rem; font-weight: 700;
  padding: .25rem .65rem; border-radius: 99px;
}

/* Notifications toggles */
.st-notif-group { margin-bottom: 1.5rem; }
.st-notif-header { display: flex; align-items: center; gap: .5rem; font-size: .72rem; font-weight: 800; text-transform: uppercase; letter-spacing: .07em; color: #9ca3af; margin-bottom: .6rem; }
.st-toggle-list { display: flex; flex-direction: column; }
.st-toggle-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: .9rem 0; border-bottom: 1px solid #f3f4f6;
}
.st-toggle-item:last-child { border-bottom: none; }
.st-toggle-name { display: block; font-size: .9rem; font-weight: 700; color: #111827; }
.st-toggle-desc { display: block; font-size: .78rem; color: #6b7280; margin-top: .12rem; }
.st-toggle {
  position: relative; width: 44px; height: 24px; border-radius: 99px;
  background: #e5e7eb; border: none; cursor: pointer;
  transition: background .2s; flex-shrink: 0;
}
.st-toggle--on { background: #3b82f6; }
.st-toggle-knob {
  position: absolute; top: 3px; left: 3px; width: 18px; height: 18px;
  border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.2);
  transition: transform .2s;
}
.st-toggle--on .st-toggle-knob { transform: translateX(20px); }

/* Security info box */
.st-info-box {
  display: flex; align-items: flex-start; gap: .85rem;
  background: #eff6ff; border: 1px solid #bfdbfe;
  border-radius: 10px; padding: .85rem 1rem; margin-top: .75rem;
}
.st-info-title { display: block; font-size: .85rem; font-weight: 700; color: #1d4ed8; }
.st-info-desc  { display: block; font-size: .78rem; color: #3b82f6; margin-top: .1rem; }

/* Visibility grid */
.st-visibility-grid { display: flex; gap: .75rem; }
.st-vis-card {
  flex: 1; border: 2px solid #e5e7eb; border-radius: 10px;
  padding: .75rem .5rem; cursor: pointer; transition: all .15s;
  display: flex; flex-direction: column; align-items: center; gap: .35rem;
  font-size: .78rem; font-weight: 700; color: #6b7280;
}
.st-vis-card .pi { font-size: 1.1rem; }
.st-vis-card:hover { border-color: #93c5fd; background: #f8fafc; }
.st-vis-card--active { border-color: #3b82f6; background: #eff6ff; color: #1d4ed8; }

/* Sessions */
.st-sessions { display: flex; flex-direction: column; gap: .5rem; }
.st-session {
  display: flex; align-items: center; gap: .85rem;
  background: #f9fafb; border-radius: 10px; padding: .65rem .85rem;
}
.st-session-icon { width: 34px; height: 34px; background: #eff6ff; border-radius: 9px; display:flex; align-items:center; justify-content:center; color:#3b82f6; flex-shrink:0; }
.st-session-body { flex: 1; }
.st-session-name { display: block; font-size: .84rem; font-weight: 700; color: #111827; }
.st-session-meta { display: block; font-size: .72rem; color: #9ca3af; margin-top: .05rem; }
.st-session-current { color: #059669; font-weight: 700; }
.st-session-status { font-size: .7rem; font-weight: 700; padding: 2px 9px; border-radius: 99px; background: #f3f4f6; color: #6b7280; }
.st-session-status--active { background: #d1fae5; color: #059669; }
.st-session-revoke { background: none; border: 1px solid #fecaca; color: #dc2626; border-radius: 6px; padding: 3px 10px; font-size: .72rem; font-weight: 700; cursor: pointer; }
.st-session-revoke:hover { background: #fef2f2; }

/* Danger zone */
.st-danger-zone {
  margin-top: 2rem; border: 1px solid #fecaca; border-radius: 12px;
  padding: 1.25rem 1.5rem; background: #fff5f5;
  display: flex; flex-direction: column; gap: 1rem;
}
.st-danger-title { font-size: .85rem; font-weight: 800; color: #dc2626; margin: 0; display: flex; align-items: center; gap: .4rem; }
.st-danger-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.st-danger-item-name { display: block; font-size: .88rem; font-weight: 700; color: #374151; }
.st-danger-item-desc { display: block; font-size: .72rem; color: #9ca3af; margin-top: .1rem; }

/* Account hero */
.st-profile-hero {
  display: flex; align-items: center; gap: 1.25rem;
  background: linear-gradient(135deg, #f5f3ff, #eff6ff);
  border: 1px solid #e0e7ff; border-radius: 14px; padding: 1.25rem 1.5rem;
}
.st-profile-avatar-wrap { position: relative; flex-shrink: 0; }
.st-profile-avatar {
  width: 64px; height: 64px; border-radius: 50%; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.3rem; font-weight: 800;
}
.st-avatar-edit-btn {
  position: absolute; bottom: 0; right: 0;
  width: 22px; height: 22px; border-radius: 50%;
  background: #1d4ed8; color: #fff; border: 2px solid #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: .6rem; cursor: pointer;
}
.st-profile-name  { display: block; font-size: 1.05rem; font-weight: 800; color: #111827; }
.st-profile-job   { display: block; font-size: .82rem; color: #6b7280; margin-top: .1rem; }
.st-profile-email { display: block; font-size: .78rem; color: #9ca3af; margin-top: .2rem; }

/* Integrations */
.st-integrations { display: flex; flex-direction: column; gap: .6rem; }
.st-integration {
  display: flex; align-items: center; gap: 1rem;
  background: #f9fafb; border: 1px solid #f3f4f6;
  border-radius: 12px; padding: 1rem 1.25rem;
  transition: box-shadow .15s, border-color .15s;
}
.st-integration:hover { box-shadow: 0 2px 8px rgba(0,0,0,.06); border-color: #e5e7eb; }
.st-ig-icon { width: 42px; height: 42px; border-radius: 10px; display:flex; align-items:center; justify-content:center; font-size:1.1rem; flex-shrink:0; }
.st-ig-body { flex: 1; }
.st-ig-name { display: block; font-size: .88rem; font-weight: 700; color: #111827; }
.st-ig-desc { display: block; font-size: .75rem; color: #6b7280; }
.st-ig-sync { display: block; font-size: .68rem; color: #059669; margin-top: .15rem; }
.st-ig-actions { display: flex; align-items: center; gap: .65rem; }
.st-ig-connected { display: flex; align-items: center; gap: .3rem; font-size: .75rem; font-weight: 700; color: #059669; }

/* Password form */
.st-pw-form { display: flex; flex-direction: column; gap: 1.1rem; padding: .25rem 0; }
.st-pw-input {
  width: 100%; border: 1px solid #e5e7eb; border-radius: 8px;
  padding: .55rem .85rem; font-size: .9rem; color: #374151;
  background: #f9fafb; outline: none; transition: border-color .15s;
}
.st-pw-input:focus { border-color: #3b82f6; background: #fff; }
.st-pw-strength { display: flex; align-items: center; gap: .75rem; margin-top: .35rem; }
.st-pw-bar { flex: 1; height: 5px; background: #e5e7eb; border-radius: 99px; overflow: hidden; }
.st-pw-fill { height: 100%; border-radius: 99px; transition: width .3s, background .3s; }
.st-pw-label { font-size: .72rem; font-weight: 800; min-width: 70px; }
.st-pw-error { font-size: .8rem; color: #dc2626; display: flex; align-items: center; gap: .35rem; margin: 0; }

@media (max-width: 900px) {
  .st-body { flex-direction: column; }
  .st-nav  { width: 100%; }
  .st-field-grid { grid-template-columns: 1fr; }
  .st-theme-grid, .st-density-grid { flex-wrap: wrap; }
}
</style>
