import React from 'react';
import { SelectOption } from '../types';
import { Info } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface LabelProps {
  label: string;
  tooltip?: string;
}

export const ControlLabel: React.FC<LabelProps> = ({ label, tooltip }) => (
  <div className="flex items-center gap-2 mb-1.5">
    <label className="text-xs font-semibold uppercase tracking-wider text-brand-300">
      {label}
    </label>
    {tooltip && (
      <Tooltip text={tooltip}>
        <Info size={12} className="text-slate-500 hover:text-brand-400 cursor-help" />
      </Tooltip>
    )}
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label: string;
  tooltip?: string;
}

export const SelectControl: React.FC<SelectProps> = ({ options, label, tooltip, className, ...props }) => {
  return (
    <div className="w-full">
      <ControlLabel label={label} tooltip={tooltip} />
      <div className="relative">
        <select
          className={`w-full appearance-none bg-dark-800 border border-dark-700 text-slate-200 text-sm rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 block p-2.5 transition-colors ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

interface TextControlProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  tooltip?: string;
}

export const TextControl: React.FC<TextControlProps> = ({ label, tooltip, className, ...props }) => {
  return (
    <div className="w-full">
      <ControlLabel label={label} tooltip={tooltip} />
      <input
        type="text"
        className={`bg-dark-800 border border-dark-700 text-slate-200 text-sm rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 block w-full p-2.5 placeholder-slate-500 transition-colors ${className}`}
        {...props}
      />
    </div>
  );
};

interface TextAreaControlProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  tooltip?: string;
}

export const TextAreaControl: React.FC<TextAreaControlProps> = ({ label, tooltip, className, ...props }) => {
  return (
    <div className="w-full">
      <ControlLabel label={label} tooltip={tooltip} />
      <textarea
        className={`bg-dark-800 border border-dark-700 text-slate-200 text-sm rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 block w-full p-2.5 placeholder-slate-500 transition-colors min-h-[100px] resize-y ${className}`}
        {...props}
      />
    </div>
  );
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, children, icon, rightElement }) => (
  <div className="bg-dark-800/50 rounded-xl border border-dark-700 overflow-hidden mb-6 backdrop-blur-sm">
    <div className="bg-dark-800/80 px-4 py-3 border-b border-dark-700 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-brand-400">{icon}</span>
        <h3 className="font-medium text-slate-200 text-sm tracking-wide">{title}</h3>
      </div>
      {rightElement && <div>{rightElement}</div>}
    </div>
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
);