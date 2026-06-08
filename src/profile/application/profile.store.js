import { defineStore } from 'pinia';
import { ref } from 'vue';
import { profileApi } from '../infrastructure/profile-api.js';
import { projectsApi } from '../../projects/infrastructure/projects-api.js';
import { Profile } from '../domain/model/profile.entity.js';
import { Stats } from '../domain/model/stats.entity.js';
import { ProfileSkill } from '../domain/model/skill.entity.js';
import { Endorsement } from '../domain/model/endorsement.entity.js';
import { getFallbackForUser } from '../infrastructure/profile-fallbacks.js';

function isProfileComplete(user) {
    return Boolean(user.bio?.length && user.availability);
}

function mergeUser(user, fallback) {
    if (!fallback?.user) return user;
    if (isProfileComplete(user)) return user;
    const f = fallback.user;
    return new Profile({
        id: user.id,
        name: user.name || f.name,
        role: f.role,
        email: user.email || f.email,
        department: user.department || f.department,
        joined: f.joined,
        avatarSeed: f.avatarSeed,
        availability: f.availability,
        experience: f.experience,
        deliveryRate: f.deliveryRate,
        activeBudget: f.activeBudget,
        bio: f.bio,
        certifications: f.certifications,
        skillsDescription: f.skillsDescription,
        location: f.location,
        yearsActive: f.yearsActive,
        availabilityLabel: f.availabilityLabel,
    });
}

function mergeStats(stats, fallback, userId) {
    if (stats) return stats;
    if (!fallback?.stats) return null;
    return new Stats({ id: 0, userId, ...fallback.stats });
}

function mergeSkills(skills, fallback, userId) {
    if (skills.length > 0) return skills;
    if (!fallback?.skills) return [];
    return fallback.skills.map((s, i) => new ProfileSkill({ id: i + 1, userId, ...s }));
}

function mergeEndorsements(endorsements, fallback, userId) {
    if (endorsements.length > 0) return endorsements;
    if (!fallback?.endorsements) return [];
    return fallback.endorsements.map((e, i) => new Endorsement({ id: i + 1, userId, ...e }));
}

/**
 * Profile Application Store
 */
export const useProfileStore = defineStore('profile', () => {
    const user         = ref(null);
    const stats        = ref(null);
    const skills       = ref([]);
    const endorsements = ref([]);
    const projects     = ref([]);
    const loading      = ref(false);
    const error        = ref(null);

    async function fetchProfile(userId = 2, email = null) {
        loading.value = true;
        error.value   = null;
        try {
            let userData = null;

            if (userId) {
                try {
                    userData = await profileApi.getById(userId);
                } catch {
                    userData = null;
                }
            }

            if (!userData && email) {
                userData = await profileApi.getByEmail(email);
                if (userData) userId = userData.id;
            }

            if (!userData) {
                throw new Error('User profile not found');
            }

            const resolvedId = userData.id ?? userId;
            const fallback   = getFallbackForUser(resolvedId);

            const [statsData, skillsData, endorsementsData, allProjects] = await Promise.all([
                profileApi.getStatsByUserId(resolvedId),
                profileApi.getSkillsByUserId(resolvedId),
                profileApi.getEndorsementsByUserId(resolvedId),
                projectsApi.getAllProjects().catch(() => []),
            ]);

            user.value         = mergeUser(userData, fallback);
            stats.value        = mergeStats(statsData, fallback, resolvedId);
            skills.value       = mergeSkills(skillsData, fallback, resolvedId);
            endorsements.value = mergeEndorsements(endorsementsData, fallback, resolvedId);

            const userProjects = allProjects.filter(p => p.userId === resolvedId).slice(0, 2);
            projects.value = userProjects.length > 0 ? userProjects : allProjects.slice(0, 2);
        } catch (e) {
            error.value = e.message ?? 'Failed to load profile';
        } finally {
            loading.value = false;
        }
    }

    async function updateProfile(data) {
        if (!user.value?.id) return;
        try {
            const updated = await profileApi.updateProfile(user.value.id, data);
            user.value = mergeUser(updated, getFallbackForUser(user.value.id));
        } catch {
            user.value = new Profile({ ...user.value, ...data });
        }
    }

    return { user, stats, skills, endorsements, projects, loading, error, fetchProfile, updateProfile };
});
