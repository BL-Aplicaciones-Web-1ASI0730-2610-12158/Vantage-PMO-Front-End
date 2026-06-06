import { BaseEndpoint } from '../../../shared/infrastructure/base-endpoint.js';
import { ScheduleAssembler } from './schedule.assembler.js';

class ScheduleApi extends BaseEndpoint {
    constructor() {
        super(import.meta.env.VITE_SCHEDULE_ENDPOINT_PATH);
    }

    async getAllItems() {
        const data = await super.getAll();
        return ScheduleAssembler.toEntities(data);
    }
}

export const scheduleApi = new ScheduleApi();
