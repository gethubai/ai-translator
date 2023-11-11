import { react } from '@hubai/core';
import {
  Language,
  TranslationWindowEvent,
  TranslationWindowState,
} from '../models/translatorWindowState';
const { Component } = react;

export default class TranslatorWindowService extends Component<TranslationWindowState> {
  protected state: TranslationWindowState;

  constructor() {
    super();

    this.state = {
      fromLanguage: { code: 'auto-detect', name: 'Auto detect' },
      toLanguage: { code: 'en', name: 'English' },
      from: '',
      to: '',
      availableLanguages: [],
      availableBrains: [],
    };
  }

  swapLanguages = () => {
    const { fromLanguage, toLanguage, from, to } = this.state;
    if (to) this.setState({ to: from, from: to });

    this.setLanguages({
      from: toLanguage,
      to: fromLanguage,
    });
  };

  setLanguages = (langs: { from?: Language; to?: Language }) => {
    const newLangs = {
      fromLanguage: langs.from ?? this.state.fromLanguage,
      toLanguage: langs.to ?? this.state.toLanguage,
    };
    this.setState(newLangs);

    this.emit(
      TranslationWindowEvent.onLanguagesChanged,
      newLangs.fromLanguage,
      newLangs.toLanguage
    );
  };

  getLanguageByCode = (code: string) => {
    const { availableLanguages } = this.state;
    return availableLanguages.find((l) => l.code === code);
  };

  onLanguageChanged = (callback: (from: Language, to: Language) => void) => {
    this.subscribe(TranslationWindowEvent.onLanguagesChanged, callback);
  };
}
