import type { Voiture } from '@/types'

const checklistGenerique: string[] = [
  "Vérifier le carnet d'entretien complet (factures, tampons)",
  "Contrôler la cohérence du kilométrage avec l'usure générale",
  'Demander un rapport Histovec (historique officiel du véhicule)',
  'Inspecter la carrosserie : impacts, micro-rayures, rouille sous caisse',
  "Vérifier l'alignement des jours entre les éléments de carrosserie",
  'Allumer tous les voyants au démarrage et contrôler leur extinction',
  'Tester la climatisation (chaud et froid)',
  'Vérifier le niveau et la couleur du liquide de refroidissement',
  "Contrôler le niveau d'huile moteur (couleur, consistance)",
  'Inspecter les pneus : usure, déformation, concordance des 4 pneus',
  'Tester les freins : mordant, vibrations, tenue en ligne',
  'Écouter les bruits anormaux au démarrage et en roulant',
  'Tester toutes les vitres, rétroviseurs et verrouillages',
  "Vérifier le fonctionnement des airbags (pas de voyant allumé)",
  'Faire un essai sur autoroute : bruit de vent, vibrations, tenue de cap',
  "Effectuer un diagnostic OBD (codes d'erreur cachés)",
  "Contrôler l'état de la batterie (surtout si >3 ans)",
  "Vérifier l'état de la courroie de distribution ou chaîne (selon moteur)",
]

