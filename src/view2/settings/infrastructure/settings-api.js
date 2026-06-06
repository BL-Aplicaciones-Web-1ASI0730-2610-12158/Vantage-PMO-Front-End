class SettingsApi extends BaseEndpoint {
    constructor() {
        super('/org-settings');
    }

    async getSettings(orgId) {
        const res = await this.api.get(`${this.resourcePath}/${orgId}`);
        return SettingsAssembler.toEntity(res.data);
    }

    async updateSettings(settings) {
        const res = await this.api.put(
            `${this.resourcePath}/${settings.orgId}`,
            settings
        );
        return SettingsAssembler.toEntity(res.data);
    }
}