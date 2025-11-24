import React from 'react';

export enum PromptType {
  IMAGE = 'IMAGE',
  TEXT = 'TEXT'
}

// --- Image Generation Types ---

export interface ImagePromptState {
  mainSubject: string;
  artStyle: string;
  colorPalette: string;
  lighting: string;
  cameraAngle: string;
  shotType: string;
  depthOfField: string;
  resolution: string;
  aspectRatio: string;
  mood: string;
  environment: string;
  timeOfDay: string;
}

// --- Text Generation Types ---

export interface TextPromptState {
  purpose: string;
  writingStyle: string;
  tone: string;
  length: string;
  audience: string;
  context: string;
  additionalInstructions: string;
}

// --- Template Types ---

export interface SavedTemplate {
  id: string;
  name: string;
  type: PromptType;
  data: ImagePromptState | TextPromptState;
  timestamp: string;
}

// --- Shared Component Types ---

export interface SelectOption {
  label: string;
  value: string;
}

export interface SectionGroupProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
}