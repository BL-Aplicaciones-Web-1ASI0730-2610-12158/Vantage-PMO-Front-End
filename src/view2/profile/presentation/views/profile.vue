<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useProfileStore } from '../../application/profile.store.js';

const router = useRouter();
const store  = useProfileStore();
const { t }  = useI18n();

onMounted(() => store.fetchProfile(1));
</script>

<template>
  <div class="profile-page">
    <!-- Header -->
    <div class="profile-header">
      <button class="back-btn" @click="router.push({ name: 'home' })">
        <i class="pi pi-arrow-left"></i> {{ $t('profile.back') }}
      </button>
      <h1 class="page-title">{{ $t('profile.title') }}</h1>
    </div>

    <template v-if="store.user && store.stats">
      <!-- Profile Card -->
      <div class="profile-card">
        <div class="profile-avatar-section">
          <img
              :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${store.user.avatarSeed}`"
              alt="Profile Avatar"
              class="profile-avatar"
          />
          <div class="profile-info">
            <h2 class="profile-name">{{ store.user.name }}</h2>
            <span class="profile-role">{{ store.user.role }}</span>
            <span class="profile-email"><i class="pi pi-envelope"></i> {{ store.user.email }}</span>
          </div>
        </div>

        <div class="profile-divider"></div>

        <!-- Details -->
        <div class="profile-details">
          <div class="detail-item">
            <span class="detail-label">{{ $t('profile.department') }}</span>
            <span class="detail-value">{{ store.user.department }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">{{ $t('profile.memberSince') }}</span>
            <span class="detail-value">{{ store.user.joined }}</span>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="profile-stats">
        <div class="profile-stat-card">
          <span class="stat-num">{{ store.stats.totalProjects }}</span>
          <span class="stat-lbl">{{ $t('profile.totalProjects') }}</span>
        </div>
        <div class="profile-stat-card green">
          <span class="stat-num green">{{ store.stats.onTrack }}</span>
          <span class="stat-lbl">{{ $t('profile.onTrack') }}</span>
        </div>
        <div class="profile-stat-card red">
          <span class="stat-num red">{{ store.stats.atRisk }}</span>
          <span class="stat-lbl">{{ $t('profile.atRisk') }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 600px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 13px;
  color: #475569;
  cursor: pointer;
  font-weight: 500;
}

.back-btn:hover { background: #f1f5f9; }

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.profile-card {
  background: white;
  border-radius: 12px;
  padding: 28px;
  border: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #dbeafe;
  background: #eff6ff;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-name {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.profile-role {
  font-size: 13px;
  color: #2563eb;
  font-weight: 600;
}

.profile-email {
  font-size: 13px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
}

.profile-divider {
  height: 1px;
  background: #f1f5f9;
}

.profile-details {
  display: flex;
  gap: 32px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 14px;
  color: #1e293b;
  font-weight: 600;
}

.profile-stats {
  display: flex;
  gap: 16px;
}

.profile-stat-card {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.stat-num {
  font-size: 28px;
  font-weight: 800;
  color: #1e293b;
}

.stat-num.green { color: #16a34a; }
.stat-num.red { color: #dc2626; }

.stat-lbl {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .profile-header { flex-direction: column; align-items: center; text-align: center; gap: 16px; }
  .profile-stats  { flex-direction: column; gap: 10px; }
  .profile-stat-card { padding: 14px; }
  .stat-num { font-size: 22px; }
}
</style>
