# Grand Hotel Reception App

Application de gestion des réservations hôtelières, conçue pour fonctionner entièrement en HTML, JavaScript et stockage local sans serveur.

## Objectif

- Importer les exports XML Opera Cloud
- Parser les réservations et les types de chambre
- Gérer les packages et les options de séjour
- Afficher un dashboard de suivi de l’occupation
- Gérer les logs d’application et les erreurs centralisées
- Respecter les principes Clean Code, SOLID, MVC et DAC/Factory

## Structure du projet

```text
hotel-management-system/
├── index.html
├── styles.css
├── package.json
├── README.md
├── src/
│   ├── app.js
│   ├── db/
│   │   └── storage.js
│   ├── factories/
│   │   └── reservation.factory.js
│   ├── models/
│   │   └── reservation.model.js
│   ├── services/
│   │   ├── reservation.service.js
│   │   └── xml-parser.service.js
│   ├── utils/
│   │   ├── errorManager.js
│   │   └── logger.js
│   └── views/
│       └── dashboard.js
├── tests/
│   └── xml-parser.test.js
└── data/
    └── sample-roomtypes.json
```

## Démarrage

1. Ouvrez `index.html` dans un navigateur.
2. Importez un export XML Opera Cloud.
3. Les données sont enregistrées dans le stockage local du navigateur.

## Bonnes pratiques intégrées

- MVC : séparation modèle / service / interface
- DAC/Factory : construction des objets via factory
- Clean Code : méthodes courtes, logique lisible
- Gestion d’erreurs centralisée : `ErrorManager`
- Logs : `Logger` avec mémoire limitée à 1000 entrées
- Purge automatique des anciens logs

## Exemple d’export supporté

Les fichiers XML contenant des blocs `G_RESERVATION` sont pris en charge, notamment :

- `CONFIRMATION_NO`
- `ARRIVAL`
- `DEPARTURE`
- `ROOM_NO`
- `ROOM_CATEGORY_LABEL`
- `FULL_NAME`
- `ADULTS`
- `CHILDREN`
- `PRODUCTS`
- `RATE_CODE`
- `SHORT_RESV_STATUS`
- `EFFECTIVE_RATE_AMOUNT`

## Tests

```bash
npm test
```

## Notes

- Aucune installation serveur n’est requise.
- L’application fonctionne entièrement côté navigateur.
- Les données restent sur le poste local, ce qui correspond à la contrainte de sécurité demandée.

## Évolution possible

- Import de plusieurs XML en lot
- Filtres par date, statut ou chambre
- Export CSV/JSON
- Gestion des paquets de bien-être et packages
- Synchronisation locale sur fichier
