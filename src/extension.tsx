import React from 'react';
import { AppContext, IActivityBarItem, IExtension, react } from '@hubai/core';
import { TranslatorWindow } from './views/translatorWindow';
import TranslatorWindowService from './services/translatorWindowService';
import { TranslatorWindowController } from './controllers/translatorWindowController';

const { connect } = react;

export class AITranslatorExtension implements IExtension {
  id = 'ai-translator';
  name = 'AiTranslator';

  appContext!: AppContext;

  activate(extensionCtx: AppContext): void {
    this.appContext = extensionCtx;

    const activityBar: IActivityBarItem = {
      id: 'aiTranslator.activityBar',
      name: 'AiTranslator',
      title: 'AI Translator',
      icon: 'word-wrap',
    };

    extensionCtx.services.activityBar.add(activityBar);

    extensionCtx.services.activityBar.onClick((item) => {
      if (item === activityBar.id) {
        this.selectOrOpenImageCreatorWindow();
      }
    });
  }

  dispose(extensionCtx: AppContext): void {
    extensionCtx.services.activityBar.remove('aiTranslator.activityBar');
  }

  selectOrOpenImageCreatorWindow = () => {
    let renderPane;
    const id = 'aiTranslator.window';

    if (!this.appContext.services.editor.isOpened(id)) {
      const service = new TranslatorWindowService();
      const controller = new TranslatorWindowController(
        this.appContext,
        service
      );
      controller.initView();
      const Window = connect(service, TranslatorWindow, controller);
      renderPane = () => <Window key={id} />;
    }

    this.appContext.services.editor.open({
      id,
      name: 'AI Translator',
      icon: 'word-wrap',
      renderPane: renderPane as any,
    });
  };
}

const aiTranslator = new AITranslatorExtension();
export default aiTranslator;
