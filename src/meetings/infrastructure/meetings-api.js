import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';
import { MeetingAssembler } from './meeting.assembler.js';
import baseApi from '../../shared/infrastructure/base-api.js';

class MeetingsApi extends BaseEndpoint {
    constructor() {
        super(import.meta.env.VITE_MEETINGS_ENDPOINT_PATH);
    }

    async getAllMeetings() {
        const data = await super.getAll();
        return MeetingAssembler.toEntities(data);
    }

    async getMeetingById(id) {
        const data = await super.getById(id);
        return MeetingAssembler.toEntity(data);
    }

    async createMeeting(meeting) {
        const payload = {
            ...meeting,
            time: normalizeTime(meeting.time),
        };
        const data = await super.create(payload);
        return MeetingAssembler.toEntity(data);
    }

    async convertAgreementToTask(meetingId, agreementId) {
        const { data } = await baseApi.post(
            `${this.resourcePath}/${meetingId}/agreements/${agreementId}/convert-to-task`
        );
        return {
            meeting: MeetingAssembler.toEntity(data.meeting),
            taskId: data.taskId,
            taskRef: data.taskRef,
        };
    }

    async exportMinutes(meetingId, options = {}) {
        const params = {
            format: (options.format ?? 'csv').toLowerCase(),
            attendees: options.config?.attendees ?? true,
            agenda: options.config?.agenda ?? true,
            minutes: options.config?.minutes ?? true,
            agreements: options.config?.agreements ?? true,
        };

        const response = await baseApi.get(
            `${this.resourcePath}/${meetingId}/minutes/export`,
            {
                params,
                responseType: params.format === 'json' ? 'json' : 'blob',
            }
        );

        return response;
    }
}

function normalizeTime(value) {
    if (!value || typeof value !== 'string') return '09:00:00';
    return value.length === 5 ? `${value}:00` : value;
}

export const meetingsApi = new MeetingsApi();

export const MEETING_SEGMENTS = [
    'Segment 1 (Leaders) Executive Board',
    'Segment 2 (Operations) Engineering Leadership',
    'All Segments',
    'General',
];

export function isMeetingSegment1(segment) {
    const value = String(segment ?? '');
    return value.includes('Segment 1');
}

export function isMeetingSegment2(segment) {
    const value = String(segment ?? '');
    return value.includes('Segment 2') ||
        value.includes('Engineering Leadership') ||
        value.includes('(Operations)');
}

export function matchesMeetingSegmentFilter(meeting, filter) {
    if (filter === 'segment1') return isMeetingSegment1(meeting.segment);
    if (filter === 'segment2') return isMeetingSegment2(meeting.segment);
    return true;
}
