import * as settingsRepository from '../repository/settings.repository.js';

export function getSettings(): any {
  const settings = settingsRepository.getAppSettings();
  return settings || {};
}

export function saveSettings(settings: any): void {
  if (!settings || typeof settings !== 'object') {
    throw new Error('Geçersiz ayar verisi');
  }
  
  settingsRepository.saveAppSettings(settings);
}
