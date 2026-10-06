export class ErrorManager {
  constructor(logger) {
    this.logger = logger;
  }

  handle(error, context = {}) {
    const message = error && error.message ? error.message : 'Erreur inconnue';
    this.logger.add('error', message, context);
    console.error('[ERROR]', message, context);
  }
}
