import { SupportTicket } from '../domain/model/support-ticket.entity.js';

export class SupportAssembler {
    static toEntity(resource) {
        return new SupportTicket(resource);
    }

    static toEntities(resources) {
        return resources.map(SupportAssembler.toEntity);
    }
}
