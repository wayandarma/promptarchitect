import React, { useState, useEffect } from 'react';
import { FolderOpen, Save, Trash2, Download } from 'lucide-react';
import { PromptType, SavedTemplate, ImagePromptState, TextPromptState } from '../types';
import { Section } from './Controls';

interface TemplateManagerProps {
  activeTab: PromptType;
  currentState: ImagePromptState | TextPromptState;
  onLoad: (state: any) => void;
}

const STORAGE_KEY = 'prompt_architect_templates';

export const TemplateManager: React.FC<TemplateManagerProps> = ({ activeTab, currentState, onLoad }) => {
  const [templates, setTemplates] = useState<SavedTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [newTemplateName, setNewTemplateName] = useState('');

  // Load templates on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTemplates(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load templates", e);
    }
  }, []);

  // Filter templates by current active tab type
  const currentTemplates = templates.filter(t => t.type === activeTab);

  const handleSave = () => {
    if (!newTemplateName.trim()) return;

    const newTemplate: SavedTemplate = {
      id: crypto.randomUUID(),
      name: newTemplateName.trim(),
      type: activeTab,
      data: { ...currentState },
      timestamp: new Date().toISOString()
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates));
    setNewTemplateName('');
    setSelectedTemplateId(newTemplate.id);
  };

  const handleLoad = () => {
    const template = templates.find(t => t.id === selectedTemplateId);
    if (template) {
      onLoad(template.data);
    }
  };

  const handleDelete = () => {
    if (!selectedTemplateId) return;
    const updatedTemplates = templates.filter(t => t.id !== selectedTemplateId);
    setTemplates(updatedTemplates);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates));
    setSelectedTemplateId('');
  };

  return (
    <div className="mb-6 animate-fadeIn">
      <Section title="Template Library" icon={<FolderOpen size={18} />}>
        <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Load Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-brand-300">
                Load Template
              </label>
              <span className="text-xs text-slate-500">{currentTemplates.length} saved</span>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full appearance-none bg-dark-900 border border-dark-600 text-slate-200 text-sm rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 block p-2.5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={currentTemplates.length === 0}
                >
                  <option value="">
                    {currentTemplates.length === 0 ? "No templates saved" : "Select a template..."}
                  </option>
                  {currentTemplates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              
              <button
                onClick={handleLoad}
                disabled={!selectedTemplateId}
                className="px-3 py-2 bg-brand-700 hover:bg-brand-600 disabled:bg-dark-700 disabled:text-slate-500 text-white rounded-lg transition-colors flex items-center justify-center"
                title="Load Template"
              >
                <Download size={18} />
              </button>

              <button
                onClick={handleDelete}
                disabled={!selectedTemplateId}
                className="px-3 py-2 bg-dark-700 hover:bg-red-900/50 hover:text-red-400 disabled:opacity-50 text-slate-400 rounded-lg transition-colors flex items-center justify-center"
                title="Delete Template"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* Save Section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-brand-300">
              Save Current State
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                placeholder="e.g., Cyberpunk Hero Portrait"
                className="bg-dark-900 border border-dark-600 text-slate-200 text-sm rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 block w-full p-2.5 placeholder-slate-600 transition-colors"
              />
              <button
                onClick={handleSave}
                disabled={!newTemplateName.trim()}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:bg-dark-700 disabled:text-slate-500 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2 min-w-[90px] justify-center"
              >
                <Save size={16} />
                Save
              </button>
            </div>
          </div>

        </div>
      </Section>
    </div>
  );
};