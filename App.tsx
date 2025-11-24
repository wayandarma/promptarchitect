import React, { useState, useMemo } from 'react';
import { Image, Type, Zap } from 'lucide-react';
import { PromptType, ImagePromptState, TextPromptState } from './types';
import { ImageBuilder } from './components/ImageBuilder';
import { TextBuilder } from './components/TextBuilder';
import { PreviewPanel } from './components/PreviewPanel';
import { TemplateManager } from './components/TemplateManager';

// --- Default States ---

const initialImageState: ImagePromptState = {
  mainSubject: '',
  artStyle: '',
  colorPalette: '',
  lighting: '',
  cameraAngle: '',
  shotType: '',
  depthOfField: '',
  resolution: '',
  aspectRatio: '16:9 aspect ratio',
  mood: '',
  environment: '',
  timeOfDay: '',
};

const initialTextState: TextPromptState = {
  purpose: '',
  writingStyle: '',
  tone: '',
  length: '',
  audience: '',
  context: '',
  additionalInstructions: '',
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PromptType>(PromptType.IMAGE);
  const [imageState, setImageState] = useState<ImagePromptState>(initialImageState);
  const [textState, setTextState] = useState<TextPromptState>(initialTextState);

  // --- Logic Helpers ---

  const handleImageChange = (key: keyof ImagePromptState, value: string) => {
    setImageState(prev => ({ ...prev, [key]: value }));
  };

  const handleTextChange = (key: keyof TextPromptState, value: string) => {
    setTextState(prev => ({ ...prev, [key]: value }));
  };

  const handleTemplateLoad = (loadedState: any) => {
    if (activeTab === PromptType.IMAGE) {
      setImageState(loadedState as ImagePromptState);
    } else {
      setTextState(loadedState as TextPromptState);
    }
  };

  const resetState = () => {
    if (activeTab === PromptType.IMAGE) {
      setImageState(initialImageState);
    } else {
      setTextState(initialTextState);
    }
  };

  // --- Prompt Assembly Logic ---

  const assembledImagePrompt = useMemo(() => {
    const parts = [
      imageState.mainSubject,
      imageState.environment,
      imageState.timeOfDay,
      imageState.artStyle,
      imageState.mood,
      imageState.lighting,
      imageState.colorPalette,
      imageState.cameraAngle,
      imageState.shotType,
      imageState.depthOfField,
      imageState.resolution,
      imageState.aspectRatio,
    ];
    // Filter empty strings and join with commas
    return parts.filter(p => p && p.trim().length > 0).join(', ');
  }, [imageState]);

  const assembledTextPrompt = useMemo(() => {
    let prompt = "";
    if (textState.purpose) prompt += `Task: ${textState.purpose}.\n`;
    if (textState.context) prompt += `Context: ${textState.context}\n`;
    if (textState.audience) prompt += `Target Audience: ${textState.audience}.\n`;
    
    prompt += `\nOutput Requirements:\n`;
    if (textState.writingStyle) prompt += `- Style: ${textState.writingStyle}\n`;
    if (textState.tone) prompt += `- Tone: ${textState.tone}\n`;
    if (textState.length) prompt += `- Length: ${textState.length}\n`;
    
    if (textState.additionalInstructions) {
      prompt += `\nAdditional Instructions:\n${textState.additionalInstructions}`;
    }
    return prompt.trim();
  }, [textState]);

  // --- JSON Output Construction ---

  const jsonOutput = useMemo(() => {
    const timestamp = new Date().toISOString();
    if (activeTab === PromptType.IMAGE) {
      return {
        _meta: { generator: "PromptArchitect", type: "image", timestamp },
        prompt: assembledImagePrompt,
        parameters: { ...imageState }
      };
    } else {
      return {
        _meta: { generator: "PromptArchitect", type: "text", timestamp },
        prompt: assembledTextPrompt,
        parameters: { ...textState }
      };
    }
  }, [activeTab, imageState, textState, assembledImagePrompt, assembledTextPrompt]);

  // --- Render ---

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col lg:flex-row font-sans">
      
      {/* Main Content Area (Scrollable) */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="px-6 py-5 border-b border-dark-700 bg-dark-900 z-10 sticky top-0 bg-opacity-95 backdrop-blur">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-brand-400 to-brand-600 p-2 rounded-lg shadow-lg shadow-brand-500/20">
                <Zap className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">PromptArchitect</h1>
                <p className="text-xs text-slate-400 font-mono">Build better prompts. Faster.</p>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1 bg-dark-800 rounded-lg border border-dark-700">
              <button
                onClick={() => setActiveTab(PromptType.IMAGE)}
                className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === PromptType.IMAGE
                    ? 'bg-dark-700 text-brand-300 shadow-sm ring-1 ring-dark-600'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Image size={16} />
                Image Generation
              </button>
              <button
                onClick={() => setActiveTab(PromptType.TEXT)}
                className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === PromptType.TEXT
                    ? 'bg-dark-700 text-brand-300 shadow-sm ring-1 ring-dark-600'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Type size={16} />
                Text (Gemini)
              </button>
            </div>
          </div>
        </header>

        {/* Builder Forms */}
        <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
          <div className="mb-8">
            <h2 className="text-2xl font-light text-white mb-2">
              {activeTab === PromptType.IMAGE ? 'Design your visual masterpiece' : 'Contextualize your request'}
            </h2>
            <p className="text-slate-400">
              {activeTab === PromptType.IMAGE 
                ? 'Select the parameters below to construct a highly detailed image generation prompt.'
                : 'Define the persona, task, and constraints for your Large Language Model.'}
            </p>
          </div>

          {/* Template Manager Section */}
          <TemplateManager 
            activeTab={activeTab}
            currentState={activeTab === PromptType.IMAGE ? imageState : textState}
            onLoad={handleTemplateLoad}
          />

          {activeTab === PromptType.IMAGE ? (
            <ImageBuilder state={imageState} onChange={handleImageChange} />
          ) : (
            <TextBuilder state={textState} onChange={handleTextChange} />
          )}
          
          <div className="h-12"></div> {/* Spacer */}
        </main>
      </div>

      {/* Right Sidebar: Preview & Output */}
      <div className="w-full lg:w-[400px] xl:w-[450px] flex-shrink-0 z-20">
        <PreviewPanel 
          promptText={activeTab === PromptType.IMAGE ? assembledImagePrompt : assembledTextPrompt}
          jsonOutput={jsonOutput}
          onReset={resetState}
        />
      </div>

    </div>
  );
};

export default App;