export const voitures: Voiture[] = [
  {
    id: 'volkswagen-golf-7',
    marque: 'Volkswagen',
    modele: 'Golf 7',
    annees: '2012–2020',
    segment: 'Compacte',
    poids: 1205,
    motorisations: [
      {
        slug: '10-tsi-85ch',
        designation: '1.0 TSI 85ch',
        type: 'essence',
        puissance: 85,
        consommationOfficielle: 5.1,
        boites: [{ slug: 'bvm5', designation: 'BVM5', type: 'manuelle' }],
      },
      {
        slug: '10-tsi-115ch',
        designation: '1.0 TSI 115ch',
        type: 'essence',
        puissance: 115,
        consommationOfficielle: 5.4,
        boites: [{ slug: 'bvm6', designation: 'BVM6', type: 'manuelle' }],
      },
      {
        slug: '15-tsi-130ch',
        designation: '1.5 TSI 130ch',
        type: 'essence',
        puissance: 130,
        consommationOfficielle: 5.8,
        boites: [
          { slug: 'bvm6', designation: 'BVM6', type: 'manuelle' },
          { slug: 'dsg7', designation: 'DSG7', type: 'dsg', consommationOfficielle: 5.6 },
        ],
      },
      {
        slug: '16-tdi-90ch',
        designation: '1.6 TDI 90ch',
        type: 'diesel',
        puissance: 90,
        couple: 230,
        consommationOfficielle: 4.0,
        consommationReelle: 5.5,
        boites: [
          { slug: 'bvm5', designation: 'BVM5', type: 'manuelle' },
          { slug: 'dsg6', designation: 'DSG6', type: 'dsg', consommationOfficielle: 4.3 },
        ],
        fiabilite: {
          note: 4,
          avis:
            "Le 1.6 TDI est l'un des moteurs diesel les plus fiables de la gamme Golf. Robuste et économique, il souffre surtout du FAP sur les courtes distances. La version BVM5 est plus endurante que la DSG6.",
          problemesConnus: [
            "Filtre à particules (FAP) encrassé sur les trajets <20 km",
            "Vanne EGR grippée après 100 000 km",
            "Fuite de liquide de refroidissement joint de culasse (rare, <80 000 km)",
            "Capteur de pression de rampe d'injection (>150 000 km)",
          ],
        },
        cotes: [
          { label: '2012–2015, 100–150 000 km', prixBas: 7500, prixMoyen: 9500, prixHaut: 12000 },
          { label: '2015–2018, 60–100 000 km', prixBas: 10000, prixMoyen: 13000, prixHaut: 16000 },
          { label: '2018–2020, <60 000 km', prixBas: 14000, prixMoyen: 17000, prixHaut: 20000 },
        ],
        checklistSpecifique: [
          'Vérifier la couleur de la fumée au démarrage à froid (fumée bleue = huile)',
          'Contrôler si le voyant FAP est déjà apparu (historique du tableau de bord)',
          "Tester la régénération du FAP : faire un essai sur route à >60 km/h pendant 20 min",
          "Vérifier l'état de la vanne EGR (nettoyage récent dans le carnet ?)",
          "Demander si des injections de produit nettoyant ont été faites",
        ],
        options: [
          {
            nom: 'Radar de recul',
            description: 'Capteurs de stationnement arrière',
            importance: 'interessante',
            avis: "Utile au quotidien, vérifier le bon fonctionnement des 4 capteurs lors de la visite.",
          },
          {
            nom: 'GPS natif',
            description: "Système de navigation d'origine",
            importance: 'inutile',
            avis: "Vieilli et lent. Préférez CarPlay/Android Auto si disponible, ou un support téléphone.",
          },
          {
            nom: 'Régulateur de vitesse adaptatif',
            description: 'ACC avec maintien de distance',
            importance: 'interessante',
            avis: "Appréciable sur autoroute. Vérifier le bon fonctionnement du radar avant.",
          },
        ],
        potentielReprog: {
          typeMoteur: 'turbo',
          avisGeneral:
            "Le 1.6 TDI répond bien à la reprog — gains modérés mais réels, surtout en couple. Améliore la souplesse en ville sans dégrader la fiabilité si réalisée sérieusement.",
          stages: [
            {
              nom: 'Stage 1',
              puissanceGain: 25,
              coupleGain: 60,
              puissanceFinal: 115,
              coupleFinal: 310,
              cout: '300 – 500 €',
              avis: "Bon rapport qualité/prix. Le moteur gagne vraiment en souplesse. À faire chez un préparateur reconnu uniquement.",
            },
            {
              nom: 'Stage 2',
              puissanceGain: 35,
              coupleGain: 80,
              puissanceFinal: 125,
              coupleFinal: 330,
              cout: '800 – 1 200 €',
              avis: "Nécessite échangeur et modifications. Peu pertinent sur ce moteur — préférez le Stage 1.",
            },
          ],
          recommandation: 'selon_usage',
          raisonRecommandation:
            "Stage 1 intéressant pour un usage quotidien — le couple supplémentaire se ressent vraiment. Stage 2 non recommandé sur ce moteur.",
        },
      },
      {
        slug: '20-tdi-150ch',
        designation: '2.0 TDI 150ch',
        type: 'diesel',
        puissance: 150,
        couple: 340,
        consommationOfficielle: 4.5,
        consommationReelle: 6.2,
        boites: [
          { slug: 'bvm6', designation: 'BVM6', type: 'manuelle' },
          { slug: 'dsg6', designation: 'DSG6', type: 'dsg', consommationOfficielle: 4.7 },
        ],
        fiabilite: {
          note: 3,
          avis:
            "Le 2.0 TDI 150ch est puissant et agréable, mais il nécessite un entretien rigoureux. La boîte DSG6 est un point de fragilité connu. Recommandé uniquement avec carnet d'entretien complet chez VW.",
          problemesConnus: [
            "Boîte DSG6 (wet clutch) : saccades et glissement si huile non changée",
            "Turbo fragilisé par manque d'huile ou sur-régime",
            "Injecteurs à contrôler à partir de 150 000 km",
            "FAP et EGR : mêmes problèmes que le 1.6 TDI",
          ],
        },
        cotes: [
          { label: '2013–2016, 120–180 000 km', prixBas: 9000, prixMoyen: 12000, prixHaut: 15000 },
          { label: '2016–2019, 60–120 000 km', prixBas: 13000, prixMoyen: 17000, prixHaut: 21000 },
          { label: '2019–2020, <70 000 km', prixBas: 18000, prixMoyen: 22000, prixHaut: 26000 },
        ],
        checklistSpecifique: [
          "Vérifier le carnet d'entretien de la boîte DSG (vidange huile tous les 60 000 km)",
          'Tester la DSG à froid : pas de saccades, pas de patinage au démarrage',
          "Contrôler l'état du turbo : pas de jeu axial, pas de fumée bleue",
          "Vérifier l'étanchéité des injecteurs (traces de gasoil ?)",
        ],
        options: [
          {
            nom: 'DSG7 (boîte automatique)',
            description: 'Boîte à double embrayage 7 rapports',
            importance: 'interessante',
            avis: "Confortable mais surveiller les saccades à froid. Préférez la BVM6 si vous aimez conduire.",
          },
          {
            nom: 'Phares full LED',
            description: 'Éclairage LED adaptatif',
            importance: 'interessante',
            avis: "Vraie différence de sécurité la nuit. À privilégier si disponible.",
          },
          {
            nom: 'Toit ouvrant panoramique',
            description: 'Toit vitré électrique',
            importance: 'inutile',
            avis: "Source de pannes potentielles sur les exemplaires anciens. Tester l'ouverture/fermeture lors de la visite.",
          },
        ],
        potentielReprog: {
          typeMoteur: 'turbo',
          avisGeneral:
            "Le 2.0 TDI est une base excellente pour la reprog. Gains significatifs en puissance et couple avec un impact minimal sur la fiabilité si réalisée correctement.",
          stages: [
            {
              nom: 'Stage 1',
              puissanceGain: 40,
              coupleGain: 80,
              puissanceFinal: 190,
              coupleFinal: 420,
              cout: '350 – 600 €',
              avis: "Très recommandé. Le moteur passe dans une autre dimension en souplesse et reprise. ROI excellent.",
            },
            {
              nom: 'Stage 2',
              puissanceGain: 60,
              coupleGain: 110,
              puissanceFinal: 210,
              coupleFinal: 450,
              cout: '900 – 1 500 €',
              avis: "Possible avec échangeur et downpipe. Risque accru sur l'embrayage et la boîte DSG. Réservé aux passionnés.",
            },
          ],
          recommandation: 'oui',
          raisonRecommandation:
            "Le 2.0 TDI est l'un des meilleurs moteurs à reprogrammer. Stage 1 fortement recommandé pour quiconque veut plus de dynamisme sans sacrifier la fiabilité.",
        },
      },
    ],
    fiabilite: {
      note: 4,
      avisGeneral:
        "La Golf 7 est l'une des compactes les plus fiables du marché. Construite avec soin, elle vieillit bien à condition de respecter les entretiens. Les diesels TDI sont solides mais nécessitent une attention au filtre à particules.",
      pointsSensibles: [
        'Boîte DSG7 sujette à des saccades à froid sur les premières années',
        'Distribution à chaîne : bruit au démarrage sur les 1.4 TSI',
        'Pompe à eau sur les 1.2/1.4 TSI (à vérifier à 80 000 km)',
        'Filtre à particules encrassé sur les diesels de courtes distances',
      ],
      pannesFrequentes: [
        'Sonde lambda défaillante (essence)',
        'Injecteurs sur les TDI (>150 000 km)',
        'Capteurs de stationnement HS',
        'Fuite de liquide de refroidissement (joint de culasse 1.6 TDI)',
      ],
    },
    checklist: checklistGenerique,
  },

  {
    id: 'renault-clio-4',
    marque: 'Renault',
    modele: 'Clio 4',
    annees: '2012–2019',
    segment: 'Citadine',
    poids: 1095,
    motorisations: [
      {
        slug: '09-tce-75ch',
        designation: '0.9 TCe 75ch',
        type: 'essence',
        puissance: 75,
        consommationOfficielle: 4.7,
        boites: [{ slug: 'bvm5', designation: 'BVM5', type: 'manuelle' }],
      },
      {
        slug: '09-tce-90ch',
        designation: '0.9 TCe 90ch',
        type: 'essence',
        puissance: 90,
        couple: 135,
        consommationOfficielle: 4.9,
        consommationReelle: 6.2,
        boites: [
          { slug: 'bvm5', designation: 'BVM5', type: 'manuelle' },
          { slug: 'edc6', designation: 'EDC6', type: 'edc', consommationOfficielle: 5.1 },
        ],
        fiabilite: {
          note: 2,
          avis:
            "Le 0.9 TCe 90ch est le moteur le plus vendu de la Clio 4, mais aussi le plus problématique. La consommation d'huile excessive et les défaillances du calculateur en font une motorisation à risque, surtout sur les premiers millésimes (2012–2015).",
          problemesConnus: [
            "Consommation d'huile excessive (1 litre / 3 000 km fréquent)",
            "Calculateur moteur (ECU) défaillant : voyants intempestifs",
            "Turbocompresseur fragilisé par la consommation d'huile",
            "Boîte EDC6 : saccades, patinage, coûteuse à remplacer",
            "Surchauffe du moteur si niveau d'huile non vérifié régulièrement",
          ],
        },
        cotes: [
          { label: '2012–2015, 80–130 000 km', prixBas: 5000, prixMoyen: 7000, prixHaut: 9000 },
          { label: '2015–2018, 50–90 000 km', prixBas: 7500, prixMoyen: 9500, prixHaut: 12000 },
        ],
        checklistSpecifique: [
          "Vérifier impérativement le niveau d'huile (avant et après le démarrage)",
          "Demander les factures de vidange : fréquence et volume d'huile ajouté",
          "Chercher des traces de fumée bleue à l'échappement (brûle de l'huile)",
          "Faire un essai à froid : écouter les claquements moteur",
          "Scanner l'ECU : vérifier les codes d'erreur effacés récemment",
        ],
        options: [
          {
            nom: 'Climatisation automatique',
            description: 'Climatisation bi-zone automatique',
            importance: 'interessante',
            avis: "Confort réel. Tester le compresseur lors de la visite.",
          },
          {
            nom: 'GPS R-Link',
            description: 'Système multimédia Renault intégré',
            importance: 'inutile',
            avis: "Très vieilli et peu réactif. Ignorez-le, un support téléphone avec CarPlay vaut bien mieux.",
          },
        ],
        potentielReprog: {
          typeMoteur: 'turbo',
          avisGeneral:
            "Le 0.9 TCe est reprogrammable mais les gains restent limités par la petite taille du turbo. Intérêt modéré sur une citadine.",
          stages: [
            {
              nom: 'Stage 1',
              puissanceGain: 15,
              coupleGain: 30,
              puissanceFinal: 105,
              coupleFinal: 175,
              cout: '250 – 400 €',
              avis: "Gain perceptible en ville mais modeste. À faire uniquement si vous gardez longtemps le véhicule.",
            },
          ],
          recommandation: 'selon_usage',
          raisonRecommandation:
            "Intérêt limité sur une citadine. Budget mieux investi dans l'entretien ou des pneumatiques de qualité.",
        },
      },
      {
        slug: '12-tce-120ch',
        designation: '1.2 TCe 120ch',
        type: 'essence',
        puissance: 120,
        consommationOfficielle: 5.7,
        boites: [{ slug: 'bvm6', designation: 'BVM6', type: 'manuelle' }],
      },
      {
        slug: '15-dci-75ch',
        designation: '1.5 dCi 75ch',
        type: 'diesel',
        puissance: 75,
        consommationOfficielle: 3.5,
        boites: [{ slug: 'bvm5', designation: 'BVM5', type: 'manuelle' }],
      },
      {
        slug: '15-dci-90ch',
        designation: '1.5 dCi 90ch',
        type: 'diesel',
        puissance: 90,
        couple: 220,
        consommationOfficielle: 3.8,
        consommationReelle: 5.0,
        boites: [
          { slug: 'bvm5', designation: 'BVM5', type: 'manuelle' },
          { slug: 'edc6', designation: 'EDC6', type: 'edc', consommationOfficielle: 4.0 },
        ],
        fiabilite: {
          note: 4,
          avis:
            "Le 1.5 dCi 90ch est la motorisation la plus fiable de la Clio 4. Ce moteur K9K est éprouvé depuis des années chez Renault. Économique et robuste, il représente le meilleur compromis pour une Clio d'occasion.",
          problemesConnus: [
            "Courroie de distribution : à changer impérativement à 120 000 km",
            "Injecteurs en fin de vie au-delà de 200 000 km",
            "FAP bouché si utilisé uniquement en ville",
            "Pompe à injection défaillante (rare, >180 000 km)",
          ],
        },
        cotes: [
          { label: '2012–2015, 100–150 000 km', prixBas: 6000, prixMoyen: 8000, prixHaut: 10500 },
          { label: '2015–2018, 60–100 000 km', prixBas: 8500, prixMoyen: 11000, prixHaut: 13500 },
        ],
        checklistSpecifique: [
          'Demander la date de remplacement de la courroie de distribution',
          "Vérifier l'état du FAP : pas de voyant, essai de régénération sur route",
          'Contrôler la couleur de la fumée au démarrage à froid',
          "Tester la puissance : pas de trou à mi-régime (signe d'injecteur défaillant)",
        ],
      },
    ],
    fiabilite: {
      note: 3,
      avisGeneral:
        "La Clio 4 est agréable à conduire mais sa fiabilité est inégale selon les motorisations. Le 0.9 TCe peut être capricieux, tandis que le 1.5 dCi est robuste. L'électronique vieillissante peut causer des soucis.",
      pointsSensibles: [
        "Moteur 0.9 TCe : consommation d'huile et surchauffe possible",
        'Boîte EDC à double embrayage peu fiable sur les premières séries',
        'Tableau de bord : écrans et boutons défaillants',
        'Rouilles précoces sur les bas de caisse si mal entretenu',
      ],
      pannesFrequentes: [
        'Calculateur moteur défaillant (0.9 TCe)',
        'Embrayage double EDC usé prématurément',
        'Capteur de pression de suralimentation',
        "Feux arrière infiltrés par l'eau",
      ],
    },
    checklist: checklistGenerique,
  },

  {
    id: 'peugeot-308-2',
    marque: 'Peugeot',
    modele: '308 II',
    annees: '2013–2021',
    segment: 'Compacte',
    poids: 1210,
    motorisations: [
      {
        slug: '12-puretech-110ch',
        designation: '1.2 PureTech 110ch',
        type: 'essence',
        puissance: 110,
        consommationOfficielle: 5.3,
        boites: [{ slug: 'bvm6', designation: 'BVM6', type: 'manuelle' }],
      },
      {
        slug: '12-puretech-130ch',
        designation: '1.2 PureTech 130ch',
        type: 'essence',
        puissance: 130,
        couple: 230,
        consommationOfficielle: 5.6,
        consommationReelle: 7.0,
        boites: [
          { slug: 'bvm6', designation: 'BVM6', type: 'manuelle' },
          { slug: 'eat6', designation: 'EAT6', type: 'automatique', consommationOfficielle: 5.9 },
        ],
        fiabilite: {
          note: 2,
          avis:
            "Le 1.2 PureTech 130ch est le moteur le plus problématique de la gamme 308 II. La courroie de distribution en caoutchouc baignant dans l'huile est réputée pour se dégrader prématurément. Les véhicules produits avant 2017 sont particulièrement à risque. À éviter sans facture de remplacement de courroie.",
          problemesConnus: [
            "Courroie de distribution : casse possible avant 60 000 km sur les millésimes 2013–2016",
            "Joint de culasse : fuite de liquide de refroidissement (campagne de rappel Stellantis)",
            "Vanne EGR encrassée sur les versions précédant la refonte 2017",
            "Boîte EAT6 : vibrations à basse vitesse et en marche arrière",
          ],
        },
        cotes: [
          { label: '2013–2017, 80–130 000 km', prixBas: 8000, prixMoyen: 10500, prixHaut: 13000 },
          { label: '2017–2020, 40–90 000 km', prixBas: 11500, prixMoyen: 14500, prixHaut: 18000 },
        ],
        checklistSpecifique: [
          "PRIORITÉ : Exiger la facture de remplacement de la courroie de distribution",
          "Si millésime avant 2017 : refuser d'acheter sans facture de courroie récente",
          "Vérifier le niveau de liquide de refroidissement (joint de culasse)",
          "Contrôler les joints côté culasse : traces de mousse ou de fuite",
          "Tester la boîte EAT6 : pas de vibrations ni de ratés au démarrage",
        ],
      },
      {
        slug: '16-thp-205ch',
        designation: '1.6 THP 205ch',
        type: 'essence',
        puissance: 205,
        consommationOfficielle: 7.5,
        boites: [{ slug: 'bvm6', designation: 'BVM6', type: 'manuelle' }],
      },
      {
        slug: '15-bluehdi-100ch',
        designation: '1.5 BlueHDi 100ch',
        type: 'diesel',
        puissance: 100,
        consommationOfficielle: 3.8,
        boites: [{ slug: 'bvm6', designation: 'BVM6', type: 'manuelle' }],
      },
      {
        slug: '20-bluehdi-150ch',
        designation: '2.0 BlueHDi 150ch',
        type: 'diesel',
        puissance: 150,
        couple: 370,
        consommationOfficielle: 4.3,
        consommationReelle: 5.8,
        boites: [
          { slug: 'bvm6', designation: 'BVM6', type: 'manuelle' },
          { slug: 'eat6', designation: 'EAT6', type: 'automatique', consommationOfficielle: 4.6 },
        ],
        fiabilite: {
          note: 4,
          avis:
            "Le 2.0 BlueHDi 150ch est la motorisation la plus aboutie de la 308 II. Puissant et sobre, ce diesel se comporte bien dans le temps à condition de l'utiliser sur de longs trajets. La boîte EAT6 est agréable mais nécessite une vidange régulière.",
          problemesConnus: [
            "FAP (filtre à particules) : régénération difficile sur trajets courts",
            "Boîte EAT6 : huile à changer tous les 60 000 km minimum",
            "Sonde de température des gaz d'échappement (>150 000 km)",
            "Filtre gazole colmaté si mauvaise qualité de carburant",
          ],
        },
        cotes: [
          { label: '2014–2017, 100–160 000 km', prixBas: 10000, prixMoyen: 13000, prixHaut: 16000 },
          { label: '2017–2020, 60–110 000 km', prixBas: 14000, prixMoyen: 17500, prixHaut: 21000 },
        ],
        checklistSpecifique: [
          "Vérifier l'historique des régénérations FAP (carnet ou diagnostic OBD)",
          "Demander si la vidange de la boîte EAT6 a été faite (si automatique)",
          "Essai sur autoroute : vérifier la puissance en côte à pleine charge",
          "Contrôler les soufflets de cardan (fuite de graisse = remplacement coûteux)",
        ],
        options: [
          {
            nom: 'Pack GT Line',
            description: 'Sellerie, inserts, look sportif extérieur',
            importance: 'interessante',
            avis: "Ajoute du caractère sans impacter la fiabilité. Apprécié à la revente.",
          },
          {
            nom: 'Vitres surteintées',
            description: "Vitres arrière teintées d'usine",
            importance: 'inutile',
            avis: "Agréable en été mais aucun impact sur la valeur de revente.",
          },
        ],
        potentielReprog: {
          typeMoteur: 'turbo',
          avisGeneral:
            "Le 2.0 BlueHDi répond très bien à la reprog. Un des meilleurs rapports gains/prix du marché des compactes diesel.",
          stages: [
            {
              nom: 'Stage 1',
              puissanceGain: 35,
              coupleGain: 70,
              puissanceFinal: 185,
              coupleFinal: 440,
              cout: '300 – 550 €',
              avis: "Excellente transformation. Le moteur perd son côté mou et gagne en plaisir de conduite. Recommandé.",
            },
            {
              nom: 'Stage 2',
              puissanceGain: 55,
              coupleGain: 100,
              puissanceFinal: 205,
              coupleFinal: 470,
              cout: '800 – 1 300 €',
              avis: "Possible mais surveiller l'embrayage. Réservé à un usage non quotidien.",
            },
          ],
          recommandation: 'oui',
          raisonRecommandation:
            "Le 2.0 BlueHDi est une excellente base. Stage 1 très recommandé — transforme vraiment le caractère de la voiture.",
        },
      },
    ],
    fiabilite: {
      note: 3,
      avisGeneral:
        "La 308 II séduit par son design et son habitacle soigné, mais sa fiabilité est moyenne. Le 1.2 PureTech souffre de distribution et de joint de culasse défaillants. Le 1.6 THP est puissant mais fragile.",
      pointsSensibles: [
        'Courroie de distribution du 1.2 PureTech : à changer impérativement à 60 000 km',
        'Joint de culasse 1.2 PureTech (problème connu Stellantis)',
        'Écran tactile i-Cockpit vieillissant (lenteur, plantages)',
        'Amortisseurs usés prématurément',
      ],
      pannesFrequentes: [
        'Casse de la courroie de distribution (1.2 PureTech avant 2016)',
        'Fuite de liquide de refroidissement (joint de culasse)',
        'Module BSI défaillant (tableau de bord)',
        'Filtre à particules bouché (faibles distances)',
      ],
    },
    checklist: checklistGenerique,
  },

  {
    id: 'toyota-yaris-3',
    marque: 'Toyota',
    modele: 'Yaris III',
    annees: '2011–2020',
    segment: 'Citadine',
    poids: 1035,
    motorisations: [
      {
        slug: '10-vvti-69ch',
        designation: '1.0 VVT-i 69ch',
        type: 'essence',
        puissance: 69,
        consommationOfficielle: 5.0,
        boites: [{ slug: 'bvm5', designation: 'BVM5', type: 'manuelle' }],
        options: [
          {
            nom: 'Climatisation',
            description: 'Climatisation manuelle',
            importance: 'indispensable',
            avis: "Indispensable pour la revente. Vérifier le bon fonctionnement.",
          },
        ],
      },
      {
        slug: '133-vvti-99ch',
        designation: '1.33 Dual VVT-i 99ch',
        type: 'essence',
        puissance: 99,
        consommationOfficielle: 5.8,
        boites: [
          { slug: 'bvm6', designation: 'BVM6', type: 'manuelle' },
          { slug: 'cvt', designation: 'CVT', type: 'cvt', consommationOfficielle: 5.5 },
        ],
      },
      {
        slug: '15-hybrid-100ch',
        designation: '1.5 Hybrid 100ch',
        type: 'hybride',
        puissance: 100,
        consommationOfficielle: 3.8,
        boites: [{ slug: 'cvt', designation: 'CVT e-CVT', type: 'cvt' }],
        options: [
          {
            nom: 'Pack Design',
            description: 'Jantes alliage, inserts colorés',
            importance: 'interessante',
            avis: "Esthétique uniquement. Vérifier l'état des jantes.",
          },
          {
            nom: 'Caméra de recul',
            description: 'Caméra arrière intégrée',
            importance: 'indispensable',
            avis: "Très utile sur une citadine. Vérifier la qualité de l'image — les caméras vieillissent mal.",
          },
        ],
      },
      {
        slug: '14-d4d-90ch',
        designation: '1.4 D-4D 90ch',
        type: 'diesel',
        puissance: 90,
        consommationOfficielle: 3.6,
        boites: [{ slug: 'bvm6', designation: 'BVM6', type: 'manuelle' }],
      },
    ],
    fiabilite: {
      note: 5,
      avisGeneral:
        "La Yaris III est l'une des citadines les plus fiables du marché. Toyota excelle en fiabilité mécanique. La version hybride est particulièrement recommandée pour une utilisation urbaine, avec très peu de pannes signalées.",
      pointsSensibles: [
        'Boîte automatique CVT : bruyante sous accélération franche',
        'Peinture sensible aux impacts de cailloux',
        "Consommation d'huile sur les 1.0 à fort kilométrage",
        'Climatisation : compresseur en fin de vie >150 000 km',
      ],
      pannesFrequentes: [
        'Batterie hybride (rare, uniquement >200 000 km)',
        'Capteur de position du vilebrequin',
        'Démarreur défaillant (1.0 VVT-i)',
        'Sonde à oxygène',
      ],
    },
    checklist: checklistGenerique,
  },

  {
    id: 'bmw-serie3-f30',
    marque: 'BMW',
    modele: 'Série 3 F30',
    annees: '2012–2019',
    segment: 'Berline premium',
    poids: 1440,
    motorisations: [
      {
        slug: '316i-136ch',
        designation: '316i 136ch',
        type: 'essence',
        puissance: 136,
        consommationOfficielle: 6.5,
        boites: [{ slug: 'bvm6', designation: 'BVM6', type: 'manuelle' }],
      },
      {
        slug: '318i-136ch',
        designation: '318i 136ch',
        type: 'essence',
        puissance: 136,
        consommationOfficielle: 6.1,
        boites: [{ slug: 'bvm6', designation: 'BVM6', type: 'manuelle' }],
      },
      {
        slug: '320i-184ch',
        designation: '320i 184ch',
        type: 'essence',
        puissance: 184,
        consommationOfficielle: 6.5,
        boites: [
          { slug: 'bvm6', designation: 'BVM6', type: 'manuelle' },
          { slug: 'zf8', designation: 'ZF8 Steptronic', type: 'automatique', consommationOfficielle: 6.3 },
        ],
      },
      {
        slug: '316d-116ch',
        designation: '316d 116ch',
        type: 'diesel',
        puissance: 116,
        consommationOfficielle: 4.1,
        boites: [{ slug: 'bvm6', designation: 'BVM6', type: 'manuelle' }],
      },
      {
        slug: '318d-143ch',
        designation: '318d 143ch',
        type: 'diesel',
        puissance: 143,
        consommationOfficielle: 4.2,
        boites: [
          { slug: 'bvm6', designation: 'BVM6', type: 'manuelle' },
          { slug: 'zf8', designation: 'ZF8 Steptronic', type: 'automatique', consommationOfficielle: 4.4 },
        ],
        options: [
          {
            nom: 'Pack M Sport',
            description: 'Jantes, carrosserie, volant M, sièges sport',
            importance: 'indispensable',
            avis: "Très recherché à la revente — une F30 sans Pack M perd 15-20% de valeur. À privilégier absolument.",
          },
          {
            nom: 'GPS Professional',
            description: 'iDrive avec carte HD et mise à jour',
            importance: 'interessante',
            avis: "Bien plus agréable que le système de base. Vérifier la version du logiciel.",
          },
          {
            nom: 'Toit ouvrant',
            description: 'Toit ouvrant électrique panoramique',
            importance: 'inutile',
            avis: "Source de fuites potentielles. Tester systématiquement lors de la visite.",
          },
        ],
        potentielReprog: {
          typeMoteur: 'turbo',
          avisGeneral:
            "Le 318d B47 est une très bonne base de reprog. Gains sérieux en couple, transforme le caractère de la voiture.",
          stages: [
            {
              nom: 'Stage 1',
              puissanceGain: 35,
              coupleGain: 80,
              puissanceFinal: 178,
              coupleFinal: 460,
              cout: '350 – 600 €',
              avis: "Excellent. Le moteur devient vraiment plaisant — les reprises sont dans une autre catégorie.",
            },
            {
              nom: 'Stage 2',
              puissanceGain: 55,
              coupleGain: 110,
              puissanceFinal: 198,
              coupleFinal: 490,
              cout: '900 – 1 500 €',
              avis: "Possible avec échangeur. Surveiller l'embrayage et la boîte automatique si équipée.",
            },
          ],
          recommandation: 'oui',
          raisonRecommandation:
            "Stage 1 fortement recommandé. Le 318d devient un moteur vraiment agréable et économique à la fois.",
        },
      },
      {
        slug: '320d-190ch',
        designation: '320d 190ch',
        type: 'diesel',
        puissance: 190,
        consommationOfficielle: 4.5,
        boites: [
          { slug: 'bvm6', designation: 'BVM6', type: 'manuelle' },
          { slug: 'zf8', designation: 'ZF8 Steptronic', type: 'automatique', consommationOfficielle: 4.7 },
        ],
      },
    ],
    fiabilite: {
      note: 3,
      avisGeneral:
        "La Série 3 F30 est une voiture plaisante à conduire mais l'entretien BMW est onéreux. Les pannes électroniques sont fréquentes et les pièces coûtent cher. Recommandée uniquement à ceux prêts à investir dans l'entretien.",
      pointsSensibles: [
        'Vanos (distribution variable) : bruit et défaillances après 150 000 km',
        'Pompe à eau en plastique : à remplacer vers 100 000 km',
        "Turbo sur les diesels : fragile en cas de manque d'huile",
        'Électronique complexe : iDrive, capteurs multiples',
      ],
      pannesFrequentes: [
        'Pompe à eau défaillante (essence)',
        "Turbo grippé (diesel, manque d'huile)",
        'Module de contrôle électronique défaillant',
        "Fuite d'huile sur le joint de vilebrequin",
        'Batterie AGM en fin de vie (tous les 4-5 ans)',
      ],
    },
    checklist: checklistGenerique,
  },

  {
    id: 'dacia-sandero-2',
    marque: 'Dacia',
    modele: 'Sandero II',
    annees: '2012–2020',
    segment: 'Citadine économique',
    poids: 975,
    motorisations: [
      {
        slug: '10-sce-65ch',
        designation: '1.0 SCe 65ch',
        type: 'essence',
        puissance: 65,
        consommationOfficielle: 5.6,
        boites: [{ slug: 'bvm5', designation: 'BVM5', type: 'manuelle' }],
      },
      {
        slug: '09-tce-90ch',
        designation: '0.9 TCe 90ch',
        type: 'essence',
        puissance: 90,
        consommationOfficielle: 5.0,
        boites: [{ slug: 'bvm5', designation: 'BVM5', type: 'manuelle' }],
        options: [
          {
            nom: 'Climatisation',
            description: 'Climatisation manuelle',
            importance: 'indispensable',
            avis: "Première option à vérifier — impacte fortement la valeur de revente.",
          },
          {
            nom: 'GPS MediaNav',
            description: 'GPS Dacia intégré',
            importance: 'inutile',
            avis: "Dépassé. Un support téléphone fait mieux pour 20€.",
          },
        ],
        potentielReprog: {
          typeMoteur: 'turbo',
          avisGeneral:
            "Le 0.9 TCe Renault se reprogramme facilement. Gains modestes mais réels sur une plateforme économique.",
          stages: [
            {
              nom: 'Stage 1',
              puissanceGain: 15,
              coupleGain: 35,
              puissanceFinal: 105,
              coupleFinal: 170,
              cout: '250 – 400 €',
              avis: "Transforme agréablement le moteur pour un usage quotidien. Coût raisonnable.",
            },
          ],
          recommandation: 'selon_usage',
          raisonRecommandation:
            "Intéressant si vous gardez le véhicule longtemps. Peu pertinent si vous comptez revendre rapidement.",
        },
      },
      {
        slug: '15-dci-75ch',
        designation: '1.5 dCi 75ch',
        type: 'diesel',
        puissance: 75,
        consommationOfficielle: 3.7,
        boites: [{ slug: 'bvm5', designation: 'BVM5', type: 'manuelle' }],
      },
      {
        slug: '15-dci-90ch',
        designation: '1.5 dCi 90ch',
        type: 'diesel',
        puissance: 90,
        consommationOfficielle: 3.8,
        boites: [{ slug: 'bvm5', designation: 'BVM5', type: 'manuelle' }],
      },
    ],
    fiabilite: {
      note: 4,
      avisGeneral:
        "La Sandero II est simple, économique et robuste. Les mécaniques Renault-Nissan utilisées sont éprouvées. Le manque de finesse à l'intérieur est compensé par une fiabilité honnête et un coût d'entretien très bas.",
      pointsSensibles: [
        'Finition intérieure basique qui vieillit mal',
        'Isolation phonique insuffisante',
        '0.9 TCe : mêmes fragilités que chez Renault',
        'Pompe à eau sur les 1.5 dCi (>120 000 km)',
      ],
      pannesFrequentes: [
        'Courroie de distribution (1.5 dCi) : à changer à 120 000 km',
        'Injecteurs (1.5 dCi à fort kilométrage)',
        "Bobines d'allumage (1.0 SCe)",
        'Démarreur défaillant',
      ],
    },
    checklist: checklistGenerique,
  },

  {
    id: 'ford-fiesta-7',
    marque: 'Ford',
    modele: 'Fiesta 7',
    annees: '2017–2023',
    segment: 'Citadine',
    poids: 1060,
    motorisations: [
      {
        slug: '11-tivct-75ch',
        designation: '1.1 Ti-VCT 75ch',
        type: 'essence',
        puissance: 75,
        consommationOfficielle: 5.3,
        boites: [{ slug: 'bvm5', designation: 'BVM5', type: 'manuelle' }],
      },
      {
        slug: '10-ecoboost-95ch',
        designation: '1.0 EcoBoost 95ch',
        type: 'essence',
        puissance: 95,
        consommationOfficielle: 5.1,
        boites: [{ slug: 'bvm6', designation: 'BVM6', type: 'manuelle' }],
        options: [
          {
            nom: 'B&O Audio',
            description: 'Système audio Bang & Olufsen',
            importance: 'inutile',
            avis: "Bonne qualité mais pas worth le surprix en occasion.",
          },
          {
            nom: 'Aide au stationnement',
            description: 'Capteurs avant et arrière',
            importance: 'interessante',
            avis: "Utile sur une citadine urbaine. Tester les 6 capteurs.",
          },
        ],
        potentielReprog: {
          typeMoteur: 'turbo',
          avisGeneral:
            "Le 1.0 EcoBoost Ford est l'un des moteurs 3 cylindres les plus aboutis du marché. Il répond très bien à la reprog malgré sa petite cylindrée.",
          stages: [
            {
              nom: 'Stage 1',
              puissanceGain: 25,
              coupleGain: 50,
              puissanceFinal: 120,
              coupleFinal: 220,
              cout: '300 – 500 €',
              avis: "Très bonne transformation. Le moteur perd son côté creux à bas régime. Recommandé.",
            },
          ],
          recommandation: 'oui',
          raisonRecommandation:
            "Le 1.0 EcoBoost est une excellente base. Stage 1 recommandé — rapport qualité/prix très bon sur ce moteur.",
        },
      },
      {
        slug: '10-ecoboost-125ch',
        designation: '1.0 EcoBoost 125ch',
        type: 'essence',
        puissance: 125,
        consommationOfficielle: 5.5,
        boites: [
          { slug: 'bvm6', designation: 'BVM6', type: 'manuelle' },
          { slug: 'powershift', designation: 'PowerShift 6', type: 'dsg', consommationOfficielle: 5.8 },
        ],
      },
      {
        slug: '15-tdci-85ch',
        designation: '1.5 TDCi 85ch',
        type: 'diesel',
        puissance: 85,
        consommationOfficielle: 3.9,
        boites: [{ slug: 'bvm6', designation: 'BVM6', type: 'manuelle' }],
      },
    ],
    fiabilite: {
      note: 4,
      avisGeneral:
        "La Fiesta 7 est dynamique et bien équipée. Le 1.0 EcoBoost est un excellent moteur mais attention à la gestion de la chaleur. Bonne fiabilité globale, avec des coûts d'entretien raisonnables.",
      pointsSensibles: [
        "1.0 EcoBoost : échangeur de chaleur intégré dans le bloc (attention surchauffe)",
        'Boîte automatique PowerShift à double embrayage : peu fiable',
        'Écran SYNC 3 : plantages fréquents',
        'Joint de culasse 1.0 EcoBoost sur les premières séries',
      ],
      pannesFrequentes: [
        'Joint de culasse 1.0 EcoBoost (avant 2017)',
        'Boîte PowerShift : saccades et patinage',
        'Module SYNC : mises à jour logicielles requises',
        'Sonde MAF encrassée',
      ],
    },
    checklist: checklistGenerique,
  },

  {
    id: 'bmw-m3-e92',
    marque: 'BMW',
    modele: 'M3 E92',
    annees: '2007–2013',
    segment: 'Sportive',
    poids: 1580,
    motorisations: [
      {
        slug: 'v8-s65-420ch',
        designation: 'V8 S65 420ch',
        type: 'essence',
        puissance: 420,
        couple: 400,
        consommationOfficielle: 12.4,
        consommationReelle: 14.0,
        boites: [
          { slug: 'bvm6', designation: 'BVM6', type: 'manuelle' },
          { slug: 'dkg7', designation: 'DKG7', type: 'dsg' },
        ],
        fiabilite: {
          note: 3,
          avis:
            "Le V8 S65 est une mécanique d'exception — à haut régime, il est irremplaçable. Mais il exige des vidanges toutes les 7 000 km maximum (pas les 15 000 km préconisés par BMW) et un remplacement préventif des coussinets de bielles. La boîte manuelle est plus fiable et agréable que la DKG en usage quotidien.",
          problemesConnus: [
            "Coussinets de bielles : POINT CRITIQUE — remplacement préventif impératif avant 100 000 km (3 800 à 5 000 €)",
            "Actuateurs de papillons : défaillance fréquente, surtout sur les hauts kilométrages",
            "Pompe à huile : vérifier la pression régulièrement, sensible aux fortes charges",
            "Bobines d'allumage : à contrôler lors de l'achat, défaillances fréquentes",
            "DKG : vidange obligatoire tous les 50 000 km, coûteuse si négligée",
          ],
        },
        cotes: [
          { label: '2007–2009, 100–150 000 km', prixBas: 22000, prixMoyen: 28000, prixHaut: 35000 },
          { label: '2010–2011, 60–100 000 km',  prixBas: 28000, prixMoyen: 35000, prixHaut: 45000 },
          { label: '2012–2013, <60 000 km',      prixBas: 38000, prixMoyen: 48000, prixHaut: 60000 },
        ],
        checklistSpecifique: [
          "Vérifier la pression d'huile moteur à chaud — toute valeur basse est rédhibitoire",
          "Demander les factures de remplacement des coussinets de bielles ou prévoir le budget",
          "Tester les actuateurs de papillons : démarrage à froid, pas de ratés ni de voyants",
          "Vérifier l'historique des vidanges — idéalement toutes les 7 000 km, pas plus",
          "Sur DKG : tester tous les modes (Normal, Sport, Sport+), pas d'à-coups ni de patinage",
          "Écouter le bruit de pont à froid lors du premier démarrage",
        ],
        options: [
          {
            nom: 'Différentiel autobloquant M Variable',
            description: "Différentiel à glissement limité actif à l'arrière",
            importance: 'indispensable',
            avis: "Incontournable sur une propulsion de 420ch. Sans lui, la voiture est bien moins exploitable sur route mouillée et en conduite sportive. À vérifier absolument lors de l'achat.",
          },
          {
            nom: 'Suspension pilotée EDC (amortisseurs adaptatifs)',
            description: 'Amortisseurs réglables électroniquement avec modes Comfort/Normal/Sport',
            importance: 'interessante',
            avis: "Très appréciée pour un usage mixte route/autoroute. Attention : les amortisseurs EDC coûtent 2 à 3x plus cher à remplacer que des amortisseurs classiques. À éviter si budget entretien serré.",
          },
          {
            nom: 'Toit en fibre de carbone',
            description: 'Toit panoramique remplacé par un toit en carbone pour réduire le centre de gravité',
            importance: 'interessante',
            avis: "Abaisse le centre de gravité de 15mm — bénéfice réel sur circuit. En usage route, la différence est subtile. Ajoute du caractère mais attention aux micro-fissures sur les exemplaires anciens.",
          },
          {
            nom: 'Pack M Drive (MDrive)',
            description: 'Mémorisation des réglages moteur, suspension, DSC sur un bouton dédié',
            importance: 'interessante',
            avis: "Pratique pour basculer rapidement en mode sport complet. Pas indispensable mais confortable si vous alternez usage quotidien et conduite sportive.",
          },
          {
            nom: 'Sono Harman Kardon',
            description: 'Système audio premium 400W avec subwoofer',
            importance: 'inutile',
            avis: "Difficile à entendre avec le V8 à plein régime. Confort appréciable au quotidien, mais ne justifie pas un surprix en occasion.",
          },
          {
            nom: 'Jantes 19 pouces',
            description: 'Jantes forgées 19 pouces en lieu et place des 18 pouces de série',
            importance: 'inutile',
            avis: "Les 18 pouces de série offrent un meilleur compromis confort/tenue. Les 19 pouces durcissent la direction et augmentent le coût des pneumatiques. Préférez les 18 pouces.",
          },
        ],
        potentielReprog: {
          typeMoteur: 'atmospherique',
          avisGeneral:
            "Le V8 S65 est un moteur atmosphérique porté à son maximum par BMW dès la sortie d'usine. Contrairement à un moteur turbo, les marges de progression via reprogrammation sont extrêmement limitées. L'argent investi dans une reprog sera toujours mieux dépensé dans l'entretien ou dans des pneumatiques de qualité.",
          stages: [
            {
              nom: 'Stage 1',
              puissanceGain: 12,
              coupleGain: 15,
              puissanceFinal: 432,
              coupleFinal: 415,
              cout: '400 – 800 €',
              avis: "Gain marginal (+12ch) obtenu par optimisation des calages d'allumage et du VANOS. Imperceptible au volant dans 90% des situations. Non recommandé.",
            },
            {
              nom: 'Stage 2',
              puissanceGain: 0,
              coupleGain: 0,
              puissanceFinal: 420,
              coupleFinal: 400,
              cout: 'Non applicable',
              avis: "Il n'existe pas de Stage 2 pertinent sur un V8 atmosphérique. Les modifications nécessaires (admission, échappement, etc.) coûtent très cher pour des gains dérisoires sur une voiture déjà au plafond.",
            },
          ],
          recommandation: 'non',
          raisonRecommandation:
            "Moteur atmosphérique déjà au maximum de son potentiel. Budget mieux investi dans : remplacement préventif des coussinets de bielles, révision des actuateurs de papillons, pneumatiques haute performance.",
        },
      },
    ],
    fiabilite: {
      note: 3,
      avisGeneral:
        "Fiabilité correcte si l'entretien est rigoureux, mais le moteur S65 cache des faiblesses coûteuses. Les coussinets de bielles sont le talon d'Achille de ce moteur — un remplacement préventif avant 100 000 km est fortement recommandé. Réservée aux acheteurs avertis avec un budget entretien conséquent.",
      pointsSensibles: [
        "Coussinets de bielles : usure prématurée, remplacement préventif recommandé avant 100 000 km",
        "Pompe à huile : peut perdre en pression lors de fortes sollicitations — surveiller la pression",
        "Actuateurs VANOS : ratés à chaud, défaillances capricieuses sur moteur chaud",
        "Tendeur de chaîne : vieillit mal avec un usage sportif intensif",
        "Boîte DKG : fiable si vidanges respectées tous les 50 000 km, complexe et coûteuse en réparation",
        "Pont arrière : bruits de pont à froid, courants mais sans gravité si huile changée régulièrement",
      ],
      pannesFrequentes: [
        "Bobines d'allumage défaillantes (ratés moteur, cylindres manquants)",
        "Actuateurs de papillons HS (coût : 800 à 1 500 €, très fréquent)",
        "Fuites d'huile sur cache culasse et joints divers",
        "Sélecteur DKG : fils internes sectionnés (réparation simple si détectée tôt)",
        "Défauts ABS/ESP électroniques sporadiques",
      ],
    },
    checklist: checklistGenerique,
  },

  {
    id: 'citroen-c3-3',
    marque: 'Citroën',
    modele: 'C3 III',
    annees: '2016–2023',
    segment: 'Citadine',
    poids: 1050,
    motorisations: [
      {
        slug: '12-puretech-82ch',
        designation: '1.2 PureTech 82ch',
        type: 'essence',
        puissance: 82,
        consommationOfficielle: 5.0,
        boites: [{ slug: 'bvm5', designation: 'BVM5', type: 'manuelle' }],
      },
      {
        slug: '12-puretech-110ch',
        designation: '1.2 PureTech 110ch',
        type: 'essence',
        puissance: 110,
        consommationOfficielle: 5.3,
        boites: [
          { slug: 'bvm6', designation: 'BVM6', type: 'manuelle' },
          { slug: 'eat6', designation: 'EAT6', type: 'automatique', consommationOfficielle: 5.5 },
        ],
        options: [
          {
            nom: 'Airbumps',
            description: 'Protections plastique sur les flancs',
            importance: 'inutile',
            avis: "Original mais fragilisé avec l'âge. Vérifier l'état — les remplacer coûte cher.",
          },
          {
            nom: 'Climatisation auto',
            description: 'Climatisation automatique',
            importance: 'interessante',
            avis: "Confort réel. Tester le compresseur.",
          },
        ],
        potentielReprog: {
          typeMoteur: 'turbo',
          avisGeneral:
            "Le 1.2 PureTech est reprogrammable mais attention — ce moteur a déjà des problèmes de courroie de distribution. Reprogrammer un moteur fragile n'est pas recommandé.",
          stages: [
            {
              nom: 'Stage 1',
              puissanceGain: 20,
              coupleGain: 40,
              puissanceFinal: 130,
              coupleFinal: 230,
              cout: '300 – 500 €',
              avis: "Techniquement possible mais déconseillé. Le PureTech a des fragilités connues — priorité à l'entretien plutôt qu'à la performance.",
            },
          ],
          recommandation: 'non',
          raisonRecommandation:
            "Le 1.2 PureTech souffre déjà de problèmes de courroie de distribution. Toute sollicitation supplémentaire augmente les risques. Budget mieux investi dans la prévention.",
        },
      },
      {
        slug: '15-bluehdi-100ch',
        designation: '1.5 BlueHDi 100ch',
        type: 'diesel',
        puissance: 100,
        consommationOfficielle: 3.7,
        boites: [{ slug: 'bvm6', designation: 'BVM6', type: 'manuelle' }],
      },
    ],
    fiabilite: {
      note: 3,
      avisGeneral:
        "La C3 III est moderne et confortable, mais elle partage les fragilités connues du 1.2 PureTech de PSA. La courroie de distribution est le point noir principal. Recommandée avec un historique d'entretien complet.",
      pointsSensibles: [
        'Courroie de distribution 1.2 PureTech : remplacement impératif à 60 000 km',
        'Joint de culasse (problème récurrent sur les premiers millésimes)',
        'BSI (module électronique) défaillant',
        'Rétroviseurs extérieurs fragiles',
      ],
      pannesFrequentes: [
        'Casse courroie de distribution (1.2 PureTech avant 2019)',
        'Module BSI bloqué',
        'Capteur pression pneu défaillant',
        'Amortisseurs avant usés prématurément',
      ],
    },
    checklist: checklistGenerique,
  },
]

export function rechercherVoitures(query: string): Voiture[] {
  const q = query.toLowerCase().trim()
  if (!q) return voitures
  return voitures.filter(
    (v) =>
      v.marque.toLowerCase().includes(q) ||
      v.modele.toLowerCase().includes(q) ||
      v.segment.toLowerCase().includes(q)
  )
}

export function getVoitureById(id: string): Voiture | undefined {
  return voitures.find((v) => v.id === id)
}

export function getVoitureEtMotorisation(voitureId: string, motorisationSlug: string) {
  const voiture = getVoitureById(voitureId)
  if (!voiture) return { voiture: undefined, motorisation: undefined }
  const motorisation = voiture.motorisations.find((m) => m.slug === motorisationSlug)
  return { voiture, motorisation }
}

export function getAllMotorisationParams() {
  return voitures.flatMap((v) =>
    v.motorisations.map((m) => ({ id: v.id, motorisationSlug: m.slug }))
  )
}
