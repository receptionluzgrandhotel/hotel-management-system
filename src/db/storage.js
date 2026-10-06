export class StorageAdapter {
  constructor(namespace = 'grandhotel') {
    this.namespace = namespace;
  }

  getKey(name) {
    return `${this.namespace}.${name}`;
  }

  get(name, fallback = null) {
    try {
      const raw = localStorage.getItem(this.getKey(name));
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.error('Erreur lecture localStorage', error);
      return fallback;
    }
  }

  set(name, value) {
    try {
      localStorage.setItem(this.getKey(name), JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Erreur écriture localStorage', error);
      return false;
    }
  }

  remove(name) {
    localStorage.removeItem(this.getKey(name));
  }
}
