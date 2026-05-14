import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';
import { SupportAssembler } from './support.assembler.js';

class SupportApi extends BaseEndpoint {
    constructor() {
        super(import.meta.env.VITE_SUPPORT_ENDPOINT_PATH);
    }

    async getAllTickets() {
        const data = await super.getAll();
        return SupportAssembler.toEntities(data);
    }

    async createTicket(ticket) {
        const data = await super.create(ticket);
        return SupportAssembler.toEntity(data);
    }
}

export const supportApi = new SupportApi();
