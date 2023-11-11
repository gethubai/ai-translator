import React, { useMemo } from 'react';
import { component } from '@hubai/core';
import './styles.css';
import { TranslationWindowState } from '../models/translatorWindowState';
import { TranslatorWindowController } from '../controllers/translatorWindowController';
import LanguageSelection from './components/languageSelection';
const { Input, Select, Option, Icon } = component;

export type Props = TranslationWindowState & TranslatorWindowController & {};
export function TranslatorWindow({
  fromLanguage,
  toLanguage,
  from,
  to,
  availableLanguages,
  onSwapLanguages,
  onFromLanguageChanged,
  onToLanguageChanged,
  onFromInputTextChanged,
  selectedBrain,
  availableBrains,
  onBrainChanged,
  error,
}: Props) {
  const availableFromLanguages = useMemo(
    () => availableLanguages.filter((l) => l.code !== toLanguage.code),
    [availableLanguages, toLanguage]
  );

  const availableToLanguages = useMemo(
    () =>
      availableLanguages.filter(
        (l) => l.code !== fromLanguage.code && l.code !== 'auto-detect'
      ),
    [availableLanguages, fromLanguage]
  );

  return (
    <div className="ai-translator__container">
      <div>
        <label htmlFor="brain-selector">Select the brain: </label>
        <Select
          id="brain-selector"
          value={selectedBrain?.id ?? ''}
          onSelect={(e, option) => onBrainChanged(option!.value!)}
          placeholder="Select the Brain"
        >
          {availableBrains.map((brain) => (
            <Option
              key={`option-${brain.id}`}
              value={brain.id}
              name={brain.displayName}
              description={brain.description}
            >
              {brain.displayName}
            </Option>
          ))}
        </Select>
      </div>
      <div className="ai-translator__inputs-container">
        <div className="language-selection-container">
          <LanguageSelection
            id="from"
            label="From"
            currentLanguage={fromLanguage}
            availableLanguages={availableFromLanguages}
            onSelect={onFromLanguageChanged}
          />

          <Icon
            type="arrow-swap"
            className="swap-icon"
            onClick={onSwapLanguages}
          />

          <LanguageSelection
            id="to"
            label="To"
            currentLanguage={toLanguage}
            availableLanguages={availableToLanguages}
            onSelect={onToLanguageChanged}
          />
        </div>
        <div className="input-container">
          <Input.TextArea
            placeholder="Type the text to translate or improve"
            className="from-input input-field"
            value={from}
            onChange={(e) => onFromInputTextChanged(e.target.value)}
          />
          <Input.TextArea
            placeholder="Translation"
            readOnly
            className={`input-field ${error ? 'input-error' : ''}`}
            value={to}
          />
        </div>
      </div>
    </div>
  );
}
