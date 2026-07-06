import { Meeting } from '../domain/model/meeting.entity.js';
import { normalizeCalendarDate } from '../../shared/infrastructure/calendar-date.js';

export class MeetingAssembler {
    static toEntity(resource) {
        return new Meeting({
            ...resource,
            date: normalizeCalendarDate(resource.date) ?? resource.date,
        });
    }

    static toEntities(resources) {
        return resources.map(MeetingAssembler.toEntity);
    }
}
