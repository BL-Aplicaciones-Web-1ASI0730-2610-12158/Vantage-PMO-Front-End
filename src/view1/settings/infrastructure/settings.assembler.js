import { UserSettings } from '../domain/model/user-settings.entity.js';

export class SettingsAssembler {
    static toEntity(resource) {
        return new UserSettings(resource);
    }
}
