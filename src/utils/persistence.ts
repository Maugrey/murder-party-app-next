// Helper d'abstraction pour la persistance (localStorage, API-ready)

export interface PersistenceProvider {
  getItem<T>(key: string): T | null;
  setItem<T>(key: string, value: T): void;
  removeItem(key: string): void;
}

class LocalStorageProvider implements PersistenceProvider {
  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  }
  setItem<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  removeItem(key: string) {
    localStorage.removeItem(key);
  }
}

// Pour évoluer vers une API, il suffira d'implémenter un autre provider
export const persistenceProvider: PersistenceProvider = new LocalStorageProvider();
