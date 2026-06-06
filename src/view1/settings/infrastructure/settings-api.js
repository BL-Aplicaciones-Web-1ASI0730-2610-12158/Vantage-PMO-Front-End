import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';
import { SettingsAssembler } from './settings.assembler.js';

class SettingsApi extends BaseEndpoint {
    constructor() {
        super(import.meta.env.VITE_USER_SETTINGS_ENDPOINT_PATH || '/user-settings');
    }

    async getSettings() {
        const response = await this.api.get(this.resourcePath);
        return SettingsAssembler.toEntity(response.data);
    }

    async updateSettings(settings) {
        const response = await this.api.put(this.resourcePath, settings);
        return SettingsAssembler.toEntity(response.data);
    }
}

export const settingsApi = new SettingsApi();
