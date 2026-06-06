import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

/**
 * Profile Infrastructure Service
 * Extends BaseEndpoint for the /users resource.
 */
class ProfileService extends BaseEndpoint {
    constructor() {
        super(import.meta.env.VITE_USERS_ENDPOINT_PATH);
    }

    getStatsByUserId(userId) {
        return this.api
            .get(import.meta.env.VITE_STATS_ENDPOINT_PATH, { params: { userId } })
            .then(res => res.data[0]);
    }
}

export const profileService = new ProfileService();
