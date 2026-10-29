import { MastermindColor, MastermindColorDef } from '../types/game';

export const MASTERMIND_COLORS: MastermindColorDef[] = [
  {
    id: 'red',
    label: 'Rouge',
    bgClass: 'bg-red-500',
    borderClass: 'border-red-400 shadow-[0_0_12px_rgba(239,68,68,0.6)]',
    textClass: 'text-red-400',
    symbol: '●'
  },
  {
    id: 'blue',
    label: 'Bleu',
    bgClass: 'bg-blue-500',
    borderClass: 'border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.6)]',
    textClass: 'text-blue-400',
    symbol: '■'
  },
  {
    id: 'green',
    label: 'Vert',
    bgClass: 'bg-emerald-500',
    borderClass: 'border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]',
    textClass: 'text-emerald-400',
    symbol: '▲'
  },
  {
    id: 'yellow',
    label: 'Jaune',
    bgClass: 'bg-yellow-400',
    borderClass: 'border-yellow-300 shadow-[0_0_12px_rgba(250,204,21,0.6)]',
    textClass: 'text-yellow-400',
    symbol: '★'
  },
  {
    id: 'purple',
    label: 'Violet',
    bgClass: 'bg-purple-500',
    borderClass: 'border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.6)]',
    textClass: 'text-purple-400',
    symbol: '◆'
  },
  {
    id: 'orange',
    label: 'Orange',
    bgClass: 'bg-orange-500',
    borderClass: 'border-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.6)]',
    textClass: 'text-orange-400',
    symbol: '⬢'
  }
];

export const ALL_COLOR_IDS: MastermindColor[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

/**
 * Génère un code secret aléatoire pour le Mastermind (5 zones par défaut)
 */
export function generateRandomMastermindCode(length = 5): MastermindColor[] {
  const result: MastermindColor[] = [];
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * ALL_COLOR_IDS.length);
    result.push(ALL_COLOR_IDS[randomIndex]);
  }
  return result;
}

/**
 * Évalue une proposition selon les règles officielles du Mastermind
 * exactMatch : bonne couleur à la bonne position (pion noir)
 * colorMatch : bonne couleur présente mais à une autre position (pion blanc)
 */
export function evaluateMastermindGuess(
  guess: MastermindColor[],
  secret: MastermindColor[]
): { exactMatch: number; colorMatch: number } {
  let exactMatch = 0;
  let colorMatch = 0;

  const secretCopy: (MastermindColor | null)[] = [...secret];
  const guessCopy: (MastermindColor | null)[] = [...guess];

  // 1ère passe : Comptage des correspondances exactes
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === secret[i]) {
      exactMatch++;
      secretCopy[i] = null;
      guessCopy[i] = null;
    }
  }

  // 2ème passe : Comptage des correspondances de couleur sur mauvaise position
  for (let i = 0; i < guessCopy.length; i++) {
    if (guessCopy[i] !== null) {
      const matchIndex = secretCopy.findIndex((c) => c !== null && c === guessCopy[i]);
      if (matchIndex !== -1) {
        colorMatch++;
        secretCopy[matchIndex] = null;
      }
    }
  }

  return { exactMatch, colorMatch };
}
