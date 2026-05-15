import { ScheduleItem } from '../domain/model/schedule-item.entity.js';

export class ScheduleAssembler {
    static toEntity(resource) {
        return new ScheduleItem(resource);
    }

    static toEntities(resources) {
        return resources.map(ScheduleAssembler.toEntity);
    }
}
