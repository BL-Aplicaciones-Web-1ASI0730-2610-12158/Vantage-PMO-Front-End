import { ProfileSkill } from '../domain/model/skill.entity.js';

export class SkillAssembler {
    static toEntity(resource) {
        return new ProfileSkill(resource);
    }

    static toEntities(resources) {
        return resources.map(SkillAssembler.toEntity);
    }
}
