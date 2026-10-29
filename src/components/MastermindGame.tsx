import React, { useState } from 'react';
import { X, Check, RotateCcw, ShieldCheck, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';
import { MastermindColor, MastermindAttempt } from '../types/game';
import { MASTERMIND_COLORS, evaluateMastermindGuess } from '../utils/mastermindHelper';
import { soundManager } from '../utils/audio';

interface MastermindGameProps {
  secretCode: MastermindColor[];
  attempts: MastermindAttempt[];
  isSolved: boolean;
  onSolve: () => void;
  onAddAttempt: (attempt: MastermindAttempt) => void;
  onResetGame: () => void;
  onClose: () => void;
}

export const MastermindGame: React.FC<MastermindGameProps> = ({
  secretCode,
  attempts,
  isSolved,
  onSolve,
  onAddAttempt,
  onResetGame,
  onClose
}) => {
  // Les 5 zones de la combinaison en cours de composition
  const [currentSlots, setCurrentSlots] = useState<(MastermindColor | null)[]>([
    null,
    null,
    null,
    null,
    null
  ]);
  const [selectedColor, setSelectedColor] = useState<MastermindColor>('red');
  const [activeSlotIndex, setActiveSlotIndex] = useState<number>(0);
  const [showRules, setShowRules] = useState<boolean>(false);

  const getColorDef = (colorId: MastermindColor) => {
    return MASTERMIND_COLORS.find((c) => c.id === colorId) || MASTERMIND_COLORS[0];
  };

  // Clic sur une couleur de la palette : l'attribue au slot actif
  const handleSelectPaletteColor = (colorId: MastermindColor) => {
    if (isSolved) return;
    soundManager.playKeyBeep(600 + MASTERMIND_COLORS.findIndex((c) => c.id === colorId) * 80);
    setSelectedColor(colorId);

    // Assigne au slot actif et avance au suivant
    const updated = [...currentSlots];
    updated[activeSlotIndex] = colorId;
    setCurrentSlots(updated);

    if (activeSlotIndex < 4) {
      setActiveSlotIndex(activeSlotIndex + 1);
    }
  };

  // Clic direct sur un des 5 slots
  const handleSlotClick = (index: number) => {
    if (isSolved) return;
    setActiveSlotIndex(index);
    // Si on clique sur un slot déjà rempli, on peut aussi lui réassigner la couleur courante
    if (currentSlots[index] !== selectedColor) {
      const updated = [...currentSlots];
      updated[index] = selectedColor;
      setCurrentSlots(updated);
      soundManager.playKeyBeep(650);
    }
  };

  // Effacer la sélection actuelle
  const handleClearCurrent = () => {
    soundManager.playKeyBeep(400);
    setCurrentSlots([null, null, null, null, null]);
    setActiveSlotIndex(0);
  };

  // Valider la tentative
  const handleSubmitGuess = () => {
    if (isSolved) return;
    // Vérifier que tous les 5 slots sont renseignés
    if (currentSlots.some((slot) => slot === null)) {
      soundManager.playError();
      return;
    }

    const fullGuess = currentSlots as MastermindColor[];
    const { exactMatch, colorMatch } = evaluateMastermindGuess(fullGuess, secretCode);

    const newAttempt: MastermindAttempt = {
      id: `attempt-${Date.now()}-${attempts.length + 1}`,
      guess: fullGuess,
      exactMatch,
      colorMatch,
      timestamp: Date.now()
    };

    onAddAttempt(newAttempt);

    if (exactMatch === 5) {
      // Victoire !
      soundManager.playSuccess();
      onSolve();
    } else {
      soundManager.playKeyBeep(500);
      // Réinitialise pour le tour suivant
      setCurrentSlots([null, null, null, null, null]);
      setActiveSlotIndex(0);
    }
  };

  const isCurrentComplete = currentSlots.every((s) => s !== null);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mastermind-title"
    >
      <div className="relative w-full max-w-3xl bg-neutral-900 border-2 border-cyan-600/70 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden my-auto text-slate-100 flex flex-col max-h-[92vh]">
        {/* En-tête */}
        <div className="flex items-center justify-between p-4 border-b border-stone-800 bg-black/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 id="mastermind-title" className="text-base font-bold text-cyan-300 font-sans tracking-wide">
                Dérivation Cryptographique · Mastermind Optique
              </h2>
              <span className="text-xs text-stone-400 font-mono">
                5 zones · 6 couleurs · Essais illimités
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowRules(!showRules)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-cyan-300 hover:bg-stone-800 cursor-pointer transition-colors"
              title="Règles du Mastermind"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer transition-colors"
              aria-label="Fermer le module Mastermind"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Aide / Règles dépliables */}
        {showRules && (
          <div className="p-3 bg-cyan-950/40 border-b border-cyan-800/60 text-xs text-cyan-200 font-mono space-y-1">
            <p><strong>Objectif :</strong> Deviner la séquence secrète de 5 couleurs dans le bon ordre.</p>
            <p>• <strong>Pion noir (●) :</strong> Bonne couleur et bon emplacement.</p>
            <p>• <strong>Pion blanc (○) :</strong> Bonne couleur mais à un autre emplacement.</p>
            <p>• Les couleurs peuvent être répétées. Les essais sont illimités.</p>
          </div>
        )}

        {/* Corps principal : Zone de saisie + Historique */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* État de succès */}
          {isSolved ? (
            <div className="p-5 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/70 text-center space-y-3 animate-fade-in shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-emerald-300 tracking-wide">
                DÉRIVATION OPTIQUE RÉUSSIE !
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto">
                Le verrou optique est désormais levé. L'alimentation du pavé numérique du coffre-fort a été activée avec succès !
              </p>

              {/* Affichage de la combinaison trouvée */}
              <div className="flex items-center justify-center gap-2 pt-2">
                {secretCode.map((c, i) => {
                  const def = getColorDef(c);
                  return (
                    <div
                      key={i}
                      className={`w-10 h-10 rounded-xl ${def.bgClass} ${def.borderClass} border-2 flex items-center justify-center font-bold text-white shadow-md`}
                      title={`${def.label} (${def.symbol})`}
                    >
                      <span className="text-xs">{def.symbol}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm tracking-wide cursor-pointer shadow-lg transition-all"
                >
                  Accéder au clavier du coffre
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Panneau de saisie actuel (5 zones) */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-400 font-mono font-semibold">
                    COMBINAISON EN COURS (TENTATIVE #{attempts.length + 1})
                  </span>
                  <span className="text-cyan-400 font-mono">
                    Zone sélectionnée : #{activeSlotIndex + 1}
                  </span>
                </div>

                {/* Les 5 zones de sélection */}
                <div className="flex items-center justify-center gap-2 sm:gap-4 py-2">
                  {currentSlots.map((slotColor, idx) => {
                    const isSelected = activeSlotIndex === idx;
                    const colorDef = slotColor ? getColorDef(slotColor) : null;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSlotClick(idx)}
                        className={`w-12 h-14 sm:w-16 sm:h-18 rounded-xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-cyan-400 ring-2 ring-cyan-400/40 scale-105'
                            : 'border-stone-700 hover:border-stone-500'
                        } ${colorDef ? colorDef.bgClass : 'bg-stone-900/80'}`}
                      >
                        {colorDef ? (
                          <>
                            <span className="text-white text-base sm:text-lg font-bold drop-shadow">
                              {colorDef.symbol}
                            </span>
                            <span className="text-[10px] text-white/90 font-mono font-bold tracking-tight">
                              {colorDef.label}
                            </span>
                          </>
                        ) : (
                          <span className="text-stone-600 font-mono text-sm sm:text-base font-bold">
                            #{idx + 1}
                          </span>
                        )}

                        {isSelected && (
                          <div className="absolute -bottom-2 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Palette des 6 couleurs sélectionnables */}
                <div className="pt-2 border-t border-stone-800">
                  <span className="block text-[11px] text-stone-400 font-mono mb-2 text-center">
                    Cliquez sur une couleur pour remplir la zone active :
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {MASTERMIND_COLORS.map((colorDef) => (
                      <button
                        key={colorDef.id}
                        type="button"
                        onClick={() => handleSelectPaletteColor(colorDef.id)}
                        className={`h-11 sm:h-12 rounded-xl border-2 ${colorDef.bgClass} ${colorDef.borderClass} flex items-center justify-center gap-1.5 text-white font-bold text-xs cursor-pointer shadow-md active:scale-95 transition-all`}
                        title={colorDef.label}
                      >
                        <span>{colorDef.symbol}</span>
                        <span>{colorDef.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions de validation */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleClearCurrent}
                    disabled={currentSlots.every((s) => s === null)}
                    className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold cursor-pointer disabled:opacity-40 transition-colors"
                  >
                    Effacer la ligne
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmitGuess}
                    disabled={!isCurrentComplete}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <Check className="w-4 h-4" />
                    Tester cette combinaison
                  </button>
                </div>
              </div>

              {/* Historique des tentatives (autant de possibilités que voulues) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider font-mono">
                    Historique des tentatives ({attempts.length})
                  </h4>
                  {attempts.length > 0 && (
                    <button
                      type="button"
                      onClick={onResetGame}
                      className="text-[11px] text-stone-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" /> Recommencer à zéro
                    </button>
                  )}
                </div>

                {attempts.length === 0 ? (
                  <div className="p-4 rounded-xl bg-stone-950/40 border border-stone-800/80 text-center text-xs text-stone-500 font-mono">
                    Aucune tentative pour l'instant. Choisissez 5 couleurs et validez.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {[...attempts].reverse().map((att, reverseIdx) => {
                      const attemptNumber = attempts.length - reverseIdx;

                      return (
                        <div
                          key={att.id}
                          className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between gap-3 text-xs"
                        >
                          {/* Numéro */}
                          <span className="font-mono font-bold text-stone-400 w-8">
                            #{attemptNumber}
                          </span>

                          {/* Les 5 pions de la tentative */}
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            {att.guess.map((c, i) => {
                              const def = getColorDef(c);
                              return (
                                <div
                                  key={i}
                                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${def.bgClass} flex items-center justify-center text-white text-xs font-bold shadow-sm`}
                                  title={def.label}
                                >
                                  {def.symbol}
                                </div>
                              );
                            })}
                          </div>

                          {/* Clés d'indices : Bien placés / Mal placés */}
                          <div className="flex items-center gap-3 font-mono">
                            {/* Pions noirs (bien placés) */}
                            <div className="flex items-center gap-1" title="Bonne couleur et bon emplacement">
                              <span className="w-3 h-3 rounded-full bg-cyan-400 border border-cyan-300 shadow-[0_0_6px_#22d3ee]" />
                              <span className="text-cyan-300 font-bold">{att.exactMatch}</span>
                              <span className="text-[10px] text-stone-500 hidden sm:inline">exact</span>
                            </div>

                            {/* Pions blancs (mal placés) */}
                            <div className="flex items-center gap-1" title="Bonne couleur mais mauvais emplacement">
                              <span className="w-3 h-3 rounded-full bg-stone-400 border border-stone-200" />
                              <span className="text-stone-300 font-bold">{att.colorMatch}</span>
                              <span className="text-[10px] text-stone-500 hidden sm:inline">déplacé</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Pied de module */}
        <div className="p-3 border-t border-stone-800 bg-stone-950 flex items-center justify-between text-xs text-stone-500 font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
            {isSolved
              ? 'Sécurité optique désactivée. Accès au clavier autorisé.'
              : 'Résolvez cette séquence pour déverrouiller le clavier du coffre.'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold cursor-pointer transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
