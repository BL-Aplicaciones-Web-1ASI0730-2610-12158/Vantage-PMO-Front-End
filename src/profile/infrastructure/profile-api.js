import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';
import { ProfileAssembler } from './profile.assembler.js';
import { StatsAssembler } from './stats.assembler.js';
import { SkillAssembler } from './skill.assembler.js';
import { EndorsementAssembler } from './endorsement.assembler.js';

/**
 * Profile API
 * Infrastructure service for the profile bounded context.
 */
class ProfileApi extends BaseEndpoint {
    constructor() {
        super(import.meta.env.VITE_USERS_ENDPOINT_PATH);
    }

    async getById(id) {
        const data = await super.getById(id);
        return ProfileAssembler.toEntity(data);
    }

    async getByEmail(email) {
        const data = await super.getByQuery({ email });
        if (!data?.length) return null;
        return ProfileAssembler.toEntity(data[0]);
    }

    async getStatsByUserId(userId) {
        try {
            const data = await this.api
                .get(import.meta.env.VITE_STATS_ENDPOINT_PATH, { params: { userId } })
                .then(res => res.data);
            if (!Array.isArray(data) || data.length === 0) return null;
            return StatsAssembler.toEntity(data[0]);
        } catch {
            return null;
        }
    }

    async getSkillsByUserId(userId) {
        try {
            const data = await this.api
                .get(import.meta.env.VITE_PROFILE_SKILLS_ENDPOINT_PATH, { params: { userId } })
                .then(res => res.data);
            return SkillAssembler.toEntities(Array.isArray(data) ? data : []);
        } catch {
            return [];
        }
    }

    async getEndorsementsByUserId(userId) {
        try {
            const data = await this.api
                .get(import.meta.env.VITE_ENDORSEMENTS_ENDPOINT_PATH, { params: { userId } })
                .then(res => res.data);
            return EndorsementAssembler.toEntities(Array.isArray(data) ? data : []);
        } catch {
            return [];
        }
    }

    async updateProfile(id, data) {
        const raw = await super.patch(id, data);
        return ProfileAssembler.toEntity(raw);
    }
}

export const profileApi = new ProfileApi();
