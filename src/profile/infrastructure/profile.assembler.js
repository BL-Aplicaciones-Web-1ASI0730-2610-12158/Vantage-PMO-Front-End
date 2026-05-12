import { Profile } from '../domain/model/profile.entity.js';

/**
 * Profile Assembler
 * Maps raw API response data to Profile domain entities.
 */
export class ProfileAssembler {
    static toEntity(resource) {
        return new Profile(resource);
    }

    static toEntities(resources) {
        return resources.map(ProfileAssembler.toEntity);
    }
}
