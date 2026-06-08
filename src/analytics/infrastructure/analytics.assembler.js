import { Analytics } from '../domain/model/analytics.entity.js';

export class AnalyticsAssembler {
    static toEntity(resource) {
        return new Analytics(resource);
    }

    static toEntities(resources) {
        return resources.map(AnalyticsAssembler.toEntity);
    }
}
