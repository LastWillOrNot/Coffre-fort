import React from 'react';
import { X, Search, FileQuestion, Eye, HelpCircle } from 'lucide-react';
import { ClueItem } from '../types/game';

interface CluesModalProps {
  clues: ClueItem[];
  onClose: () => void;
  onRevealClue: (clueId: string) => void;
}

export const CluesModal: React.FC<CluesModalProps> = ({ clues, onClose, onRevealClue }) => {
  const discoveredCount = clues.filter((c) => c.discovered).length;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="clues-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-4 border-b border-stone-800 bg-stone-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h2 id="clues-modal-title" className="text-base font-bold text-stone-100 font-sans">
                Dossier d'Enquête & Indices Découverts
              </h2>
              <span className="text-xs text-stone-400 font-mono">
                {discoveredCount} / {clues.length} éléments examinés dans la pièce
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer transition-colors"
            aria-label="Fermer le dossier d'indices"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps des indices */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {clues.map((clue, index) => {
            const isNextToReveal =
              !clue.discovered &&
              clues.slice(0, index).every((prev) => prev.discovered);

            return (
              <div
                key={clue.id}
                className={`rounded-xl border transition-all ${
                  clue.discovered
                    ? 'bg-stone-950/80 border-amber-900/40 p-4'
                    : isNextToReveal
                    ? 'bg-stone-950/40 border-stone-800 border-dashed p-4'
                    : 'bg-stone-950/20 border-stone-900 opacity-60 p-3'
                }`}
              >
                {clue.discovered ? (
                  <div>
                    {/* En-tête d'indice découvert */}
                    <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-stone-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-mono flex items-center justify-center font-bold">
                            {index + 1}
                          </span>
                          <h3 className="font-semibold text-stone-100 text-sm">
                            {clue.title}
                          </h3>
                        </div>
                        <p className="text-xs text-amber-400/80 mt-0.5 font-sans">
                          {clue.subtitle}
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                          clue.hintLevel === 'subtle'
                            ? 'bg-blue-950/50 border-blue-800 text-blue-300'
                            : clue.hintLevel === 'medium'
                            ? 'bg-amber-950/50 border-amber-800 text-amber-300'
                            : 'bg-emerald-950/50 border-emerald-800 text-emerald-300'
                        }`}
                      >
                        {clue.hintLevel === 'subtle'
                          ? 'Énigme subtile'
                          : clue.hintLevel === 'medium'
                          ? 'Indice historique'
                          : 'Solution directe'}
                      </span>
                    </div>

                    {/* Contenu textuel de l'indice */}
                    <div className="text-stone-300 text-xs sm:text-sm font-mono whitespace-pre-line leading-relaxed bg-stone-900/70 p-3 rounded-lg border border-stone-800">
                      {clue.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-500">
                        <FileQuestion className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-medium text-stone-400 text-sm block">
                          Indice {index + 1} encore dissimulé
                        </span>
                        <span className="text-xs text-stone-500">
                          {clue.subtitle || 'Fouille requise dans la pièce'}
                        </span>
                      </div>
                    </div>

                    {isNextToReveal && (
                      <button
                        type="button"
                        onClick={() => onRevealClue(clue.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Révéler cet indice (Fouiller la zone)
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pied d'indices */}
        <div className="p-4 border-t border-stone-800 bg-stone-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-400">
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
            Les joueurs peuvent examiner ces notes pour déduire la combinaison à 4 chiffres.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold cursor-pointer transition-colors"
          >
            Fermer le dossier
          </button>
        </div>
      </div>
    </div>
  );
};
