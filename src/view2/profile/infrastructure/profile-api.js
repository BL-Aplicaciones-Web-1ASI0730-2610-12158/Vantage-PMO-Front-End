import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';
import { ProfileAssembler } from './profile.assembler.js';
import { StatsAssembler } from './stats.assembler.js';

/**
 * Profile API - View 2
 * Infrastructure service for multi-portfolio profile context.
 */
class ProfileApi extends BaseEndpoint {
    constructor() {
        super(import.meta.env.VITE_USERS_ENDPOINT_PATH);
    }

    async getById(id) {
        const data = await super.getById(id);
        return ProfileAssembler.toEntity(data);
    }

    async getStatsByUserId(userId) {
        const data = await this.api
            .get(import.meta.env.VITE_STATS_ENDPOINT_PATH, { params: { userId } })
            .then(res => res.data[0]);

        return StatsAssembler.toEntity(data);
    }
}

export const profileApi = new ProfileApi();