/**
 * Logger - Gestionnaire centralisé des logs
 * 
 * Gère les logs de l'application avec stockage limité à 1000 entrées max.
 * Purge automatique des anciens logs en cas de dépassement.
 * 
 * @class Logger
 */
class Logger {
  constructor() {
    this.MAX_LOGS = 1000;
    this.STORAGE_KEY = 'app_logs';
    this.logs = this._loadLogs();
  }

  /**
   * Charge les logs depuis le localStorage
   * @private
   * @returns {Array} Array des logs existants
   */
  _loadLogs() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erreur lors du chargement des logs:', error);
      return [];
    }
  }

  /**
   * Sauvegarde les logs dans le localStorage
   * @private
   */
  _saveLogs() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des logs:', error);
    }
  }

  /**
   * Purge automatique des anciens logs si dépassement
   * Garde les 1000 derniers logs les plus récents
   * @private
   */
  _purgeOldLogs() {
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(-this.MAX_LOGS);
      this._saveLogs();
    }
  }

  /**
   * Ajoute un log dans la liste
   * @private
   * @param {string} level - Niveau du log (INFO, WARN, ERROR, DEBUG)
   * @param {string} message - Message du log
   * @param {*} data - Données additionnelles (optionnel)
   */
  _addLog(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
      id: `${timestamp}_${Math.random()}`
    };

    this.logs.push(logEntry);
    this._purgeOldLogs();
    this._saveLogs();

    // Affichage console pour debug
    const consoleMethod = level.toLowerCase() === 'error' ? 'error' : 'log';
    console[consoleMethod](`[${level}] ${message}`, data || '');
  }

  /**
   * Log de niveau INFO
   * @param {string} message - Message à logger
   * @param {*} data - Données additionnelles
   */
  info(message, data = null) {
    this._addLog('INFO', message, data);
  }

  /**
   * Log de niveau WARNING
   * @param {string} message - Message à logger
   * @param {*} data - Données additionnelles
   */
  warn(message, data = null) {
    this._addLog('WARN', message, data);
  }

  /**
   * Log de niveau ERROR
   * @param {string} message - Message à logger
   * @param {*} data - Données additionnelles
   */
  error(message, data = null) {
    this._addLog('ERROR', message, data);
  }

  /**
   * Log de niveau DEBUG
   * @param {string} message - Message à logger
   * @param {*} data - Données additionnelles
   */
  debug(message, data = null) {
    this._addLog('DEBUG', message, data);
  }

  /**
   * Récupère tous les logs
   * @returns {Array} Liste complète des logs
   */
  getLogs() {
    return [...this.logs];
  }

  /**
   * Récupère les N derniers logs
   * @param {number} count - Nombre de logs à retourner
   * @returns {Array} Derniers logs
   */
  getRecentLogs(count = 50) {
    return this.logs.slice(-count);
  }

  /**
   * Filtre les logs par niveau
   * @param {string} level - Niveau à filtrer (INFO, WARN, ERROR, DEBUG)
   * @returns {Array} Logs filtrés
   */
  getLogsByLevel(level) {
    return this.logs.filter(log => log.level === level.toUpperCase());
  }

  /**
   * Efface tous les logs
   */
  clearLogs() {
    this.logs = [];
    localStorage.removeItem(this.STORAGE_KEY);
    this.info('Tous les logs ont été effacés');
  }

  /**
   * Exporte les logs en JSON
   * @returns {string} JSON stringifié
   */
  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Retourne le nombre total de logs
   * @returns {number}
   */
  getLogCount() {
    return this.logs.length;
  }
}

// Export du singleton
const logger = new Logger();
