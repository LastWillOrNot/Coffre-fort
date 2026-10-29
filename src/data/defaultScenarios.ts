import { ScenarioPreset } from '../types/game';

export const DEFAULT_SCENARIOS: ScenarioPreset[] = [
  {
    id: 'ploemel-murder',
    name: 'Meurtre à Ploemel',
    subtitle: 'Hôtel de Ville de Ploemel · Coffre-fort du cabinet du Maire',
    safeRef: 'REF : MAIRIE-PLOEMEL-2024',
    safeLabel: 'COFFRE MUNICIPAL BLINDÉ · CABINET DU MAIRE',
    theme: 'noir',
    description: 'Le maire de la commune de Ploemel a été retrouvé assassiné dans son bureau. Son coffre-fort officiel dissimule son testament et ses dernières révélations explosives.',
    code: '5640',
    testament: {
      title: 'ACTE DE DERNIÈRES VOLONTÉS & TESTAMENT DU MAIRE',
      deceasedName: 'Jean-Luc Le Guennec, Maire de Ploemel',
      notaryName: 'Maître Tanguy Le Bihan, Notaire à Auray',
      city: 'Hôtel de Ville de Ploemel (Morbihan)',
      date: '24 Octobre 2024',
      introduction: 'Moi soussigné Jean-Luc Le Guennec, Maire de la commune de Ploemel, me sachant gravement menacé depuis mes récentes décisions sur le plan local d\'urbanisme, rédige en pleine conscience ces dispositions testamentaires. Si ma disparition survient de manière violente, sachez qu\'elle est directement liée aux dossiers fonciers de la commune.',
      bequests: [
        {
          beneficiary: 'À la commune de Ploemel et à ses administrés',
          item: 'Le domaine boisé de Mane-Bogad et mes archives personnelles.',
          condition: 'À la condition expresse que ces terres restent inconstructibles et protégées à perpétuité.'
        },
        {
          beneficiary: 'À mon adjointe municipale Hélène',
          item: 'Mon carnet de notes confidentiel déposé au coffre de l\'étude notariale d\'Auray.',
          condition: 'Pour qu\'elle poursuive les enquêtes citoyennes sans céder aux pressions financières.'
        },
        {
          beneficiary: 'Aux officiers et enquêteurs chargés d\'élucider mon décès',
          item: 'La clé USB chiffrée dissimulée sous le double fond du registre d\'état civil.',
          condition: 'Elle contient les enregistrements audio des chantages et pressions exercées sur la municipalité.'
        }
      ],
      secretRevelation: 'Le projet d\'aménagement immobilier de la zone littorale dissimule un réseau de corruption. Un membre influent du conseil municipal et un promoteur sans scrupule ont juré de m\'abattre si je refusais de signer le permis modificatif. Mon refus a été signé ce matin.',
      warningNote: 'Prenez garde : les complices de cet assassinat sont encore en liberté dans la commune et surveillent chaque visiteur.',
      signatory: 'Jean-Luc Le Guennec, Maire de Ploemel'
    },
    clues: [
      {
        id: 'clue-ploemel-1',
        title: 'L\'agenda officiel du Maire',
        subtitle: 'Trouvé ouvert sur le bureau sous des paraphes',
        content: '« Mémo personnel de Jean-Luc :\nPour le coffre de sécurité du cabinet, retenir les quatre premiers chiffres du code postal de notre commune de Ploemel (56400).\nSoit la combinaison : 5 - 6 - 4 - 0. »',
        hintLevel: 'subtle',
        discovered: true,
        type: 'riddle'
      },
      {
        id: 'clue-ploemel-2',
        title: 'Un message de menace manuscrit',
        subtitle: 'Glissé sous la porte de la mairie la veille du drame',
        content: '« Monsieur le Maire,\nVotre obstination sur le dossier foncier causera votre perte. Pensez-vous vraiment que votre coffre à 4 chiffres (5640) protégera vos documents compromettants ? Cédez tant qu\'il en est encore temps. »',
        hintLevel: 'medium',
        discovered: false,
        type: 'letter'
      },
      {
        id: 'clue-ploemel-3',
        title: 'Le Post-it de secours du secrétaire général',
        subtitle: 'Collé au dos du cadre photo républicain',
        content: '« Combinaison d\'urgence coffre du Maire : 5 6 4 0 (Valider avec la touche #). En cas d\'absence prolongée, avertir la préfecture. »',
        hintLevel: 'direct',
        discovered: false,
        type: 'note'
      }
    ]
  },
  {
    id: 'manor-saint-armand',
    name: "L'Étrange Héritage des Saint-Armand",
    subtitle: 'Château des Brumes · Cabinet secret du Baron',
    safeRef: 'REF : VAULT-ST-ARMAND',
    safeLabel: 'COFFRE BLINDÉ HAUTE SÉCURITÉ · CLASSE IV',
    theme: 'victorian',
    description: 'Une enquête dans un manoir ancien. Le vieux baron Barthélémy a dissimulé la combinaison dans ses écrits personnels.',
    code: '1894',
    testament: {
      title: 'ACTE DE DERNIÈRES VOLONTÉS & TESTAMENT AUTHENTIQUE',
      deceasedName: 'Baron Barthélémy de Saint-Armand',
      notaryName: 'Maître Auguste Valois, Notaire',
      city: 'Château des Brumes',
      date: '14 Octobre 1923',
      introduction: 'Devant Dieu et devant les hommes, en pleine possession de mes facultés intellectuelles mais sentant mes forces décliner, je soussigné Barthélémy Charles Édouard, Baron de Saint-Armand, consigne ici mes dispositions testamentaires ultimes.',
      bequests: [
        {
          beneficiary: 'À mon unique héritier du sang',
          item: 'Le domaine viticole et les terres du Château.',
          condition: 'À la condition expresse de ne jamais vendre l\'aile nord avant d\'avoir exploré ses souterrains.'
        },
        {
          beneficiary: 'À mon fidèle majordome Barnabé',
          item: 'Une rente viagère de douze mille francs or et le petit cottage près du moulin.',
          condition: 'Pour son dévouement et son silence durant quarante années de tourments.'
        }
      ],
      secretRevelation: 'Éléonore n\'a pas succombé à une maladie naturelle. Elle a été empoisonnée par un membre de notre propre famille.',
      warningNote: 'Celui ou celle qui a ôté la vie à Éléonore sait que vous fouillez ces lieux. Ne tournez le dos à personne.',
      signatory: 'Barthélémy, Baron de Saint-Armand'
    },
    clues: [
      {
        id: 'clue-1',
        title: 'Le carnet de cuir noir',
        subtitle: 'Trouvé sur le secrétaire en acajou du bureau',
        content: '« Mon premier chiffre est 1, mon second est 8, mon troisième est 9 et mon dernier est 4 (1894). »',
        hintLevel: 'subtle',
        discovered: true,
        type: 'riddle'
      }
    ]
  }
];
