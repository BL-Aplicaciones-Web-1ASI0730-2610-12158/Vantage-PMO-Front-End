import { AdminPolicyEntity } from '../domain/model/admin-policy.entity.js';

export class AdminPolicyAssembler {
    static toEntity(raw) {
        return new AdminPolicyEntity(raw);
    }

    static toEntities(raws) {
        return raws.map(AdminPolicyAssembler.toEntity);
    }
}
