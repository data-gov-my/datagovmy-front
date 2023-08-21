/**
 * Browser only.
 */
export class IndexedDB {
  private static DATABASE = "datagovmy-db";
  private static VERSION = 1;
  private static MODELS = ["chat-directory", "chat-history"];
  model: string;
  db: IDBDatabase | null = null;

  constructor(model: string) {
    this.model = model;
    this.open();
  }

  /** Public methods */
  async write(record: Record<string, any>): Promise<void> {
    const db = await this.open();
    const transaction = db.transaction([this.model], "readwrite");
    const store = transaction.objectStore(this.model);

    return new Promise((resolve, reject) => {
      const request = store.add(record);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async read<T extends Record<string, any>>(id: string): Promise<T | undefined> {
    const db = await this.open();
    const transaction = db.transaction([this.model], "readonly");
    const store = transaction.objectStore(this.model);

    return new Promise((resolve, reject) => {
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async update(record: Record<string, any>): Promise<void> {
    const db = await this.open();
    const transaction = db.transaction([this.model], "readwrite");
    const store = transaction.objectStore(this.model);

    return new Promise((resolve, reject) => {
      const request = store.put(record);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async destroy(ids: string | string[]): Promise<void> {
    const db = await this.open();
    const transaction = db.transaction([this.model], "readwrite");
    const store = transaction.objectStore(this.model);
    const _ids = Array.isArray(ids) ? ids : [ids];
    return new Promise((resolve, reject) => {
      Promise.allSettled(_ids.map(id => store.delete(id)))
        .then(() => resolve())
        .catch(e => reject(e));
    });
  }

  async destroyAll(): Promise<void> {
    const db = await this.open();
    const transaction = db.transaction([this.model], "readwrite");
    const store = transaction.objectStore(this.model);

    return new Promise((resolve, reject) => {
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /** Private methods */
  async open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(IndexedDB.DATABASE, IndexedDB.VERSION);

      request.onsuccess = () => {
        this.db = request.result as IDBDatabase;
        resolve(this.db);
      };

      request.onerror = () => {
        reject(request.error);
      };

      request.onupgradeneeded = () => {
        const db = request.result as IDBDatabase;

        for (const model of IndexedDB.MODELS) {
          if (!db.objectStoreNames.contains(model)) db.createObjectStore(model, { keyPath: "id" });
        }
      };
    });
  }
}
