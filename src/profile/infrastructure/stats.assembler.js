import { Stats } from '../domain/model/stats.entity.js';

/**
 * Stats Assembler
 * Maps raw API response data to Stats domain entities.
 */
export class StatsAssembler {
    static toEntity(resource) {
        return new Stats(resource);
    }

    static toEntities(resources) {
        return resources.map(StatsAssembler.toEntity);
    }
}
