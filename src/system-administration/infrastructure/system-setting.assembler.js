import { SystemSettingEntity } from '../domain/model/system-setting.entity.js';

export class SystemSettingAssembler {
    static toEntity(raw) {
        return new SystemSettingEntity(raw);
    }

    static toEntities(raws) {
        return raws.map(SystemSettingAssembler.toEntity);
    }
}
