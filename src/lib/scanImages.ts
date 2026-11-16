// On-device storage for scan images (IndexedDB). Images never leave the
// phone: History pairs them with the server-side scan record by its id, and
// only the AI text syncs to the account.

export interface StoredLabel {
  name: string;
  color: string;
  x: number; // % from left
  y: number; // % from top
}

export interface StoredScanImage {
  id: string;         // scan_history row id
  dataUrl: string;    // redacted, downscaled JPEG
  labels: StoredLabel[];
  savedAt: string;
}

const DB_NAME = "sonobuddyai";
const STORE = "scan-images";
const ENABLED_KEY = "sonobuddyai_keep_images";

export function keepImagesEnabled(): boolean {
  try {
    return localStorage.getItem(ENABLED_KEY) !== "0";
  } catch {
    return true;
  }
}

export function setKeepImagesEnabled(on: boolean) {
  try {
    localStorage.setItem(ENABLED_KEY, on ? "1" : "0");
  } catch {
    // storage unavailable
  }
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") return reject(new Error("IndexedDB unavailable"));
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: "id" });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function withStore<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = fn(tx.objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  });
}

// Shrink to a History-sized copy so hundreds of scans stay small.
function downscale(dataUrl: string, maxPx = 720, quality = 0.75): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(dataUrl);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export async function saveScanImage(id: string, redactedDataUrl: string, labels: StoredLabel[]) {
  if (!keepImagesEnabled()) return;
  try {
    const dataUrl = await downscale(redactedDataUrl);
    const clean = labels
      .filter((l) => typeof l.x === "number" && typeof l.y === "number")
      .map(({ name, color, x, y }) => ({ name, color, x, y }));
    await withStore("readwrite", (s) => s.put({ id, dataUrl, labels: clean, savedAt: new Date().toISOString() }));
  } catch (err) {
    console.warn("[scanImages] save failed", err);
  }
}

export async function getScanImages(ids: string[]): Promise<Record<string, StoredScanImage>> {
  const out: Record<string, StoredScanImage> = {};
  try {
    const results = await Promise.all(ids.map((id) => withStore<StoredScanImage | undefined>("readonly", (s) => s.get(id))));
    results.forEach((r) => { if (r) out[r.id] = r; });
  } catch {
    // no images on this device
  }
  return out;
}

export async function deleteScanImage(id: string) {
  try {
    await withStore("readwrite", (s) => s.delete(id));
  } catch {
    // nothing stored
  }
}

export async function countScanImages(): Promise<number> {
  try {
    return await withStore<number>("readonly", (s) => s.count());
  } catch {
    return 0;
  }
}

export async function clearScanImages() {
  try {
    await withStore("readwrite", (s) => s.clear());
  } catch {
    // nothing stored
  }
}
