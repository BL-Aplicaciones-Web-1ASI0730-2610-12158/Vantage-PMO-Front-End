<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProfileStore } from '../../../application/profile.store.js';
import ProfileEditDialog from '../../components/profile-edit-dialog.vue';

const router = useRouter();
const store  = useProfileStore();

const showEditDialog = ref(false);
const shareMessage   = ref('');

function goToPortfolio() {
  router.push({ name: 'active-projects' });
}

function statusLabel(status) {
  const map = { healthy: 'profile.statusHealthy', 'at-risk': 'profile.statusAtRisk', critical: 'profile.statusCritical' };
  return map[status] ?? 'profile.statusHealthy';
}

function statusClass(status) {
  if (status === 'healthy') return 'badge-healthy';
  if (status === 'at-risk') return 'badge-at-risk';
  return 'badge-critical';
}

function progressBarClass(status) {
  if (status === 'healthy') return 'fill-green';
  if (status === 'at-risk') return 'fill-yellow';
  return 'fill-red';
}

function skillLevel(pct) {
  if (pct >= 90) return { labelKey: 'profile.skillExpert', segments: 4 };
  if (pct >= 75) return { labelKey: 'profile.skillAdvanced', segments: 3 };
  if (pct >= 60) return { labelKey: 'profile.skillIntermediate', segments: 2 };
  return { labelKey: 'profile.skillBeginner', segments: 1 };
}

async function shareProfile() {
  const url = `${window.location.origin}/dashboard/profile`;
  try {
    await navigator.clipboard.writeText(url);
    shareMessage.value = 'profile.shareCopied';
  } catch {
    shareMessage.value = 'profile.shareFailed';
  }
  setTimeout(() => { shareMessage.value = ''; }, 2500);
}

async function handleSave(formData) {
  await store.updateProfile(formData);
}
</script>

