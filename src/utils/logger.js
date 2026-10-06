export class Logger {
  constructor(maxEntries = 1000) {
    this.maxEntries = maxEntries;
    this.logs = [];
  }

  add(level, message, context = {}) {
    const entry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      level,
      message,
      context,
      timestamp: new Date().toISOString()
    };

    this.logs.push(entry);

    if (this.logs.length > this.maxEntries) {
      this.logs = this.logs.slice(-this.maxEntries);
    }
  }

  getAll() {
    return [...this.logs];
  }

  clear() {
    this.logs = [];
  }
}
