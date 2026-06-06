import { Stats } from '../domain/model/stats.entity.js';

/**
 * Stats Assembler (View 2)
 */
export class StatsAssembler {
    static toEntity(resource) {
        return new Stats(resource);
    }

    static toEntities(resources) {
        return resources.map(StatsAssembler.toEntity);
    }
}