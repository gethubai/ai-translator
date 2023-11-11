import {
  AppContext,
  Controller,
  IBrainClientManager,
  getCurrentUtcDate,
} from '@hubai/core';
import TranslatorWindowService from '../services/translatorWindowService';
import { Language } from '../models/translatorWindowState';
import { debounce } from '../utils/debounce';

export class TranslatorWindowController extends Controller {
  appContext: AppContext;
  service: TranslatorWindowService;
  brainClientManager: IBrainClientManager;

  constructor(appContext: AppContext, service: TranslatorWindowService) {
    super();
    this.appContext = appContext;
    this.service = service;
    this.brainClientManager = appContext.services.brainClientManager;
  }
  initView(): void {
    const availableLanguages: Language[] = [
      {
        code: 'auto-detect',
        name: 'Detect Language',
      },
      {
        code: 'en',
        name: 'English',
      },
      {
        code: 'pt',
        name: 'Portuguese',
      },
      {
        code: 'fr',
        name: 'French',
      },
      {
        code: 'es',
        name: 'Spanish',
      },
      {
        code: 'zh',
        name: 'Chinese',
      },
      {
        code: 'de',
        name: 'German',
      },
      {
        code: 'ru',
        name: 'Russian',
      },
    ];

    const availableBrains = this.brainClientManager
      .getAvailableBrains()
      .filter((b) => b.capabilities.includes('conversation'));

    this.service.setState({
      fromLanguage: availableLanguages[0],
      toLanguage: availableLanguages[1],
      availableLanguages,
      from: '',
      to: '',
      availableBrains,
      selectedBrain:
        this.brainClientManager.getDefaultForCapability('conversation')?.brain,
    });

    this.service.onLanguageChanged((from, to) => {
      this.onTranslate();
    });
  }

  public onSwapLanguages = () => {
    const { fromLanguage } = this.service.getState();
    if (fromLanguage.code === 'auto-detect') {
      return;
    }

    this.service.swapLanguages();
  };

  public onFromLanguageChanged = (languageCode: string) => {
    const language = this.service.getLanguageByCode(languageCode);
    this.service.setLanguages({ from: language });
  };

  public onToLanguageChanged = (languageCode: string) => {
    const language = this.service.getLanguageByCode(languageCode);
    this.service.setLanguages({ to: language });
  };

  public onFromInputTextChanged = (value: string) => {
    this.service.setState({ from: value });
    this.debouncedTranslate();
  };

  public onTranslate = async () => {
    const { from, fromLanguage, toLanguage, selectedBrain } =
      this.service.getState();

    if (!selectedBrain) {
      return;
    }

    if (!from || from.trim() === '') {
      this.service.setState({ to: '', error: undefined });
      return;
    }

    const brain = this.brainClientManager.getClient(selectedBrain.id);

    if (!brain) {
      return;
    }

    this.service.setState({ to: 'Translating...', error: undefined });

    const getPrompt = () => {
      if (fromLanguage.code === 'auto-detect') {
        return `You are a ${toLanguage.name} language translator.
        I will speak to you in any language and you will detect the language and translate it into ${toLanguage.name}.
        Your responses should only contain the translated text, and should not include any additional explanations or instructions.
        If you receive a message that is not translatable, you should respond with the original message
        `;
      }

      return `You are a ${fromLanguage.name} language translator.
      I will give you messages written in ${fromLanguage.name}, and you will translate them into ${toLanguage.name}.
      Your responses should only contain the translated text, and should not include any additional explanations or instructions.
      If you receive a message that is not written in ${fromLanguage.name} or is not translatable, you should respond with the original message`;
    };

    const result = await brain.conversation?.sendTextPrompt([
      {
        role: 'system',
        sentAt: getCurrentUtcDate(),
        value: getPrompt(),
      },
      {
        role: 'user',
        sentAt: getCurrentUtcDate(),
        value: from,
      },
    ]);

    this.service.setState({
      to: result?.result,
      error: result?.errors?.join('\n'),
    });
  };

  public debouncedTranslate = debounce(this.onTranslate, 1000);

  public onBrainChanged = (brainId: string) => {
    const { availableBrains } = this.service.getState();

    const brain = availableBrains.find((brain) => brain.id === brainId);
    if (brain) {
      this.service.setState({ selectedBrain: brain });
    }
  };
}
