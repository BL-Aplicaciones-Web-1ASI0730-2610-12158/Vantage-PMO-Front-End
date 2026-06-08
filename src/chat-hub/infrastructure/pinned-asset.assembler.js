import { PinnedAsset } from '../domain/model/pinned-asset.entity.js';

export class PinnedAssetAssembler {
    static toEntity(resource) {
        return new PinnedAsset(resource);
    }

    static toEntities(resources) {
        return (resources ?? []).map(PinnedAssetAssembler.toEntity);
    }
}
