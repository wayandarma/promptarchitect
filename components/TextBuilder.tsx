import React from 'react';
import { Type, Sparkles, User, FileText } from 'lucide-react';
import { TextPromptState } from '../types';
import { PURPOSES, WRITING_STYLES, TONES, LENGTHS } from '../constants';
import { Section, SelectControl, TextControl, TextAreaControl } from './Controls';

interface TextBuilderProps {
  state: TextPromptState;
  onChange: (key: keyof TextPromptState, value: string) => void;
}

export const TextBuilder: React.FC<TextBuilderProps> = ({ state, onChange }) => {
  const handleChange = (key: keyof TextPromptState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    onChange(key, e.target.value);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <Section title="Core Task" icon={<Sparkles size={18} />}>
        <SelectControl 
          label="Purpose" 
          options={PURPOSES} 
          value={state.purpose}
          onChange={handleChange('purpose')}
          tooltip="What is the main goal of this text?"
        />
        <SelectControl 
          label="Length" 
          options={LENGTHS} 
          value={state.length}
          onChange={handleChange('length')}
          tooltip="Desired word count or format constraint."
        />
      </Section>

      <Section title="Style & Tone" icon={<Type size={18} />}>
        <SelectControl 
          label="Writing Style" 
          options={WRITING_STYLES} 
          value={state.writingStyle}
          onChange={handleChange('writingStyle')}
          tooltip="The voice, structure, and manner of expression."
        />
        <SelectControl 
          label="Tone" 
          options={TONES} 
          value={state.tone}
          onChange={handleChange('tone')}
          tooltip="The emotional attitude conveyed in the text."
        />
      </Section>

      <Section title="Context & Audience" icon={<User size={18} />}>
        <div className="col-span-1 md:col-span-2">
          <TextControl 
            label="Target Audience" 
            placeholder="e.g., 5-year-old kids, Senior Developers, Marketing Executives"
            value={state.audience}
            onChange={handleChange('audience')}
            tooltip="Who will be reading this?"
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <TextAreaControl
            label="Main Context / Topic"
            placeholder="Describe the topic, background information, or specific scenario..."
            value={state.context}
            onChange={handleChange('context')}
            rows={4}
            tooltip="Background information or scenario details."
          />
        </div>
      </Section>

      <Section title="Constraints & Details" icon={<FileText size={18} />}>
        <div className="col-span-1 md:col-span-2">
          <TextAreaControl
            label="Additional Instructions"
            placeholder="e.g., No jargon, use bullet points, format as Markdown..."
            value={state.additionalInstructions}
            onChange={handleChange('additionalInstructions')}
            rows={3}
            tooltip="Specific constraints, formatting rules, or exclusions."
          />
        </div>
      </Section>
    </div>
  );
};