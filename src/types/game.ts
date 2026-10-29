/**
 * Types pour le système de coffre-fort et testament de jeu de rôle
 */

export interface ClueItem {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  hintLevel: 'subtle' | 'medium' | 'direct';
  discovered: boolean;
  type: 'note' | 'photo' | 'letter' | 'riddle';
}

export interface TestamentContent {
  title: string;
  deceasedName: string;
  notaryName: string;
  city: string;
  date: string;
  introduction: string;
  bequests: Array<{
    beneficiary: string;
    item: string;
    condition?: string;
  }>;
  secretRevelation: string;
  warningNote: string;
  signatory: string;
}

export interface ScenarioPreset {
  id: string;
  name: string;
  subtitle?: string;
  safeRef?: string;
  safeLabel?: string;
  theme: 'victorian' | 'modern' | 'noir' | 'scifi';
  description: string;
  code: string;
  testament: TestamentContent;
  clues: ClueItem[];
}

export type MastermindColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

export interface MastermindColorDef {
  id: MastermindColor;
  label: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  symbol: string;
}

export interface MastermindAttempt {
  id: string;
  guess: MastermindColor[];
  exactMatch: number; // Bon emplacement et bonne couleur
  colorMatch: number; // Mauvais emplacement mais bonne couleur
  timestamp: number;
}

export interface MastermindConfig {
  enabled: boolean;
  secretCode: MastermindColor[];
  isSolved: boolean;
  attempts: MastermindAttempt[];
}

export interface SafeState {
  code: string;
  enteredCode: string;
  isOpen: boolean;
  isUnlocked: boolean;
  statusMessage: string;
  attemptsLeft: number;
  maxAttempts: number;
  isLockedOut: boolean;
  lockoutTimer: number;
  history: string[];
}

