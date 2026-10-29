import React from 'react';
import { Scroll, FileText, Lock, Sparkles, RotateCcw } from 'lucide-react';
import { ElectronicKeypad } from './ElectronicKeypad';
import { soundManager } from '../utils/audio';

interface SafeDoorProps {
  enteredCode: string;
  expectedLength: number;
  statusMessage: string;
  statusType: 'idle' | 'success' | 'error' | 'locked';
  attemptsLeft: number;
  maxAttempts: number;
  isUnlocked: boolean;
  isOpen: boolean;
  isLockedOut: boolean;
  lockoutTimer: number;
  isMastermindLocked?: boolean;
  onOpenMastermind?: () => void;
  onKeyPress: (char: string) => void;
  onClear: () => void;
  onSubmit: () => void;
  onTurnHandle: () => void;
  onOpenTestament: () => void;
  onCloseSafe: () => void;
  deceasedName: string;
  safeLabel?: string;
  safeRef?: string;
}

export const SafeDoor: React.FC<SafeDoorProps> = ({
  enteredCode,
  expectedLength,
  statusMessage,
  statusType,
  attemptsLeft,
  maxAttempts,
  isUnlocked,
  isOpen,
  isLockedOut,
  lockoutTimer,
  isMastermindLocked = false,
  onOpenMastermind,
  onKeyPress,
  onClear,
  onSubmit,
  onTurnHandle,
  onOpenTestament,
  onCloseSafe,
  deceasedName,
  safeLabel = 'COFFRE MUNICIPAL BLINDÉ · CABINET DU MAIRE',
  safeRef = 'REF : MAIRIE-PLOEMEL-2024'
}) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto my-4 select-none perspective-1000">
      {/* Caisson extérieur lourd en acier trempé */}
      <div className="relative rounded-3xl p-4 sm:p-8 bg-gradient-to-b from-stone-900 via-neutral-900 to-stone-950 border-4 border-stone-700 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Plaque nominative du fabricant de coffre */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-800 text-stone-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-600/30 border border-amber-500/50 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-stone-300">
              {safeLabel}
            </span>
          </div>

          <div className="text-right">
            <span className="font-mono text-[10px] text-stone-500 block">DÉPÔT CONFIDENTIEL</span>
            <span className="font-mono text-xs text-amber-400/80 font-medium">{safeRef}</span>
          </div>
        </div>

        {/* Intérieur et Porte du Coffre */}
        <div className="relative min-h-[460px] rounded-2xl bg-stone-950 border-2 border-stone-800/80 overflow-hidden shadow-inner flex flex-col justify-center">
          {/* VUE INTÉRIEURE (visible quand le coffre est OUVERT) */}
          {isOpen ? (
            <div className="relative p-6 sm:p-10 flex flex-col items-center justify-center min-h-[460px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/20 via-neutral-950 to-stone-950">
              {/* Éclairage intérieur dramatique type musée / bijouterie */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent shadow-[0_0_20px_#f59e0b]" />

              <div className="text-center max-w-lg mb-8 animate-fade-in">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400 uppercase tracking-widest px-3 py-1 bg-emerald-950/50 rounded-full border border-emerald-800/60 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Compartiment Déverrouillé
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100 tracking-wide">
                  Le Testament est révélé
                </h3>
                <p className="text-sm text-stone-300 mt-2 font-sans">
                  La lourde porte blindée a pivoté avec un grondement sourd. Au centre de l'écrin de velours repose le document manuscrit sous scellé.
                </p>
              </div>

              {/* L'Écrin et le Testament cliquable */}
              <div className="relative group cursor-pointer" onClick={onOpenTestament}>
                {/* Socle capitonné */}
                <div className="w-72 sm:w-88 h-44 rounded-2xl bg-gradient-to-b from-stone-900 to-black border-2 border-amber-900/60 p-4 shadow-[0_15px_35px_rgba(0,0,0,0.8)] flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:border-amber-500 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.25)]">
                  {/* Texture velours */}
                  <div className="absolute inset-0 bg-red-950/25 mix-blend-overlay" />

                  {/* Le document scellé enroulé / plié */}
                  <div className="relative flex flex-col items-center justify-center text-center p-4">
                    {/* Sceau de cire rouge sang */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-700 via-rose-800 to-red-950 border-2 border-red-500/80 shadow-[0_0_15px_rgba(225,29,72,0.5)] flex items-center justify-center mb-3 transform group-hover:scale-110 transition-transform">
                      <Scroll className="w-7 h-7 text-amber-200" />
                    </div>

                    <span className="font-serif font-bold text-lg text-amber-100 group-hover:text-amber-300 transition-colors">
                      TESTAMENT OFFICIEL
                    </span>
                    <span className="text-xs text-stone-400 font-sans mt-0.5">
                      {deceasedName}
                    </span>

                    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                      <FileText className="w-3.5 h-3.5" />
                      Cliquer pour ouvrir et lire
                    </div>
                  </div>
                </div>
              </div>

              {/* Bouton pour refermer le coffre */}
              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={onOpenTestament}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-950/40 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <FileText className="w-4 h-4" />
                  Lire le Testament
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playMechanicalUnlock();
                    onCloseSafe();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs border border-stone-700 flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Refermer la porte blindée
                </button>
              </div>
            </div>
          ) : (
            /* VUE EXTÉRIEURE (Porte fermée avec clavier et volant de manœuvre) */
            <div className="p-4 sm:p-8 flex flex-col md:flex-row items-center justify-around gap-8">
              {/* Côté Gauche : Le Volant de manœuvre mécanique / Pênes */}
              <div className="flex flex-col items-center justify-center order-2 md:order-1">
                <div className="text-center mb-4">
                  <span className="font-mono text-xs uppercase tracking-wider text-stone-400 font-semibold block">
                    MÉCANISME DES PÊNES
                  </span>
                  <span className="text-[11px] text-stone-500">
                    {isUnlocked ? 'Prêt à être actionné' : 'Verrouillé électroniquement'}
                  </span>
                </div>

                {/* Volant de coffre à 3 branches */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={onTurnHandle}
                    disabled={!isUnlocked}
                    aria-label={isUnlocked ? 'Actionner la poignée pour ouvrir le coffre' : 'Poignée verrouillée'}
                    className={`relative w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 flex items-center justify-center transition-all duration-700 ${
                      isUnlocked
                        ? 'border-emerald-500/70 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105 cursor-pointer animate-spin-slow'
                        : 'border-stone-700 bg-stone-900/90 opacity-80 cursor-not-allowed shadow-[0_10px_25px_rgba(0,0,0,0.8)]'
                    }`}
                  >
                    {/* Anneau extérieur en acier */}
                    <div className="absolute inset-2 rounded-full border-2 border-stone-600 bg-gradient-to-br from-stone-800 via-neutral-900 to-stone-950" />

                    {/* Branches du volant */}
                    <div className="absolute w-full h-4 bg-gradient-to-r from-stone-600 via-stone-400 to-stone-600 rounded-sm shadow-md" />
                    <div className="absolute h-full w-4 bg-gradient-to-b from-stone-600 via-stone-400 to-stone-600 rounded-sm shadow-md" />
                    <div className="absolute w-full h-4 bg-gradient-to-r from-stone-600 via-stone-400 to-stone-600 rounded-sm shadow-md rotate-45" />

                    {/* Moyeu central chromé */}
                    <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-stone-400 via-stone-200 to-stone-500 border-2 border-stone-300 shadow-xl flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-700 to-stone-900 border border-stone-500 flex items-center justify-center">
                        {isUnlocked ? (
                          <Sparkles className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Lock className="w-5 h-5 text-stone-400" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Pênes d'acier latéraux visibles sur le bord */}
                  <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3" aria-hidden="true">
                    <div
                      className={`w-6 h-4 rounded-l bg-gradient-to-r from-stone-400 to-stone-600 border border-stone-500 transition-all duration-500 ${
                        isUnlocked ? 'translate-x-3' : 'translate-x-0'
                      }`}
                    />
                    <div
                      className={`w-6 h-4 rounded-l bg-gradient-to-r from-stone-400 to-stone-600 border border-stone-500 transition-all duration-500 ${
                        isUnlocked ? 'translate-x-3' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </div>

                <div className="mt-4 text-center">
                  {isUnlocked ? (
                    <span className="inline-block text-xs font-mono font-bold text-emerald-400 animate-pulse">
                      Cliquez sur le volant pour ouvrir !
                    </span>
                  ) : (
                    <span className="inline-block text-[11px] font-mono text-stone-500">
                      Entrez le code secret sur le clavier à droite
                    </span>
                  )}
                </div>
              </div>

              {/* Côté Droit : Le Clavier Électronique */}
              <div className="w-full md:w-auto order-1 md:order-2 flex justify-center">
                <ElectronicKeypad
                  enteredCode={enteredCode}
                  expectedLength={expectedLength}
                  statusMessage={statusMessage}
                  statusType={statusType}
                  attemptsLeft={attemptsLeft}
                  maxAttempts={maxAttempts}
                  isUnlocked={isUnlocked}
                  isOpen={isOpen}
                  isLockedOut={isLockedOut}
                  lockoutTimer={lockoutTimer}
                  isMastermindLocked={isMastermindLocked}
                  onOpenMastermind={onOpenMastermind}
                  onKeyPress={onKeyPress}
                  onClear={onClear}
                  onSubmit={onSubmit}
                  onTurnHandle={onTurnHandle}
                />
              </div>
            </div>
          )}
        </div>

        {/* Pieds métalliques et socle lourd */}
        <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center justify-between text-stone-500 text-xs font-mono">
          <span>ALIMENTATION SECOURS : 100% (PILES LITHIUM)</span>
          <span>SYSTÈME ANTI-EFFRACTION ACTIF</span>
        </div>
      </div>
    </div>
  );
};
