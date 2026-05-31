const DB_NAME = "curliq";
const STORE = "scan-photos";
const VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveImage(scanId: string, file: File): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(file, scanId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Non-fatal — silently fail if IndexedDB is unavailable
  }
}

export async function getImageUrl(scanId: string): Promise<string | null> {
  try {
    const db = await openDB();
    const blob = await new Promise<Blob | undefined>((resolve) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(scanId);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(undefined);
    });
    return blob ? URL.createObjectURL(blob) : null;
  } catch {
    return null;
  }
}
