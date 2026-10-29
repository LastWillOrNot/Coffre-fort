import React, { useState } from 'react';
import { X, Printer, Copy, Check, ShieldAlert, Award } from 'lucide-react';
import { TestamentContent } from '../types/game';

interface TestamentViewerProps {
  testament: TestamentContent;
  onClose: () => void;
}

export const TestamentViewer: React.FC<TestamentViewerProps> = ({ testament, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = async () => {
    const formatted = `
${testament.title}
Défunt : ${testament.deceasedName}
Notaire : ${testament.notaryName}
Lieu et date : ${testament.city}, le ${testament.date}

--- PRÉAMBULE ---
${testament.introduction}

--- DISPOSITIONS TESTAMENTAIRES ---
${testament.bequests
  .map(
    (b, i) =>
      `${i + 1}. Bénéficiaire : ${b.beneficiary}\n   Legs : ${b.item}${
        b.condition ? `\n   Condition : ${b.condition}` : ''
      }`
  )
  .join('\n\n')}

--- RÉVÉLATION CONFIDENTIELLE ---
${testament.secretRevelation}

--- AVERTISSEMENT ---
${testament.warningNote}

Fait et rédigé de ma main,
Signé : ${testament.signatory}
    `.trim();

    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignorer si presse-papier non accessible
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="testament-modal-title"
    >
      <div className="relative w-full max-w-3xl my-auto">
        {/* Barre d'outils supérieure */}
        <div className="flex items-center justify-between bg-stone-900 border-t border-x border-stone-700 px-4 py-3 rounded-t-2xl text-stone-300">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-mono text-xs uppercase tracking-wider font-semibold text-amber-200">
              DOCUMENT OFFICIEL SOUS SCELLÉ
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Copier le texte du testament"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Imprimer pour la table de jeu de rôle"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>Imprimer</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white cursor-pointer transition-colors ml-2"
              aria-label="Fermer la vue du testament"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Le Parchemin / Document notarié */}
        <div
          id="printable-testament"
          className="bg-[#fcf8ee] text-stone-900 p-6 sm:p-12 rounded-b-2xl border-b border-x border-stone-700 shadow-2xl relative overflow-hidden font-serif selection:bg-amber-200"
        >
          {/* Filigrane discret et bordure double élégante */}
          <div className="border-4 border-double border-stone-400/80 p-6 sm:p-8 relative">
            {/* Sceau de cire en haut à droite */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-col items-center select-none opacity-90">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-700 via-rose-800 to-red-950 border-2 border-red-500 shadow-md flex items-center justify-center text-center p-1">
                <span className="text-[8px] font-sans font-bold text-amber-200 tracking-tighter uppercase leading-tight">
                  SCEAU OFFICIEL · ETUDE NOTARIALE
                </span>
              </div>
              <div className="w-3 h-8 bg-red-700 -mt-1 rounded-b shadow-sm" />
            </div>

            {/* En-tête notarial */}
            <div className="text-center max-w-md mx-auto mb-8 border-b-2 border-stone-300 pb-6">
              <span className="block text-xs uppercase tracking-[0.25em] text-stone-500 font-sans font-semibold mb-1">
                RÉPUBLIQUE FRANÇAISE · ACTE AUTHENTIQUE
              </span>
              <h2
                id="testament-modal-title"
                className="text-2xl sm:text-3xl font-bold tracking-wide text-stone-900 font-serif"
              >
                {testament.title}
              </h2>
              <p className="text-sm italic text-stone-600 mt-2">
                Reçu et enregistré par {testament.notaryName}
              </p>
              <p className="text-xs text-stone-500 font-sans mt-0.5">
                {testament.city} — En date du {testament.date}
              </p>
            </div>

            {/* Identité du défunt */}
            <div className="mb-6 bg-amber-100/60 p-4 rounded-lg border border-amber-300/60 font-sans text-xs sm:text-sm text-stone-800 flex items-center justify-between">
              <div>
                <span className="font-semibold block text-stone-900">TESTATEUR :</span>
                <span>{testament.deceasedName}</span>
              </div>
              <div className="text-right font-mono text-xs text-stone-600">
                ACTE N° 1923-B
              </div>
            </div>

            {/* Introduction solennelle */}
            <div className="mb-8 text-sm sm:text-base leading-relaxed text-stone-800 text-justify first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:text-stone-900">
              {testament.introduction}
            </div>

            {/* Clauses et Legs */}
            <div className="mb-8">
              <h3 className="text-lg font-bold uppercase tracking-wider text-stone-900 border-b border-stone-300 pb-2 mb-4 font-sans text-sm">
                DISPOSITIONS ET ATTRIBUTIONS DES BIENS
              </h3>

              <div className="space-y-4">
                {testament.bequests.map((bequest, index) => (
                  <div
                    key={index}
                    className="p-3.5 bg-stone-100/70 rounded-md border border-stone-300/80 text-sm"
                  >
                    <div className="font-bold text-stone-900 mb-1 flex items-center gap-2 font-sans text-xs uppercase tracking-wide">
                      <span className="w-5 h-5 rounded-full bg-stone-300 flex items-center justify-center text-stone-800 font-mono text-xs">
                        {index + 1}
                      </span>
                      {bequest.beneficiary}
                    </div>
                    <div className="text-stone-800 font-medium pl-7">
                      « {bequest.item} »
                    </div>
                    {bequest.condition && (
                      <div className="text-xs text-rose-900 italic mt-1.5 pl-7 border-t border-stone-200 pt-1.5">
                        <span className="font-semibold not-italic">Clause suspensive : </span>
                        {bequest.condition}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Révélation secrète / Élément clé pour le JDR */}
            {testament.secretRevelation && (
              <div className="mb-8 p-4 rounded-xl bg-amber-50 border-2 border-dashed border-amber-600/60 relative">
                <div className="flex items-center gap-2 text-amber-900 font-sans font-bold text-xs uppercase tracking-wider mb-2">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                  CODICILLE CONFIDENTIEL & RÉVÉLATION ULTIME
                </div>
                <p className="text-sm sm:text-base italic text-stone-800 leading-relaxed">
                  « {testament.secretRevelation} »
                </p>
              </div>
            )}

            {/* Avertissement final */}
            {testament.warningNote && (
              <div className="mb-8 p-3 bg-rose-50 border border-rose-200 rounded-md text-xs sm:text-sm text-rose-950">
                <span className="font-bold uppercase tracking-wide font-sans text-[11px] block text-rose-900 mb-0.5">
                  AVERTISSEMENT SOLENNEL :
                </span>
                {testament.warningNote}
              </div>
            )}

            {/* Signatures et paraphes */}
            <div className="pt-6 border-t-2 border-stone-300 flex items-end justify-between font-sans">
              <div className="text-xs text-stone-500">
                <span>Paraphe de l'étude ({testament.notaryName || 'Notaire soussigné'}) :</span>
                <div className="font-serif italic text-base text-stone-700 mt-1">
                  {testament.notaryName ? `${testament.notaryName}, Not.` : 'Me. Notaire'}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-stone-500 block mb-1">Signature du testateur :</span>
                <div className="font-serif italic font-bold text-lg sm:text-xl text-stone-900 tracking-wide">
                  {testament.signatory || testament.deceasedName}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pied de modal avec rappel pour le Maître du Jeu */}
        <div className="bg-stone-900 border-b border-x border-stone-700 px-4 py-2.5 rounded-b-2xl text-center text-xs text-stone-400 font-mono">
          Les joueurs ont désormais connaissance de ce document. Utilisez le bouton "Imprimer" pour leur donner en main propre lors de la partie !
        </div>
      </div>
    </div>
  );
};
