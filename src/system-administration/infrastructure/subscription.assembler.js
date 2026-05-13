import { SubscriptionEntity } from '../domain/model/subscription.entity.js';

export class SubscriptionAssembler {
    static toEntity(raw) {
        return new SubscriptionEntity(raw);
    }

    static toEntities(raws) {
        return raws.map(SubscriptionAssembler.toEntity);
    }
}
