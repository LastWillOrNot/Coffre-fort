import React from 'react';
import { Delete, Check, Lock, Unlock, AlertTriangle } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ElectronicKeypadProps {
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
}

export const ElectronicKeypad: React.FC<ElectronicKeypadProps> = ({
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
  onTurnHandle
}) => {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  const handleDigitClick = (digit: string) => {
    if (isMastermindLocked && onOpenMastermind) {
      soundManager.playError();
      onOpenMastermind();
      return;
    }
    if (isLockedOut || isUnlocked) return;
    soundManager.playKeyBeep(700 + parseInt(digit, 10) * 35);
    onKeyPress(digit);
  };

  const handleClearClick = () => {
    if (isMastermindLocked || isLockedOut || isUnlocked) return;
    soundManager.playKeyBeep(450);
    onClear();
  };

  const handleSubmitClick = () => {
    if (isMastermindLocked && onOpenMastermind) {
      soundManager.playError();
      onOpenMastermind();
      return;
    }
    if (isLockedOut || isUnlocked) return;
    soundManager.playKeyBeep(950);
    onSubmit();
  };

  // Création des cases pour les chiffres attendus
  const codeSlots = Array.from({ length: expectedLength }).map((_, index) => {
    const char = enteredCode[index];
    return (
      <span
        key={index}
        className={`inline-flex items-center justify-center w-8 h-10 border rounded text-lg font-mono font-bold transition-all ${
          char
            ? 'border-amber-400 bg-amber-950/60 text-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.35)]'
            : 'border-slate-800 bg-slate-950/80 text-slate-600'
        }`}
        aria-label={char ? `Chiffre ${index + 1} renseigné` : `Chiffre ${index + 1} vide`}
      >
        {char ? '*' : '·'}
      </span>
    );
  });

  return (
    <div
      className="bg-gradient-to-b from-stone-900 via-neutral-900 to-stone-950 p-6 rounded-2xl border-2 border-stone-700 shadow-2xl w-full max-w-sm mx-auto text-slate-100 select-none relative"
      role="region"
      aria-label="Clavier électronique de sécurité"
    >
      {/* Visserie décorative réaliste aux quatre coins */}
      <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-stone-600 border border-stone-500 shadow-inner flex items-center justify-center" aria-hidden="true">
        <div className="w-1.5 h-0.5 bg-stone-800 rotate-45"></div>
      </div>
      <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-stone-600 border border-stone-500 shadow-inner flex items-center justify-center" aria-hidden="true">
        <div className="w-1.5 h-0.5 bg-stone-800 -rotate-45"></div>
      </div>
      <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-stone-600 border border-stone-500 shadow-inner flex items-center justify-center" aria-hidden="true">
        <div className="w-1.5 h-0.5 bg-stone-800 -rotate-12"></div>
      </div>
      <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-stone-600 border border-stone-500 shadow-inner flex items-center justify-center" aria-hidden="true">
        <div className="w-1.5 h-0.5 bg-stone-800 rotate-75"></div>
      </div>

      {/* En-tête : Marque et voyants LED */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-800">
        <div>
          <span className="text-[10px] tracking-[0.25em] font-mono uppercase text-stone-400 font-bold block">
            SECURE-LOCK SYSTEM
          </span>
          <span className="text-[9px] text-stone-500 font-mono tracking-wider">MODÈLE VAULT-8000</span>
        </div>

        {/* Témoins LED */}
        <div className="flex items-center gap-3">
          {/* LED Erreur / Verrouillé */}
          <div className="flex flex-col items-center gap-1">
            <span
              className={`w-3 h-3 rounded-full border transition-all ${
                statusType === 'error' || isLockedOut
                  ? 'bg-rose-500 border-rose-300 shadow-[0_0_12px_#f43f5e] animate-pulse'
                  : 'bg-stone-800 border-stone-700'
              }`}
              aria-hidden="true"
            />
            <span className="text-[8px] font-mono text-stone-400">REFUS</span>
          </div>

          {/* LED Succès / Ouvert */}
          <div className="flex flex-col items-center gap-1">
            <span
              className={`w-3 h-3 rounded-full border transition-all ${
                isUnlocked
                  ? 'bg-emerald-400 border-emerald-200 shadow-[0_0_12px_#34d399]'
                  : 'bg-stone-800 border-stone-700'
              }`}
              aria-hidden="true"
            />
            <span className="text-[8px] font-mono text-stone-400">ACCÈS</span>
          </div>
        </div>
      </div>

      {/* Écran LCD rétroéclairé */}
      <div
        className="bg-black/90 p-4 rounded-xl border border-stone-800 shadow-inner mb-5 relative overflow-hidden"
        role="status"
        aria-live="polite"
      >
        {/* Lignes de balayage CRT subtiles */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] opacity-40" />

        {/* Affichage du code masqué */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {codeSlots}
        </div>

        {/* Message de statut LCD */}
        <div className="text-center font-mono text-xs tracking-wider min-h-[22px] flex items-center justify-center font-semibold">
          {isMastermindLocked ? (
            <span className="text-cyan-400 flex items-center gap-1.5 animate-pulse">
              <Lock className="w-3.5 h-3.5" aria-hidden="true" />
              VERROU OPTIQUE ACTIF · DÉRIVATION REQUISE
            </span>
          ) : isLockedOut ? (
            <span className="text-rose-400 flex items-center gap-1.5 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
              SYSTÈME BLOQUÉ ({lockoutTimer}s)
            </span>
          ) : isUnlocked ? (
            <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
              <Unlock className="w-3.5 h-3.5" aria-hidden="true" />
              {statusMessage || 'ACCÈS AUTORISÉ - TOURNEZ LA POIGNÉE'}
            </span>
          ) : statusType === 'error' ? (
            <span className="text-rose-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" aria-hidden="true" />
              {statusMessage || 'CODE INCORRECT'}
            </span>
          ) : (
            <span className="text-amber-400/90">
              {enteredCode.length === 0
                ? 'ENTREZ LE CODE SECRET'
                : `${enteredCode.length} / ${expectedLength} CHIFFRES`}
            </span>
          )}
        </div>

        {/* Bouton direct pour résoudre le Mastermind si verrouillé */}
        {isMastermindLocked && onOpenMastermind && (
          <div className="mt-3 pt-2 border-t border-cyan-900/60">
            <button
              type="button"
              onClick={onOpenMastermind}
              className="w-full py-2 px-3 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/60 font-mono text-xs font-bold tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all animate-pulse"
            >
              <span>DÉVERROUILLER LE MODULE OPTIQUE (MASTERMIND)</span>
            </button>
          </div>
        )}

        {/* Compteur d'essais */}
        {!isUnlocked && (
          <div className="mt-2 pt-2 border-t border-stone-900 flex justify-between items-center text-[10px] font-mono text-stone-500">
            <span>SÉCURITÉ ACTIVE</span>
            <span>
              ESSAIS : {attemptsLeft} / {maxAttempts}
            </span>
          </div>
        )}
      </div>

      {/* Clavier à touches physiques */}
      <div className="grid grid-cols-3 gap-2.5 mb-4" role="group" aria-label="Pavé numérique">
        {digits.map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => handleDigitClick(digit)}
            disabled={isLockedOut || isUnlocked}
            aria-label={`Chiffre ${digit}`}
            className="h-13 rounded-lg bg-gradient-to-b from-stone-800 to-stone-900 border border-stone-700/80 hover:border-amber-500/70 active:border-amber-400 text-stone-200 font-mono text-xl font-bold flex items-center justify-center shadow-[0_3px_0_#1c1917] active:shadow-none active:translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            {digit}
          </button>
        ))}

        {/* Touche Effacer */}
        <button
          type="button"
          onClick={handleClearClick}
          disabled={isLockedOut || isUnlocked || enteredCode.length === 0}
          aria-label="Effacer la saisie"
          className="h-13 rounded-lg bg-gradient-to-b from-rose-950/60 to-stone-900 border border-rose-900/60 hover:border-rose-500 text-rose-300 font-mono text-sm font-semibold flex items-center justify-center shadow-[0_3px_0_#1c1917] active:shadow-none active:translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 gap-1"
        >
          <Delete className="w-4 h-4" aria-hidden="true" />
          <span className="text-xs">EFFACER</span>
        </button>

        {/* Chiffre 0 */}
        <button
          type="button"
          onClick={() => handleDigitClick('0')}
          disabled={isLockedOut || isUnlocked}
          aria-label="Chiffre 0"
          className="h-13 rounded-lg bg-gradient-to-b from-stone-800 to-stone-900 border border-stone-700/80 hover:border-amber-500/70 active:border-amber-400 text-stone-200 font-mono text-xl font-bold flex items-center justify-center shadow-[0_3px_0_#1c1917] active:shadow-none active:translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          0
        </button>

        {/* Touche Valider */}
        <button
          type="button"
          onClick={handleSubmitClick}
          disabled={isLockedOut || isUnlocked || enteredCode.length === 0}
          aria-label="Valider le code"
          className="h-13 rounded-lg bg-gradient-to-b from-emerald-950/80 to-stone-900 border border-emerald-800/80 hover:border-emerald-500 text-emerald-300 font-mono text-sm font-semibold flex items-center justify-center shadow-[0_3px_0_#1c1917] active:shadow-none active:translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 gap-1"
        >
          <Check className="w-4 h-4" aria-hidden="true" />
          <span className="text-xs">VALIDER</span>
        </button>
      </div>

      {/* Action poignée lorsque le coffre est déverrouillé */}
      {isUnlocked && !isOpen && (
        <div className="mt-4 pt-3 border-t border-stone-800 animate-bounce">
          <button
            type="button"
            onClick={onTurnHandle}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-bold tracking-wide uppercase shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-all cursor-pointer"
          >
            <Unlock className="w-5 h-5" aria-hidden="true" />
            Ouvrir la porte du coffre
          </button>
        </div>
      )}

      {/* Notice pour clavier physique */}
      <div className="text-center text-[10px] text-stone-500 font-mono mt-3">
        Astuce : vous pouvez aussi taper directement au clavier (0-9, Entrée, Retour)
      </div>
    </div>
  );
};
