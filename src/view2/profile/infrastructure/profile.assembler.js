import { Profile } from '../domain/model/profile.entity.js';

/**
 * Profile Assembler (View 2)
 */
export class ProfileAssembler {
    static toEntity(resource) {
        return new Profile(resource);
    }

    static toEntities(resources) {
        return resources.map(ProfileAssembler.toEntity);
    }
}