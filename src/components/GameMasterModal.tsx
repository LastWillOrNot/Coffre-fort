import React, { useState } from 'react';
import {
  X,
  Settings,
  Unlock,
  RotateCcw,
  KeyRound,
  FileEdit,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Lock,
  Plus,
  Trash2,
  Compass,
  FileText,
  LogOut,
  Eye,
  EyeOff,
  Sparkles,
  Dices,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import {
  TestamentContent,
  ScenarioPreset,
  ClueItem,
  MastermindConfig,
  MastermindColor
} from '../types/game';
import { DEFAULT_SCENARIOS } from '../data/defaultScenarios';
import {
  MASTERMIND_COLORS,
  ALL_COLOR_IDS,
  generateRandomMastermindCode
} from '../utils/mastermindHelper';

interface GameMasterModalProps {
  currentCode: string;
  testament: TestamentContent;
  isUnlocked: boolean;
  isOpen: boolean;
  maxAttempts: number;
  scenarioName: string;
  scenarioSubtitle: string;
  safeRef: string;
  safeLabel: string;
  clues: ClueItem[];
  gmPassword: string;
  mastermindConfig: MastermindConfig;
  onClose: () => void;
  onUpdateCode: (newCode: string) => void;
  onUpdateTestament: (newTestament: TestamentContent) => void;
  onUpdateScenarioDetails: (details: {
    name: string;
    subtitle: string;
    safeRef: string;
    safeLabel: string;
  }) => void;
  onUpdateClues: (newClues: ClueItem[]) => void;
  onUpdateGmPassword: (newPassword: string) => void;
  onToggleMastermind: (enabled: boolean) => void;
  onUpdateMastermindSecret: (secret: MastermindColor[]) => void;
  onForceSolveMastermind: () => void;
  onResetMastermindGame: () => void;
  onForceUnlock: () => void;
  onResetSafe: () => void;
  onLoadPreset: (preset: ScenarioPreset) => void;
  onUpdateMaxAttempts: (max: number) => void;
}

export const GameMasterModal: React.FC<GameMasterModalProps> = ({
  currentCode,
  testament,
  isUnlocked,
  isOpen,
  maxAttempts,
  scenarioName,
  scenarioSubtitle,
  safeRef,
  safeLabel,
  clues,
  gmPassword,
  mastermindConfig,
  onClose,
  onUpdateCode,
  onUpdateTestament,
  onUpdateScenarioDetails,
  onUpdateClues,
  onUpdateGmPassword,
  onToggleMastermind,
  onUpdateMastermindSecret,
  onForceSolveMastermind,
  onResetMastermindGame,
  onForceUnlock,
  onResetSafe,
  onLoadPreset,
  onUpdateMaxAttempts
}) => {
  // Authentification de la console MJ
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [showPasswordText, setShowPasswordText] = useState<boolean>(false);

  // Navigation dans les onglets de configuration
  const [activeTab, setActiveTab] = useState<
    'scenario' | 'code' | 'mastermind' | 'testament' | 'clues' | 'presets'
  >('scenario');

  // État local du code secret
  const [codeDraft, setCodeDraft] = useState(currentCode);
  const [codeSuccessMsg, setCodeSuccessMsg] = useState(false);

  // État local des paramètres de scénario et ambiance
  const [scenarioDraft, setScenarioDraft] = useState({
    name: scenarioName,
    subtitle: scenarioSubtitle,
    safeRef: safeRef,
    safeLabel: safeLabel
  });
  const [newGmPasswordDraft, setNewGmPasswordDraft] = useState(gmPassword);
  const [scenarioSuccessMsg, setScenarioSuccessMsg] = useState(false);

  // État local du testament complet
  const [testamentDraft, setTestamentDraft] = useState<TestamentContent>({
    ...testament,
    signatory: testament.signatory || testament.deceasedName
  });
  const [testamentSuccessMsg, setTestamentSuccessMsg] = useState(false);

  // État local des indices
  const [cluesDraft, setCluesDraft] = useState<ClueItem[]>([...clues]);
  const [cluesSuccessMsg, setCluesSuccessMsg] = useState(false);

  // État local Mastermind
  const [mastermindSecretDraft, setMastermindSecretDraft] = useState<MastermindColor[]>([
    ...mastermindConfig.secretCode
  ]);
  const [mastermindSuccessMsg, setMastermindSuccessMsg] = useState(false);

  // Soumission du mot de passe MJ
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim().toUpperCase() === gmPassword.trim().toUpperCase()) {
      setIsAuthenticated(true);
      setAuthError('');
      setPasswordInput('');
    } else {
      setAuthError('Mot de passe MJ incorrect. Réessayez.');
    }
  };

  // Enregistrer le code
  const handleSaveCode = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = codeDraft.replace(/\D/g, '');
    if (sanitized.length >= 3 && sanitized.length <= 8) {
      onUpdateCode(sanitized);
      setCodeSuccessMsg(true);
      setTimeout(() => setCodeSuccessMsg(false), 2500);
    }
  };

  // Enregistrer les détails du scénario
  const handleSaveScenario = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateScenarioDetails(scenarioDraft);
    if (newGmPasswordDraft.trim()) {
      onUpdateGmPassword(newGmPasswordDraft.trim());
    }
    setScenarioSuccessMsg(true);
    setTimeout(() => setScenarioSuccessMsg(false), 2500);
  };

  // Enregistrer le testament complet
  const handleSaveTestament = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTestament(testamentDraft);
    setTestamentSuccessMsg(true);
    setTimeout(() => setTestamentSuccessMsg(false), 2500);
  };

  // Enregistrer les indices
  const handleSaveClues = () => {
    onUpdateClues(cluesDraft);
    setCluesSuccessMsg(true);
    setTimeout(() => setCluesSuccessMsg(false), 2500);
  };

  // Ajouter une disposition testamentaire
  const handleAddBequest = () => {
    setTestamentDraft({
      ...testamentDraft,
      bequests: [
        ...testamentDraft.bequests,
        {
          beneficiary: 'À un nouvel héritier ou suspect',
          item: 'Un bien légué ou un document clé',
          condition: 'Condition suspensive optionnelle'
        }
      ]
    });
  };

  // Supprimer une disposition testamentaire
  const handleRemoveBequest = (index: number) => {
    setTestamentDraft({
      ...testamentDraft,
      bequests: testamentDraft.bequests.filter((_, i) => i !== index)
    });
  };

  // Modifier une disposition testamentaire
  const handleUpdateBequest = (
    index: number,
    field: 'beneficiary' | 'item' | 'condition',
    value: string
  ) => {
    const updated = [...testamentDraft.bequests];
    updated[index] = { ...updated[index], [field]: value };
    setTestamentDraft({ ...testamentDraft, bequests: updated });
  };

  // Ajouter un indice
  const handleAddClue = () => {
    const newClue: ClueItem = {
      id: `clue-custom-${Date.now()}`,
      title: 'Nouvel indice d\'enquête',
      subtitle: 'Emplacement de la découverte',
      content: '« Texte de l\'indice permettant de déduire ou confirmer le code secret... »',
      hintLevel: 'medium',
      discovered: false,
      type: 'note'
    };
    const updated = [...cluesDraft, newClue];
    setCluesDraft(updated);
    onUpdateClues(updated);
  };

  // Supprimer un indice
  const handleRemoveClue = (id: string) => {
    const updated = cluesDraft.filter((c) => c.id !== id);
    setCluesDraft(updated);
    onUpdateClues(updated);
  };

  // Générer un code Mastermind aléatoire
  const handleRandomizeMastermind = () => {
    const randomCode = generateRandomMastermindCode(5);
    setMastermindSecretDraft(randomCode);
    onUpdateMastermindSecret(randomCode);
    setMastermindSuccessMsg(true);
    setTimeout(() => setMastermindSuccessMsg(false), 2500);
  };

  // Changer une couleur du code secret Mastermind
  const handleCycleSecretColor = (index: number) => {
    const currentColor = mastermindSecretDraft[index];
    const currentIndex = ALL_COLOR_IDS.indexOf(currentColor);
    const nextColor = ALL_COLOR_IDS[(currentIndex + 1) % ALL_COLOR_IDS.length];
    const updated = [...mastermindSecretDraft];
    updated[index] = nextColor;
    setMastermindSecretDraft(updated);
    onUpdateMastermindSecret(updated);
  };

  const getColorDef = (colorId: MastermindColor) => {
    return MASTERMIND_COLORS.find((c) => c.id === colorId) || MASTERMIND_COLORS[0];
  };

  // Si le MJ n'est pas authentifié, afficher l'écran de verrouillage
  if (!isAuthenticated) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gm-auth-title"
      >
        <div className="w-full max-w-md bg-stone-900 border-2 border-amber-600/70 rounded-2xl p-6 shadow-[0_0_50px_rgba(217,119,6,0.25)] text-slate-100">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Lock className="w-4 h-4" />
              </div>
              <h2 id="gm-auth-title" className="text-base font-bold text-amber-300 font-sans">
                Accès Maître du Jeu
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-stone-300 mb-4">
            Cette interface confidentielle permet de contrôler le coffre-fort et de paramétrer l'enquête. Entrez le mot de passe MJ pour continuer.
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Mot de passe secret MJ
              </label>
              <div className="relative">
                <input
                  type={showPasswordText ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  autoFocus
                  placeholder="Entrez le mot de passe secret"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-stone-950 border border-stone-700 text-amber-300 font-mono text-sm tracking-wider focus:outline-none focus:border-amber-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordText(!showPasswordText)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 cursor-pointer"
                  title={showPasswordText ? 'Masquer' : 'Afficher'}
                >
                  {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && (
                <p className="text-xs text-rose-400 mt-1.5 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {authError}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold cursor-pointer transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg cursor-pointer transition-colors"
              >
                Déverrouiller la console
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gm-modal-title"
    >
      <div className="relative w-full max-w-4xl bg-neutral-900 border-2 border-amber-600/60 rounded-2xl shadow-[0_0_60px_rgba(217,119,6,0.25)] overflow-hidden my-auto text-slate-100 flex flex-col max-h-[92vh]">
        {/* En-tête MJ connecté */}
        <div className="flex items-center justify-between p-4 border-b border-stone-800 bg-black/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 id="gm-modal-title" className="text-base font-bold text-amber-300 font-sans tracking-wide">
                Console du Maître du Jeu (MJ)
              </h2>
              <span className="text-xs text-stone-400 font-mono">
                Scénario : {scenarioDraft.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAuthenticated(false)}
              className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium border border-stone-700 flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Reverrouiller la console avec mot de passe avant de redonner l'ordinateur aux joueurs"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Verrouiller</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer transition-colors"
              aria-label="Fermer la console MJ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barre d'état et actions d'urgence */}
        <div className="bg-stone-950 p-3 sm:p-4 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-stone-400">COFFRE :</span>
            <span
              className={`px-2 py-0.5 rounded font-bold border ${
                isOpen
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  : isUnlocked
                  ? 'bg-amber-950 text-amber-300 border-amber-700'
                  : 'bg-rose-950 text-rose-300 border-rose-700'
              }`}
            >
              {isOpen ? 'OUVERT & RÉVÉLÉ' : isUnlocked ? 'DÉVERROUILLÉ (PRÊT)' : 'VERROUILLÉ'}
            </span>
            <span className="text-stone-400 ml-2">CODE PIN :</span>
            <span className="px-2 py-0.5 rounded bg-stone-800 text-amber-300 font-bold font-mono tracking-widest">
              {currentCode}
            </span>

            {/* Statut Mastermind */}
            {mastermindConfig.enabled && (
              <>
                <span className="text-stone-400 ml-2">MASTERMIND :</span>
                <span
                  className={`px-2 py-0.5 rounded font-bold border ${
                    mastermindConfig.isSolved
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                      : 'bg-yellow-950 text-yellow-300 border-yellow-700'
                  }`}
                >
                  {mastermindConfig.isSolved ? 'RÉSOLU' : 'EN ATTENTE'}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isUnlocked && (
              <button
                type="button"
                onClick={onForceUnlock}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
                title="Déverrouille instantanément le coffre si les joueurs sont coincés"
              >
                <Unlock className="w-3.5 h-3.5" />
                Forcer l'ouverture coffre
              </button>
            )}

            <button
              type="button"
              onClick={onResetSafe}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold border border-stone-700 flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Referme et réarme le coffre"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Navigation par Onglets */}
        <div className="flex border-b border-stone-800 bg-stone-900/80 px-4 pt-2 gap-2 text-xs font-semibold overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('scenario')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'scenario'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Scénario & Lieu
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'code'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            Code & Sécurité
          </button>

          {/* NOUVEL ONGLET : MASTERMIND */}
          <button
            type="button"
            onClick={() => setActiveTab('mastermind')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'mastermind'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Mastermind Préliminaire
            {mastermindConfig.enabled && (
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('testament')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'testament'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            Testament & Legs
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('clues')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'clues'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Indices ({cluesDraft.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'presets'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Préréglages
          </button>
        </div>

        {/* Corps des onglets */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {/* ONGLET 1 : SCÉNARIO ET AMBIANCE */}
          {activeTab === 'scenario' && (
            <form onSubmit={handleSaveScenario} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Titre de l'Enquête / Scénario
                  </label>
                  <input
                    type="text"
                    value={scenarioDraft.name}
                    onChange={(e) => setScenarioDraft({ ...scenarioDraft, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                    placeholder="Ex: Meurtre à Ploemel"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Sous-titre / Emplacement du bureau
                  </label>
                  <input
                    type="text"
                    value={scenarioDraft.subtitle}
                    onChange={(e) => setScenarioDraft({ ...scenarioDraft, subtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                    placeholder="Ex: Hôtel de Ville de Ploemel · Coffre-fort du cabinet du Maire"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Référence affichée sur le coffre
                  </label>
                  <input
                    type="text"
                    value={scenarioDraft.safeRef}
                    onChange={(e) => setScenarioDraft({ ...scenarioDraft, safeRef: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 text-xs font-mono focus:outline-none focus:border-amber-400"
                    placeholder="Ex: REF : MAIRIE-PLOEMEL-2024"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Plaque gravée du coffre-fort
                  </label>
                  <input
                    type="text"
                    value={scenarioDraft.safeLabel}
                    onChange={(e) => setScenarioDraft({ ...scenarioDraft, safeLabel: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 text-xs font-mono focus:outline-none focus:border-amber-400"
                    placeholder="Ex: COFFRE MUNICIPAL BLINDÉ · CABINET DU MAIRE"
                  />
                </div>
              </div>

              <div className="border-t border-stone-800 pt-4">
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Nouveau mot de passe de la Console Maître du Jeu
                </label>
                <div className="max-w-xs">
                  <input
                    type="text"
                    value={newGmPasswordDraft}
                    onChange={(e) => setNewGmPasswordDraft(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-amber-300 text-xs font-mono font-bold tracking-wider focus:outline-none focus:border-amber-400"
                    placeholder="Ex: MJJDR"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  Vous pouvez modifier ce mot de passe pour vos futures connexions.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
                >
                  Enregistrer les paramètres du scénario
                </button>

                {scenarioSuccessMsg && (
                  <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Scénario et coffre mis à jour !
                  </span>
                )}
              </div>
            </form>
          )}

          {/* ONGLET 2 : CODE ET SÉCURITÉ */}
          {activeTab === 'code' && (
            <form onSubmit={handleSaveCode} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-stone-200 mb-1">
                  Combinaison secrète du coffre-fort (3 à 8 chiffres)
                </label>
                <p className="text-xs text-stone-400 mb-3">
                  Les joueurs devront saisir exactement cette combinaison pour déverrouiller la porte blindée.
                </p>

                <div className="flex items-center gap-3 max-w-sm">
                  <input
                    type="text"
                    maxLength={8}
                    value={codeDraft}
                    onChange={(e) => setCodeDraft(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-2.5 rounded-lg bg-stone-950 border border-stone-700 text-amber-300 font-mono text-xl font-bold tracking-widest focus:outline-none focus:border-amber-400"
                    placeholder="Ex: 5640"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shrink-0 cursor-pointer transition-colors"
                  >
                    Appliquer le code
                  </button>
                </div>

                {codeSuccessMsg && (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400 mt-2 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Nouveau code secret validé ({codeDraft}) !
                  </span>
                )}
              </div>

              <div className="border-t border-stone-800 pt-5">
                <label className="block text-sm font-semibold text-stone-200 mb-1">
                  Nombre d'erreurs autorisées avant alarme et blocage
                </label>
                <div className="flex items-center gap-3 mt-2">
                  {[3, 5, 10, 99].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => onUpdateMaxAttempts(count)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all cursor-pointer ${
                        maxAttempts === count
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {count === 99 ? 'Illimité (aucun blocage)' : `${count} essais`}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* ONGLET 3 : OPTION MASTERMIND */}
          {activeTab === 'mastermind' && (
            <div className="space-y-6">
              {/* Activation générale de l'option */}
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-stone-100">
                      Phase préliminaire : Mastermind (5 zones, 6 couleurs)
                    </h3>
                  </div>
                  <p className="text-xs text-stone-400 mt-1 max-w-lg">
                    Si activé, les joueurs doivent résoudre le Mastermind pour déverrouiller l'accès au pavé numérique du coffre. Les essais sont illimités.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleMastermind(!mastermindConfig.enabled)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    mastermindConfig.enabled
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-stone-200'
                  }`}
                >
                  {mastermindConfig.enabled ? 'ACTIVÉ (REQUIS)' : 'DÉSACTIVÉ'}
                </button>
              </div>

              {/* Paramétrage de la séquence secrète */}
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider font-mono">
                      Combinaison Secrète du Mastermind (5 pions)
                    </h4>
                    <p className="text-[11px] text-stone-400">
                      Cliquez sur un pion pour changer sa couleur parmi les 6 disponibles.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleRandomizeMastermind}
                    className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-cyan-300 border border-stone-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Dices className="w-3.5 h-3.5" />
                    Aléatoire
                  </button>
                </div>

                {/* Affichage interactif des 5 pions secrets */}
                <div className="flex items-center justify-center gap-3 py-2">
                  {mastermindSecretDraft.map((colorId, idx) => {
                    const def = getColorDef(colorId);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleCycleSecretColor(idx)}
                        className={`w-14 h-16 rounded-xl border-2 ${def.bgClass} ${def.borderClass} flex flex-col items-center justify-center text-white cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-md`}
                        title={`Zone ${idx + 1} : ${def.label} (cliquez pour changer)`}
                      >
                        <span className="text-base font-bold drop-shadow">{def.symbol}</span>
                        <span className="text-[10px] font-mono font-bold tracking-tight">
                          {def.label}
                        </span>
                        <span className="text-[9px] text-white/70">#{idx + 1}</span>
                      </button>
                    );
                  })}
                </div>

                {mastermindSuccessMsg && (
                  <span className="text-xs text-emerald-400 font-mono flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Nouvelle séquence secrète enregistrée !
                  </span>
                )}
              </div>

              {/* Actions de contrôle du Maître du Jeu */}
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider font-mono">
                  Contrôle de la session en direct
                </h4>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="font-mono text-stone-400">
                    Tentatives effectuées par les joueurs :{' '}
                    <strong className="text-cyan-400 font-bold">{mastermindConfig.attempts.length}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {!mastermindConfig.isSolved ? (
                      <button
                        type="button"
                        onClick={onForceSolveMastermind}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow transition-colors"
                        title="Bypasse le Mastermind si les joueurs ont du mal"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Valider pour les joueurs (Bypass MJ)
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Déjà résolu par les joueurs
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={onResetMastermindGame}
                      className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold border border-stone-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                      title="Efface l'historique et reverrouille le Mastermind"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Réinitialiser la partie
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ONGLET 4 : PERSONNALISATION DU TESTAMENT */}
          {activeTab === 'testament' && (
            <form onSubmit={handleSaveTestament} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Titre officiel du document
                  </label>
                  <input
                    type="text"
                    value={testamentDraft.title}
                    onChange={(e) => setTestamentDraft({ ...testamentDraft, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                    placeholder="ACTE DE DERNIÈRES VOLONTÉS & TESTAMENT DU MAIRE"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Nom du Défunt / Testateur
                  </label>
                  <input
                    type="text"
                    value={testamentDraft.deceasedName}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setTestamentDraft({
                        ...testamentDraft,
                        deceasedName: newName,
                        signatory: testamentDraft.signatory === testamentDraft.deceasedName ? newName : testamentDraft.signatory
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                    placeholder="Jean-Luc Le Guennec, Maire de Ploemel"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Signataire officiel (Signature en bas)
                  </label>
                  <input
                    type="text"
                    value={testamentDraft.signatory}
                    onChange={(e) => setTestamentDraft({ ...testamentDraft, signatory: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-amber-600/70 text-xs text-amber-300 font-semibold focus:outline-none focus:border-amber-400"
                    placeholder="Jean-Luc Le Guennec, Maire de Ploemel"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Nom du Notaire / Étude
                  </label>
                  <input
                    type="text"
                    value={testamentDraft.notaryName}
                    onChange={(e) => setTestamentDraft({ ...testamentDraft, notaryName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                    placeholder="Maître Tanguy Le Bihan, Notaire à Auray"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Ville et Date de l'acte
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={testamentDraft.city}
                      onChange={(e) => setTestamentDraft({ ...testamentDraft, city: e.target.value })}
                      className="w-1/2 px-2.5 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                      placeholder="Ploemel (Morbihan)"
                    />
                    <input
                      type="text"
                      value={testamentDraft.date}
                      onChange={(e) => setTestamentDraft({ ...testamentDraft, date: e.target.value })}
                      className="w-1/2 px-2.5 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                      placeholder="24 Octobre 2024"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Introduction / Préambule solennel
                </label>
                <textarea
                  rows={3}
                  value={testamentDraft.introduction}
                  onChange={(e) => setTestamentDraft({ ...testamentDraft, introduction: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Gestion des dispositions testamentaires */}
              <div className="border border-stone-800 rounded-xl p-3 bg-stone-950/60">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xs font-bold text-stone-200 uppercase tracking-wider">
                      Dispositions testamentaires & Legs aux héritiers ({testamentDraft.bequests.length})
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      Chaque legs peut contenir un indice, un objet d'intrigue ou une clause suspensive.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddBequest}
                    className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Ajouter un legs
                  </button>
                </div>

                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {testamentDraft.bequests.map((bequest, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-stone-900 border border-stone-800 space-y-2 relative"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono font-bold text-amber-400">
                          Legs #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBequest(idx)}
                          className="p-1 text-stone-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Supprimer ce legs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-stone-400 block mb-0.5">Bénéficiaire</label>
                          <input
                            type="text"
                            value={bequest.beneficiary}
                            onChange={(e) => handleUpdateBequest(idx, 'beneficiary', e.target.value)}
                            className="w-full px-2 py-1.5 rounded bg-stone-950 border border-stone-700 text-xs text-stone-100"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-stone-400 block mb-0.5">Objet / Bien légué</label>
                          <input
                            type="text"
                            value={bequest.item}
                            onChange={(e) => handleUpdateBequest(idx, 'item', e.target.value)}
                            className="w-full px-2 py-1.5 rounded bg-stone-950 border border-stone-700 text-xs text-stone-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-stone-400 block mb-0.5">Condition suspensive (optionnelle)</label>
                        <input
                          type="text"
                          value={bequest.condition || ''}
                          onChange={(e) => handleUpdateBequest(idx, 'condition', e.target.value)}
                          className="w-full px-2 py-1.5 rounded bg-stone-950 border border-stone-700 text-xs text-rose-300/90"
                          placeholder="Ex: À la condition de ne jamais céder ces terres à un promoteur..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Révélation Secrète (Le rebondissement capital sur le meurtre du maire !)
                </label>
                <textarea
                  rows={3}
                  value={testamentDraft.secretRevelation}
                  onChange={(e) => setTestamentDraft({ ...testamentDraft, secretRevelation: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs text-amber-200 focus:outline-none focus:border-amber-400 font-mono"
                  placeholder="Ex: Le promoteur immobilier m'a menacé de mort après mon refus..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Avertissement solennel
                </label>
                <input
                  type="text"
                  value={testamentDraft.warningNote}
                  onChange={(e) => setTestamentDraft({ ...testamentDraft, warningNote: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  placeholder="Prenez garde : le complice se trouve parmi les membres du conseil municipal..."
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
                >
                  Enregistrer les modifications du testament
                </button>

                {testamentSuccessMsg && (
                  <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Testament et signataire enregistrés !
                  </span>
                )}
              </div>
            </form>
          )}

          {/* ONGLET 5 : INDICES D'ENQUÊTE */}
          {activeTab === 'clues' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-stone-200 uppercase tracking-wider">
                    Indices de l'enquête pour deviner le code
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    Ces documents et notes sont consultables par les joueurs dans le dossier d'enquête.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddClue}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Ajouter un indice
                </button>
              </div>

              <div className="space-y-3">
                {cluesDraft.map((clue, idx) => (
                  <div
                    key={clue.id}
                    className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-stone-800 border border-stone-700 text-amber-400 font-mono text-[11px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={clue.title}
                          onChange={(e) => {
                            const updated = [...cluesDraft];
                            updated[idx] = { ...clue, title: e.target.value };
                            setCluesDraft(updated);
                          }}
                          className="px-2 py-1 rounded bg-stone-900 border border-stone-700 text-xs font-bold text-stone-100"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...cluesDraft];
                            updated[idx] = { ...clue, discovered: !clue.discovered };
                            setCluesDraft(updated);
                            onUpdateClues(updated);
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border cursor-pointer ${
                            clue.discovered
                              ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                              : 'bg-stone-900 border-stone-700 text-stone-400'
                          }`}
                        >
                          {clue.discovered ? 'Déjà découvert' : 'Masqué (à fouiller)'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveClue(clue.id)}
                          className="p-1 text-stone-500 hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={clue.subtitle}
                        onChange={(e) => {
                          const updated = [...cluesDraft];
                          updated[idx] = { ...clue, subtitle: e.target.value };
                          setCluesDraft(updated);
                        }}
                        placeholder="Emplacement (ex: Bureau du Maire)"
                        className="px-2 py-1 rounded bg-stone-900 border border-stone-800 text-xs text-stone-300"
                      />

                      <select
                        value={clue.hintLevel}
                        onChange={(e) => {
                          const updated = [...cluesDraft];
                          updated[idx] = { ...clue, hintLevel: e.target.value as 'subtle' | 'medium' | 'direct' };
                          setCluesDraft(updated);
                        }}
                        className="px-2 py-1 rounded bg-stone-900 border border-stone-800 text-xs text-stone-300"
                      >
                        <option value="subtle">Énigme subtile</option>
                        <option value="medium">Indice moyen</option>
                        <option value="direct">Solution directe</option>
                      </select>
                    </div>

                    <textarea
                      rows={2}
                      value={clue.content}
                      onChange={(e) => {
                        const updated = [...cluesDraft];
                        updated[idx] = { ...clue, content: e.target.value };
                        setCluesDraft(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded bg-stone-900 border border-stone-800 text-xs font-mono text-stone-200"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleSaveClues}
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
                >
                  Appliquer les indices aux joueurs
                </button>

                {cluesSuccessMsg && (
                  <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Indices mis à jour !
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ONGLET 6 : PRÉRÉGLAGES DE SCÉNARIOS */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-400">
                Activez en 1 clic un scénario complet avec tous ses indices, son testament et sa combinaison.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DEFAULT_SCENARIOS.map((preset) => (
                  <div
                    key={preset.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between transition-colors ${
                      preset.id === 'ploemel-murder'
                        ? 'bg-amber-950/20 border-amber-600/70'
                        : 'bg-stone-950 border-stone-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-bold text-sm text-stone-100">{preset.name}</h4>
                        <span className="px-2 py-0.5 rounded bg-stone-800 text-[11px] font-mono font-bold text-amber-300">
                          Code : {preset.code}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 leading-relaxed mb-3">
                        {preset.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onLoadPreset(preset);
                        setCodeDraft(preset.code);
                        setScenarioDraft({
                          name: preset.name,
                          subtitle: preset.subtitle || '',
                          safeRef: preset.safeRef || '',
                          safeLabel: preset.safeLabel || ''
                        });
                        setTestamentDraft({ ...preset.testament });
                        setCluesDraft([...preset.clues]);
                      }}
                      className="w-full py-1.5 px-3 rounded-lg bg-stone-800 hover:bg-amber-500 hover:text-slate-950 text-xs font-semibold text-stone-200 transition-colors cursor-pointer"
                    >
                      Charger "{preset.name}"
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pied de la console MJ */}
        <div className="p-3 border-t border-stone-800 bg-stone-950 flex items-center justify-between text-xs text-stone-400 font-mono shrink-0">
          <span className="flex items-center gap-1.5 text-stone-400">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            Pensez à cliquer sur "Verrouiller" avant de confier l'écran aux joueurs.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold cursor-pointer transition-colors"
          >
            Fermer la console
          </button>
        </div>
      </div>
    </div>
  );
};
