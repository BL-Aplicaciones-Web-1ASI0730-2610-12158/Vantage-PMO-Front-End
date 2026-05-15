import { BrandingEntity } from '../domain/model/branding.entity.js';

export class BrandingAssembler {
    static toEntity(raw) {
        return new BrandingEntity(raw);
    }

    static toEntities(raws) {
        return raws.map(BrandingAssembler.toEntity);
    }
}
