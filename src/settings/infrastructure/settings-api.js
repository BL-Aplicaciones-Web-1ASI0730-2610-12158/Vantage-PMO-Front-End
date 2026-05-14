import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';
import { SettingsAssembler } from './settings.assembler.js';

class SettingsApi extends BaseEndpoint {
    constructor() {
        super(import.meta.env.VITE_USER_SETTINGS_ENDPOINT_PATH);
    }

    async getSettings() {
        const data = await super.getById(1);
        return SettingsAssembler.toEntity(data);
    }

    async updateSettings(settings) {
        const data = await super.update(1, settings);
        return SettingsAssembler.toEntity(data);
    }
}

export const settingsApi = new SettingsApi();
