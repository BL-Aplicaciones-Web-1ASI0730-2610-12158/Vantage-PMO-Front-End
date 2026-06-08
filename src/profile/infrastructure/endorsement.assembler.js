import { Endorsement } from '../domain/model/endorsement.entity.js';

export class EndorsementAssembler {
    static toEntity(resource) {
        return new Endorsement(resource);
    }

    static toEntities(resources) {
        return resources.map(EndorsementAssembler.toEntity);
    }
}