<template>
  <div class="profile-overview">
    <div v-if="store.loading" class="state-msg">
      <i class="pi pi-spin pi-spinner"></i> {{ $t('profile.loading') }}
    </div>

    <div v-else-if="store.error" class="state-msg error">
      <i class="pi pi-exclamation-triangle"></i> {{ $t('profile.error') }}
    </div>

    <template v-else-if="store.user">
      <!-- Header: banner + identity + actions -->
      <div class="profile-hero card">
        <div class="hero-banner"></div>
        <div class="hero-body">
          <div class="hero-left">
            <div class="photo-wrap">
              <img :src="store.user.avatarUrl" :alt="store.user.name" class="hero-photo" />
              <span class="online-dot"></span>
            </div>
            <div class="hero-info">
              <h1 class="hero-name">{{ store.user.name }}</h1>
              <p class="hero-subtitle">
                {{ store.user.role }}
                <span v-if="store.user.location"> • {{ store.user.location }}</span>
              </p>
            </div>
          </div>
          <div class="hero-actions">
            <button class="btn-outline" @click="showEditDialog = true">
              {{ $t('profile.editProfile') }}
            </button>
            <button class="btn-primary" @click="shareProfile">
              {{ $t('profile.shareProfile') }}
            </button>
          </div>
        </div>
        <p v-if="shareMessage" class="share-toast">{{ $t(shareMessage) }}</p>
      </div>

      <!-- Two-column body -->
      <div class="profile-body">
        <!-- Left column -->
        <div class="col-left">
          <!-- About -->
          <div class="card about-card">
            <h2 class="section-eyebrow">{{ $t('profile.aboutSection') }}</h2>
            <p v-for="(p, i) in store.user.bio" :key="i" class="about-text">{{ p }}</p>
            <div class="meta-grid">
              <div class="meta-item">
                <span class="meta-label">{{ $t('profile.department') }}</span>
                <span class="meta-value">{{ store.user.department }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">{{ $t('profile.yearsActive') }}</span>
                <span class="meta-value">{{ store.user.yearsActive }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">{{ $t('profile.availabilityLabel') }}</span>
                <span class="meta-value availability">
                  <span class="avail-dot"></span>
                  {{ store.user.availabilityLabel }}
                </span>
              </div>
            </div>
          </div>

          <!-- Active Projects -->
          <div class="card">
            <div class="section-row">
              <h2 class="section-eyebrow">{{ $t('profile.activeProjects') }}</h2>
              <button class="link-btn" @click="goToPortfolio">{{ $t('profile.viewAll') }}</button>
            </div>
            <div class="project-list">
              <div
                v-for="project in store.projects"
                :key="project.id"
                class="project-item"
                @click="goToPortfolio"
              >
                <div class="project-top">
                  <h3 class="project-name">{{ project.name }}</h3>
                  <span :class="['status-badge', statusClass(project.status)]">
                    {{ $t(statusLabel(project.status)) }}
                  </span>
                </div>
                <p class="project-desc">{{ project.description }}</p>
                <div class="progress-row">
                  <div class="progress-track">
                    <div
                      :class="['progress-fill', progressBarClass(project.status)]"
                      :style="{ width: project.progress + '%' }"
                    ></div>
                  </div>
                  <span class="progress-pct">{{ project.progress }}% {{ $t('profile.complete') }}</span>
                </div>
                <span v-if="project.dueDate" class="project-due">{{ project.dueDate }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right column -->
        <div class="col-right">
          <!-- Technical Skills -->
          <div class="card">
            <h2 class="section-eyebrow">{{ $t('profile.technicalSkills') }}</h2>
            <div class="skills-list">
              <div v-for="skill in store.skills.slice(0, 3)" :key="skill.id" class="skill-item">
                <div class="skill-top">
                  <span class="skill-name">{{ skill.name }}</span>
                  <span class="skill-level">{{ $t(skillLevel(skill.percentage).labelKey) }}</span>
                </div>
                <div class="segment-bar">
                  <span
                    v-for="n in 4"
                    :key="n"
                    class="segment"
                    :class="{ filled: n <= skillLevel(skill.percentage).segments }"
                  ></span>
                </div>
              </div>
            </div>
            <div class="core-tags">
              <span class="tags-label">{{ $t('profile.coreTags') }}</span>
              <div class="tags-row">
                <span v-for="tag in store.user.certifications" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
          </div>

          <!-- Endorsements -->
          <div class="card">
            <h2 class="section-eyebrow">{{ $t('profile.topEndorsements') }}</h2>
            <div class="endorsement-list">
              <div
                v-for="item in store.endorsements.slice(0, 2)"
                :key="item.id"
                class="endorsement-row"
              >
                <img :src="item.authorAvatarUrl" :alt="item.authorName" class="endorser-avatar" />
                <div>
                  <span class="endorser-name">{{ item.authorName }}</span>
                  <span class="endorser-role">{{ item.authorRole }}</span>
                </div>
              </div>
            </div>
            <button class="btn-network" @click="router.push({ name: 'team' })">
              {{ $t('profile.seeAllNetwork', { n: store.endorsements.length + 40 }) }}
            </button>
          </div>
        </div>
      </div>

      <ProfileEditDialog
        v-model:visible="showEditDialog"
        :user="store.user"
        @save="handleSave"
      />
    </template>
  </div>
</template>

<style scoped>
.profile-overview {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.state-msg {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 48px;
  color: #64748b;
  font-size: 14px;
}
.state-msg.error { color: #dc2626; }

.card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  padding: 24px;
}

/* ── Hero ── */
.profile-hero {
  padding: 0;
  overflow: hidden;
  position: relative;
}

.hero-banner {
  height: 120px;
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%);
  background-image:
    linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%),
    repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.04) 10px, rgba(255,255,255,0.04) 20px);
}

.hero-body {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 28px 24px;
  margin-top: -40px;
  gap: 20px;
  flex-wrap: wrap;
}

.hero-left {
  display: flex;
  align-items: flex-end;
  gap: 20px;
}

