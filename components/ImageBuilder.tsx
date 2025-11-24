import React from 'react';
import { Palette, Camera, Settings2, Image as ImageIcon } from 'lucide-react';
import { ImagePromptState } from '../types';
import { 
  ART_STYLES, 
  COLOR_PALETTES, 
  LIGHTING_OPTIONS, 
  CAMERA_ANGLES, 
  SHOT_TYPES, 
  RESOLUTIONS, 
  ASPECT_RATIOS, 
  ENVIRONMENTS, 
  MOODS 
} from '../constants';
import { Section, SelectControl, TextControl } from './Controls';

interface ImageBuilderProps {
  state: ImagePromptState;
  onChange: (key: keyof ImagePromptState, value: string) => void;
}

export const ImageBuilder: React.FC<ImageBuilderProps> = ({ state, onChange }) => {
  const handleChange = (key: keyof ImagePromptState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange(key, e.target.value);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <Section title="Subject & Environment" icon={<ImageIcon size={18} />}>
        <div className="col-span-1 md:col-span-2">
          <TextControl 
            label="Main Subject" 
            placeholder="e.g., A futuristic cyberpunk warrior riding a dragon"
            value={state.mainSubject}
            onChange={handleChange('mainSubject')}
            tooltip="The core focus of your image. Be descriptive."
            autoFocus
          />
        </div>
        <SelectControl 
          label="Environment" 
          options={ENVIRONMENTS} 
          value={state.environment}
          onChange={handleChange('environment')}
          tooltip="The physical setting or background location."
        />
        <SelectControl 
          label="Time of Day" 
          options={[{label: 'Unspecified', value: ''}, {label: 'Day', value: 'day'}, {label: 'Night', value: 'night'}, {label: 'Sunset', value: 'sunset'}]} 
          value={state.timeOfDay}
          onChange={handleChange('timeOfDay')}
          tooltip="Lighting conditions based on sun position or time."
        />
      </Section>

      <Section title="Visual Style" icon={<Palette size={18} />}>
        <SelectControl 
          label="Art Style" 
          options={ART_STYLES} 
          value={state.artStyle}
          onChange={handleChange('artStyle')}
          tooltip="The overall artistic medium or genre."
        />
        <SelectControl 
          label="Color Palette" 
          options={COLOR_PALETTES} 
          value={state.colorPalette}
          onChange={handleChange('colorPalette')}
          tooltip="Dominant color schemes and tonal balance."
        />
        <SelectControl 
          label="Lighting" 
          options={LIGHTING_OPTIONS} 
          value={state.lighting}
          onChange={handleChange('lighting')}
          tooltip="Type and direction of light sources."
        />
        <SelectControl 
          label="Mood / Atmosphere" 
          options={MOODS} 
          value={state.mood}
          onChange={handleChange('mood')}
          tooltip="Emotional atmosphere or feeling of the image."
        />
      </Section>

      <Section title="Composition & Camera" icon={<Camera size={18} />}>
        <SelectControl 
          label="Camera Angle" 
          options={CAMERA_ANGLES} 
          value={state.cameraAngle}
          onChange={handleChange('cameraAngle')}
          tooltip="Perspective relative to the subject."
        />
        <SelectControl 
          label="Shot Type" 
          options={SHOT_TYPES} 
          value={state.shotType}
          onChange={handleChange('shotType')}
          tooltip="Framing distance and subject prominence."
        />
        <SelectControl 
          label="Depth of Field" 
          options={[{label: 'Default', value: ''}, {label: 'Shallow (Bokeh)', value: 'shallow depth of field, bokeh'}, {label: 'Deep Focus', value: 'deep focus'}]}
          value={state.depthOfField}
          onChange={handleChange('depthOfField')}
          tooltip="Focus range and background blur intensity."
        />
      </Section>

      <Section title="Technical Details" icon={<Settings2 size={18} />}>
        <SelectControl 
          label="Resolution" 
          options={RESOLUTIONS} 
          value={state.resolution}
          onChange={handleChange('resolution')}
          tooltip="Image clarity, pixel density, or render quality."
        />
        <SelectControl 
          label="Aspect Ratio" 
          options={ASPECT_RATIOS} 
          value={state.aspectRatio}
          onChange={handleChange('aspectRatio')}
          tooltip="The width-to-height dimensions of the canvas."
        />
      </Section>
    </div>
  );
};