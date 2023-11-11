import React from 'react';
import { component } from '@hubai/core';
import { Language } from '../../models/translatorWindowState';
const { Select, Option } = component;

export type LanguageSelectionProps = {
  id: string;
  label: string;
  currentLanguage: Language;
  availableLanguages: Language[];
  onSelect: (languageCode: string) => void;
};

const LanguageSelection = ({
  id,
  label,
  currentLanguage,
  availableLanguages,
  onSelect,
}: LanguageSelectionProps) => {
  return (
    <div className="select-container">
      <label>{label}</label>
      <Select
        id={`language-selection-${id}`}
        className="language-select"
        value={currentLanguage.code}
        onSelect={(e, option) => onSelect(option?.value as any)}
      >
        {availableLanguages.map((language) => (
          <Option key={`option-${id}-${language.code}`} value={language.code}>
            {language.name}
          </Option>
        ))}
      </Select>
    </div>
  );
};
export default LanguageSelection;
