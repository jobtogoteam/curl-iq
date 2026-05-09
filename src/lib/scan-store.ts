/**
 * Module-level scan store — survives React component unmount/remount during navigation.
 * The fetch promise lives here so navigating away and back re-attaches to it.
 */

type ScanStore = {
  promise: Promise<string> | null; // resolves to scanId
  previewUrl: string | null;
  resolvedScanId: string | null;
  error: string | null;
};

const store: ScanStore = {
  promise: null,
  previewUrl: null,
  resolvedScanId: null,
  error: null,
};

/** Start a new scan. Returns a promise that resolves to scanId. */
export function startScan(file: File, previewUrl: string): Promise<string> {
  store.previewUrl = previewUrl;
  store.resolvedScanId = null;
  store.error = null;

  const promise = (async () => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/scans", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Analysis failed. Please try again.");
    return data.scan.id as string;
  })();

  // Cache resolved value so remounts can redirect immediately if already done
  promise
    .then((id) => { store.resolvedScanId = id; })
    .catch((err) => { store.error = err instanceof Error ? err.message : String(err); })
    .finally(() => { store.promise = null; });

  store.promise = promise;
  return promise;
}

/** Returns current in-flight scan state, or null if idle. */
export function getPendingScan(): { promise: Promise<string>; previewUrl: string } | null {
  if (store.promise && store.previewUrl) {
    return { promise: store.promise, previewUrl: store.previewUrl };
  }
  return null;
}

/** Returns resolved scan if completed while user was away. Clears it on read. */
export function popResolvedScan(): { scanId: string } | { error: string } | null {
  if (store.resolvedScanId) {
    const scanId = store.resolvedScanId;
    store.resolvedScanId = null;
    store.previewUrl = null;
    return { scanId };
  }
  if (store.error) {
    const error = store.error;
    store.error = null;
    store.previewUrl = null;
    return { error };
  }
  return null;
}

export function clearScan() {
  store.promise = null;
  store.previewUrl = null;
  store.resolvedScanId = null;
  store.error = null;
}
