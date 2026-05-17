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
