export class SettingsAssembler {
    static toEntity(resource) {
        return new UserSettings(resource);
    }
}