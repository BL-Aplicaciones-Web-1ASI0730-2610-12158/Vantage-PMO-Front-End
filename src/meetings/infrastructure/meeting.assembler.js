import { Meeting } from '../domain/model/meeting.entity.js';

export class MeetingAssembler {
    static toEntity(resource) {
        return new Meeting(resource);
    }

    static toEntities(resources) {
        return resources.map(MeetingAssembler.toEntity);
    }
}
