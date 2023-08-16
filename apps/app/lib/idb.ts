/**
 * Browser only.
 */
export class IndexedDB {
  private static DATABASE = "datagovmy-db";
  private static VERSION = 20230905;
  model: string;
  db: IDBDatabase | null = null;

  constructor(model: string) {
    this.model = model;
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

      request.onerror = event => {
        reject(request.error);
      };
    });
  }

  async read(id: string): Promise<Record<string, any>> {
    const db = await this.open();
    const transaction = db.transaction([this.model], "readonly");
    const store = transaction.objectStore(this.model);

    return new Promise((resolve, reject) => {
      const request = store.get(id);

      request.onsuccess = event => {
        resolve(request.result);
      };

      request.onerror = event => {
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

      request.onerror = event => {
        reject(request.error);
      };
    });
  }

  //   async destroyAll(id: string): Promise<Record<string, any>> {
  //     const db = await this.open();
  //     const transaction = db.transaction([this.model], "readonly");
  //     const store = transaction.objectStore(this.model);

  //     return new Promise((resolve, reject) => {
  //       const request = store.get(id);

  //       request.onsuccess = event => {
  //         resolve(request.result);
  //       };

  //       request.onerror = event => {
  //         reject(request.error);
  //       };
  //     });
  //   }

  /** Private methods */
  async open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(IndexedDB.DATABASE, IndexedDB.VERSION);

      request.onsuccess = event => {
        this.db = request.result as IDBDatabase;
        resolve(this.db);
      };

      request.onerror = event => {
        reject(request.error);
      };

      request.onupgradeneeded = event => {
        const db = request.result as IDBDatabase;
        if (!db.objectStoreNames.contains(this.model)) {
          db.createObjectStore(this.model, { keyPath: "id" });
        }
      };
    });
  }
}
