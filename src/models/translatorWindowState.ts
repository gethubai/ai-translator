import { LocalBrain } from '@hubai/core';

export type Language = {
  code: string;
  name: string;
};

export interface TranslationWindowState {
  fromLanguage: Language;
  toLanguage: Language;
  from: string;
  to: string;
  availableLanguages: Language[];
  selectedBrain?: LocalBrain;
  availableBrains: LocalBrain[];
  error?: string;
}

export enum TranslationWindowEvent {
  onLanguagesChanged = 'onLanguagesChanged',
}
