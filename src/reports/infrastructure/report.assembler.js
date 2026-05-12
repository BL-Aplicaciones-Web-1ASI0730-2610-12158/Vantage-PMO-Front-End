import { Report } from '../domain/model/report.entity.js';

export class ReportAssembler {
    static toEntity(resource) {
        return new Report(resource);
    }

    static toEntities(resources) {
        return resources.map(ReportAssembler.toEntity);
    }
}