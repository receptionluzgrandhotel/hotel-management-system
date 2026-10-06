import { ReservationFactory } from '../factories/reservation.factory.js';

export class ReservationService {
  constructor(storage, logger, errorManager) {
    this.storage = storage;
    this.logger = logger;
    this.errorManager = errorManager;
  }

  loadAll() {
    try {
      const items = this.storage.get('reservations', []);
      return items.map((item) => ReservationFactory.fromRaw(item));
    } catch (error) {
      this.errorManager.handle(error, { phase: 'load-all-reservations' });
      return [];
    }
  }

  saveAll(reservations) {
    try {
      this.storage.set('reservations', reservations.map((item) => item));
      this.logger.add('info', 'Réservations enregistrées', { count: reservations.length });
      return true;
    } catch (error) {
      this.errorManager.handle(error, { phase: 'save-all-reservations' });
      return false;
    }
  }

  importFromXml(xmlText, sourceFile = 'res_detail.xml') {
    try {
      const raw = this.storage.get('reservations', []);
      const parser = this.storage.get('parser', null);
      if (!parser) {
        return [];
      }

      const parsed = parser.parse(xmlText, sourceFile);
      const reservations = parsed.map((item) => ReservationFactory.fromRaw(item));
      const next = [...raw, ...reservations];
      this.saveAll(next);
      return reservations;
    } catch (error) {
      this.errorManager.handle(error, { phase: 'import-from-xml', sourceFile });
      return [];
    }
  }
}
