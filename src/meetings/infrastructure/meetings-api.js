import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';
import { MeetingAssembler } from './meeting.assembler.js';

class MeetingsApi extends BaseEndpoint {
    constructor() {
        super(import.meta.env.VITE_MEETINGS_ENDPOINT_PATH);
    }

    async getAllMeetings() {
        const data = await super.getAll();
        return MeetingAssembler.toEntities(data);
    }

    async createMeeting(meeting) {
        const data = await super.create(meeting);
        return MeetingAssembler.toEntity(data);
    }
}

export const meetingsApi = new MeetingsApi();