.photo-wrap {
  position: relative;
  flex-shrink: 0;
}

.hero-photo {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  border: 4px solid white;
  object-fit: cover;
  background: #eff6ff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.online-dot {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 14px;
  height: 14px;
  background: #16a34a;
  border: 2px solid white;
  border-radius: 50%;
}

.hero-name {
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 4px;
  padding-top: 44px;
}

.hero-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

.hero-actions {
  display: flex;
  gap: 10px;
  align-self: center;
  padding-top: 20px;
}

.btn-outline {
  padding: 9px 18px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
}
.btn-outline:hover { background: #f8fafc; }

.btn-primary {
  padding: 9px 18px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  font-size: 13px;
  font-weight: 600;
  color: white;
  cursor: pointer;
}
.btn-primary:hover { background: #1d4ed8; }

.share-toast {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  color: white;
  font-size: 12px;
  padding: 6px 14px;
  border-radius: 6px;
  margin: 0;
}

/* ── Body grid ── */
.profile-body {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 24px;
  align-items: start;
}

.col-left, .col-right {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-eyebrow {
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin: 0 0 14px;
}

.section-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.section-row .section-eyebrow { margin: 0; }

.link-btn {
  background: none;
  border: none;
  color: #2563eb;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.about-text {
  font-size: 13px;
  color: #475569;
  line-height: 1.7;
  margin: 0 0 12px;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.meta-label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.meta-value {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
}

.meta-value.availability {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #16a34a;
}

.avail-dot {
  width: 8px;
  height: 8px;
  background: #16a34a;
  border-radius: 50%;
}

/* Projects */
.project-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.project-item {
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 16px;
  cursor: pointer;
  transition: box-shadow 0.15s;
}
.project-item:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.06); }

.project-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.project-name {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.status-badge {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 3px 8px;
  border-radius: 4px;
}
.badge-healthy  { background: #dcfce7; color: #16a34a; }
.badge-at-risk  { background: #fef3c7; color: #d97706; }
.badge-critical { background: #fee2e2; color: #dc2626; }

.project-desc {
  font-size: 12px;
  color: #64748b;
  margin: 0 0 12px;
  line-height: 1.5;
}

.progress-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.progress-track {
  flex: 1;
  height: 6px;
  background: #f1f5f9;
  border-radius: 99px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 99px;
}
.fill-green  { background: #2563eb; }
.fill-yellow { background: #f59e0b; }
.fill-red    { background: #ef4444; }

.progress-pct {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  white-space: nowrap;
}

.project-due {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
}

/* Skills */
.skills-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.skill-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.skill-name {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.skill-level {
  font-size: 11px;
  font-weight: 600;
  color: #2563eb;
}

.segment-bar {
  display: flex;
  gap: 4px;
}

.segment {
  flex: 1;
  height: 6px;
  background: #f1f5f9;
  border-radius: 2px;
}
.segment.filled { background: #2563eb; }

.core-tags {
  border-top: 1px solid #f1f5f9;
  padding-top: 16px;
}

.tags-label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  font-size: 11px;
  font-weight: 600;
  color: #475569;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 99px;
  padding: 5px 12px;
}

/* Endorsements */
.endorsement-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 16px;
}

.endorsement-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.endorser-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  object-fit: cover;
}

.endorser-name {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
}

.endorser-role {
  display: block;
  font-size: 11px;
  color: #64748b;
}

.btn-network {
  width: 100%;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
}
.btn-network:hover { background: #f1f5f9; }

@media (max-width: 1024px) {
  .profile-body { grid-template-columns: 1fr; }
  .meta-grid { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .hero-body { flex-direction: column; align-items: flex-start; }
  .hero-left { flex-direction: column; align-items: flex-start; }
  .hero-name { padding-top: 0; }
  .hero-actions { width: 100%; }
  .btn-outline, .btn-primary { flex: 1; text-align: center; }
}
</style>
