/**
 * Application Coffre-Fort Électronique & Testament pour Jeu de Rôle
 * @license Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Shield, Key, Search, FileText, ShieldCheck, ShieldAlert } from 'lucide-react';
import { SafeDoor } from './components/SafeDoor';
import { TestamentViewer } from './components/TestamentViewer';
import { CluesModal } from './components/CluesModal';
import { GameMasterModal } from './components/GameMasterModal';
import { MastermindGame } from './components/MastermindGame';
import { DEFAULT_SCENARIOS } from './data/defaultScenarios';
import { soundManager } from './utils/audio';
import {
  ClueItem,
  TestamentContent,
  ScenarioPreset,
  MastermindConfig,
  MastermindColor,
  MastermindAttempt
} from './types/game';

export default function App() {
  // Scénario actif (par défaut : Meurtre à Ploemel)
  const [activeScenario, setActiveScenario] = useState<ScenarioPreset>(DEFAULT_SCENARIOS[0]);
  const [scenarioName, setScenarioName] = useState<string>(DEFAULT_SCENARIOS[0].name);
  const [scenarioSubtitle, setScenarioSubtitle] = useState<string>(
    DEFAULT_SCENARIOS[0].subtitle || 'Hôtel de Ville de Ploemel · Coffre-fort du cabinet du Maire'
  );
  const [safeRef, setSafeRef] = useState<string>(DEFAULT_SCENARIOS[0].safeRef || 'REF : MAIRIE-PLOEMEL-2024');
  const [safeLabel, setSafeLabel] = useState<string>(
    DEFAULT_SCENARIOS[0].safeLabel || 'COFFRE MUNICIPAL BLINDÉ · CABINET DU MAIRE'
  );
  const [gmPassword, setGmPassword] = useState<string>('MJJDR');

  const [safeCode, setSafeCode] = useState<string>(DEFAULT_SCENARIOS[0].code);
  const [testament, setTestament] = useState<TestamentContent>(DEFAULT_SCENARIOS[0].testament);
  const [clues, setClues] = useState<ClueItem[]>(DEFAULT_SCENARIOS[0].clues);

  // État de l'option Mastermind préliminaire (5 zones, 6 couleurs)
  const [mastermindConfig, setMastermindConfig] = useState<MastermindConfig>({
    enabled: false, // Activable à la demande par le MJ
    secretCode: ['red', 'blue', 'green', 'yellow', 'purple'], // 5 zones
    isSolved: false,
    attempts: []
  });
  const [showMastermind, setShowMastermind] = useState<boolean>(false);

  // Le pavé numérique est bloqué si le Mastermind est activé et non résolu
  const isMastermindLocked = mastermindConfig.enabled && !mastermindConfig.isSolved;

  // État du coffre-fort
  const [enteredCode, setEnteredCode] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [statusType, setStatusType] = useState<'idle' | 'success' | 'error' | 'locked'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Gestion des tentatives et blocage anti-effraction
  const [maxAttempts, setMaxAttempts] = useState<number>(3);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(3);
  const [isLockedOut, setIsLockedOut] = useState<boolean>(false);
  const [lockoutTimer, setLockoutTimer] = useState<number>(0);

  // État des fenêtres modales
  const [showTestament, setShowTestament] = useState<boolean>(false);
  const [showClues, setShowClues] = useState<boolean>(false);
  const [showGM, setShowGM] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Synchronisation du son avec le gestionnaire audio
  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundManager.enabled = newState;
    if (newState) {
      soundManager.playKeyBeep(880);
    }
  };

  // Minuteur de blocage après trop d'échecs
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLockedOut && lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev <= 1) {
            setIsLockedOut(false);
            setAttemptsLeft(maxAttempts);
            setStatusType('idle');
            setStatusMessage('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLockedOut, lockoutTimer, maxAttempts]);

  // Gestion de la saisie d'un chiffre
  const handleKeyPress = useCallback(
    (char: string) => {
      if (isMastermindLocked) {
        soundManager.playError();
        setShowMastermind(true);
        return;
      }
      if (isLockedOut || isUnlocked) return;
      if (enteredCode.length < safeCode.length) {
        setEnteredCode((prev) => prev + char);
        setStatusType('idle');
        setStatusMessage('');
      }
    },
    [isMastermindLocked, isLockedOut, isUnlocked, enteredCode.length, safeCode.length]
  );

  // Effacer la saisie
  const handleClear = useCallback(() => {
    if (isMastermindLocked || isLockedOut || isUnlocked) return;
    setEnteredCode('');
    setStatusType('idle');
    setStatusMessage('');
  }, [isMastermindLocked, isLockedOut, isUnlocked]);

  // Validation du code saisi
  const handleSubmit = useCallback(() => {
    if (isMastermindLocked) {
      soundManager.playError();
      setShowMastermind(true);
      return;
    }
    if (isLockedOut || isUnlocked || enteredCode.length === 0) return;

    if (enteredCode === safeCode) {
      // Succès : Code exact !
      setIsUnlocked(true);
      setStatusType('success');
      setStatusMessage('CODE ACCEPTÉ · SYSTÈME DÉVERROUILLÉ');
      soundManager.playSuccess();
      soundManager.playMechanicalUnlock();
    } else {
      // Échec : Mauvais code
      soundManager.playError();
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);
      setEnteredCode('');

      if (newAttempts <= 0 && maxAttempts < 99) {
        // Déclenchement du protocole de blocage anti-effraction
        setIsLockedOut(true);
        setLockoutTimer(30);
        setStatusType('locked');
        setStatusMessage('ALERTE ANTI-EFFRACTION · SYSTÈME BLOQUÉ');
      } else {
        setStatusType('error');
        setStatusMessage(`CODE ERRONÉ · ${newAttempts} ESSAIS RESTANTS`);
      }
    }
  }, [isMastermindLocked, isLockedOut, isUnlocked, enteredCode, safeCode, attemptsLeft, maxAttempts]);

  // Actionner la poignée pour ouvrir le coffre
  const handleTurnHandle = () => {
    if (!isUnlocked) return;
    soundManager.playHandleTurn();
    setTimeout(() => {
      soundManager.playMechanicalUnlock();
      setIsOpen(true);
      setShowTestament(true);
    }, 400);
  };

  // Refermer le coffre
  const handleCloseSafe = () => {
    setIsOpen(false);
    setIsUnlocked(false);
    setEnteredCode('');
    setStatusType('idle');
    setStatusMessage('');
    setAttemptsLeft(maxAttempts);
  };

  // Forcer l'ouverture par le Maître du Jeu
  const handleForceUnlock = () => {
    setIsLockedOut(false);
    setLockoutTimer(0);
    setIsUnlocked(true);
    setStatusType('success');
    setStatusMessage('DÉVERROUILLAGE D\'URGENCE PAR LE MJ');
    soundManager.playSuccess();
    soundManager.playMechanicalUnlock();
  };

  // Réinitialisation complète du coffre
  const handleResetSafe = () => {
    setIsOpen(false);
    setIsUnlocked(false);
    setEnteredCode('');
    setStatusType('idle');
    setStatusMessage('');
    setIsLockedOut(false);
    setLockoutTimer(0);
    setAttemptsLeft(maxAttempts);
  };

  // Chargement d'un scénario pré-configuré
  const handleLoadPreset = (preset: ScenarioPreset) => {
    setActiveScenario(preset);
    setScenarioName(preset.name);
    setScenarioSubtitle(preset.subtitle || '');
    setSafeRef(preset.safeRef || 'REF : SECURE-VAULT');
    setSafeLabel(preset.safeLabel || 'COFFRE BLINDÉ HAUTE SÉCURITÉ');
    setSafeCode(preset.code);
    setTestament(preset.testament);
    setClues(preset.clues);
    handleResetSafe();
  };

  // Mise à jour personnalisée des informations de scénario par le MJ
  const handleUpdateScenarioDetails = (details: {
    name: string;
    subtitle: string;
    safeRef: string;
    safeLabel: string;
  }) => {
    setScenarioName(details.name);
    setScenarioSubtitle(details.subtitle);
    setSafeRef(details.safeRef);
    setSafeLabel(details.safeLabel);
  };

  // Mise à jour des indices par le MJ
  const handleUpdateClues = (newClues: ClueItem[]) => {
    setClues(newClues);
  };

  // Mise à jour du mot de passe MJ
  const handleUpdateGmPassword = (newPassword: string) => {
    setGmPassword(newPassword);
  };

  // Révéler un indice par les joueurs
  const handleRevealClue = (clueId: string) => {
    soundManager.playKeyBeep(650);
    setClues((prev) =>
      prev.map((c) => (c.id === clueId ? { ...c, discovered: true } : c))
    );
  };

  // Gestionnaires du Mastermind
  const handleToggleMastermind = (enabled: boolean) => {
    setMastermindConfig((prev) => ({ ...prev, enabled }));
  };

  const handleUpdateMastermindSecret = (secret: MastermindColor[]) => {
    setMastermindConfig((prev) => ({ ...prev, secretCode: secret }));
  };

  const handleSolveMastermind = () => {
    setMastermindConfig((prev) => ({ ...prev, isSolved: true }));
  };

  const handleAddMastermindAttempt = (attempt: MastermindAttempt) => {
    setMastermindConfig((prev) => ({
      ...prev,
      attempts: [...prev.attempts, attempt]
    }));
  };

  const handleResetMastermindGame = () => {
    setMastermindConfig((prev) => ({
      ...prev,
      isSolved: false,
      attempts: []
    }));
  };

  const handleForceSolveMastermind = () => {
    soundManager.playSuccess();
    setMastermindConfig((prev) => ({ ...prev, isSolved: true }));
  };

  // Écoute des touches du clavier physique de l'ordinateur
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ne pas intercepter si l'utilisateur est dans un champ de texte (ex: modal MJ)
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      // Raccourci secret pour le Maître du Jeu : Alt+M ou Ctrl+M
      if ((e.altKey || e.ctrlKey) && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        setShowGM((prev) => !prev);
        return;
      }

      // Fermeture des fenêtres par la touche Échap
      if (e.key === 'Escape') {
        if (showTestament) setShowTestament(false);
        if (showClues) setShowClues(false);
        if (showMastermind) setShowMastermind(false);
        if (showGM) setShowGM(false);
        return;
      }

      // Si un modal est ouvert, ne pas taper sur le coffre
      if (showTestament || showClues || showGM || showMastermind) return;

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        soundManager.playKeyBeep(700 + parseInt(e.key, 10) * 35);
        handleKeyPress(e.key);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (isUnlocked && !isOpen) {
          handleTurnHandle();
        } else {
          handleSubmit();
        }
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleKeyPress,
    handleSubmit,
    handleClear,
    isUnlocked,
    isOpen,
    showTestament,
    showClues,
    showGM,
    showMastermind
  ]);

  const discoveredCluesCount = clues.filter((c) => c.discovered).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      {/* Barre de navigation supérieure pour le Jeu de Rôle */}
      <header className="border-b border-stone-800 bg-stone-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Titre d'ambiance scénaristique */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Shield className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-stone-100 tracking-wide">
                {scenarioName}
              </h1>
              <p className="text-xs text-stone-400 font-sans hidden sm:block">
                {scenarioSubtitle}
              </p>
            </div>
          </div>

          {/* Outils joueurs & Maître du Jeu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Bouton Mastermind (si activé par le MJ) */}
            {mastermindConfig.enabled && (
              <button
                type="button"
                onClick={() => setShowMastermind(true)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                  mastermindConfig.isSolved
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/80'
                    : 'bg-cyan-950/80 text-cyan-300 border-cyan-500/80 animate-pulse shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                }`}
                title="Accéder au module de dérivation optique Mastermind"
              >
                {mastermindConfig.isSolved ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                )}
                <span>Mastermind (5 zones)</span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                    mastermindConfig.isSolved
                      ? 'bg-emerald-900 text-emerald-200'
                      : 'bg-cyan-900 text-cyan-200'
                  }`}
                >
                  {mastermindConfig.isSolved ? 'Résolu' : `${mastermindConfig.attempts.length} essais`}
                </span>
              </button>
            )}

            {/* Bouton Dossier d'Indices */}
            <button
              type="button"
              onClick={() => setShowClues(true)}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
              title="Consulter les indices découverts dans la pièce"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span>Dossier d'Indices</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px]">
                {discoveredCluesCount}/{clues.length}
              </span>
            </button>

            {/* Si le coffre est déjà ouvert : accès direct au testament */}
            {isOpen && (
              <button
                type="button"
                onClick={() => setShowTestament(true)}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Testament</span>
              </button>
            )}

            {/* Toggle Effets Sonores */}
            <button
              type="button"
              onClick={toggleSound}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 cursor-pointer transition-colors"
              aria-label={soundEnabled ? 'Couper les sons' : 'Activer les sons'}
              title={soundEnabled ? 'Sons activés' : 'Sons coupés'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              ) : (
                <VolumeX className="w-4 h-4 text-stone-500" aria-hidden="true" />
              )}
            </button>

            {/* Console Maître du Jeu (Protégée par mot de passe MJ) */}
            <button
              type="button"
              onClick={() => setShowGM(true)}
              className="px-2.5 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-800/60 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Panneau de contrôle secret du Maître du Jeu (protégé par mot de passe) [Alt+M]"
            >
              <Key className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden md:inline">Console MJ</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenu principal : Le Coffre-Fort Électronique */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 max-w-5xl mx-auto w-full">
        {/* Contexte narratif immersif pour les joueurs */}
        <div className="w-full text-center mb-4">
          <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto">
            {isOpen ? (
              <span className="text-emerald-400 font-semibold">
                La porte blindée est grande ouverte. Le testament attend d'être lu.
              </span>
            ) : isMastermindLocked ? (
              <span className="text-cyan-400 font-medium">
                SÉCURITÉ DOUBLE COUCHE : Résolvez la dérivation optique Mastermind (5 zones, 6 couleurs) pour débloquer le pavé numérique du coffre.
              </span>
            ) : (
              <span>
                Devinez la combinaison à {safeCode.length} chiffres en examinant les indices trouvés dans le bureau, ou saisissez-la sur le pavé numérique.
              </span>
            )}
          </p>
        </div>

        {/* Le composant du coffre-fort avec clavier et volant */}
        <SafeDoor
          enteredCode={enteredCode}
          expectedLength={safeCode.length}
          statusMessage={statusMessage}
          statusType={statusType}
          attemptsLeft={attemptsLeft}
          maxAttempts={maxAttempts}
          isUnlocked={isUnlocked}
          isOpen={isOpen}
          isLockedOut={isLockedOut}
          lockoutTimer={lockoutTimer}
          isMastermindLocked={isMastermindLocked}
          onOpenMastermind={() => setShowMastermind(true)}
          onKeyPress={handleKeyPress}
          onClear={handleClear}
          onSubmit={handleSubmit}
          onTurnHandle={handleTurnHandle}
          onOpenTestament={() => setShowTestament(true)}
          onCloseSafe={handleCloseSafe}
          deceasedName={testament.deceasedName}
          safeLabel={safeLabel}
          safeRef={safeRef}
        />
      </main>

      {/* Pied de page informatif pour le JDR */}
      <footer className="border-t border-stone-800 bg-stone-950/90 py-3 px-4 text-center text-xs text-stone-500 font-mono">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Outil de Jeu de Rôle & Escape Game · Prêt pour vidéoprojecteur et tablette</span>
          <span>
            Raccourci MJ : <kbd className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-300">Alt</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-300">M</kbd>
          </span>
        </div>
      </footer>

      {/* MODAL 1 : Révélation et lecture du Testament */}
      {showTestament && (
        <TestamentViewer
          testament={testament}
          onClose={() => setShowTestament(false)}
        />
      )}

      {/* MODAL 2 : Dossier d'Indices de l'enquête */}
      {showClues && (
        <CluesModal
          clues={clues}
          onClose={() => setShowClues(false)}
          onRevealClue={handleRevealClue}
        />
      )}

      {/* MODAL 3 : Module Mastermind préliminaire (5 zones, 6 couleurs) */}
      {showMastermind && (
        <MastermindGame
          secretCode={mastermindConfig.secretCode}
          attempts={mastermindConfig.attempts}
          isSolved={mastermindConfig.isSolved}
          onSolve={handleSolveMastermind}
          onAddAttempt={handleAddMastermindAttempt}
          onResetGame={handleResetMastermindGame}
          onClose={() => setShowMastermind(false)}
        />
      )}

      {/* MODAL 4 : Console du Maître du Jeu sécurisée */}
      {showGM && (
        <GameMasterModal
          currentCode={safeCode}
          testament={testament}
          isUnlocked={isUnlocked}
          isOpen={isOpen}
          maxAttempts={maxAttempts}
          scenarioName={scenarioName}
          scenarioSubtitle={scenarioSubtitle}
          safeRef={safeRef}
          safeLabel={safeLabel}
          clues={clues}
          gmPassword={gmPassword}
          mastermindConfig={mastermindConfig}
          onClose={() => setShowGM(false)}
          onUpdateCode={(newCode) => {
            setSafeCode(newCode);
            setEnteredCode('');
          }}
          onUpdateTestament={(newTestament) => setTestament(newTestament)}
          onUpdateScenarioDetails={handleUpdateScenarioDetails}
          onUpdateClues={handleUpdateClues}
          onUpdateGmPassword={handleUpdateGmPassword}
          onToggleMastermind={handleToggleMastermind}
          onUpdateMastermindSecret={handleUpdateMastermindSecret}
          onForceSolveMastermind={handleForceSolveMastermind}
          onResetMastermindGame={handleResetMastermindGame}
          onForceUnlock={handleForceUnlock}
          onResetSafe={handleResetSafe}
          onLoadPreset={handleLoadPreset}
          onUpdateMaxAttempts={(max) => {
            setMaxAttempts(max);
            setAttemptsLeft(max);
          }}
        />
      )}
    </div>
  );
}
