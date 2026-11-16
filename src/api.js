const BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export async function verifyDocument(file, docType) {
  // ... (keep your existing verifyDocument code here)
}

export async function verifyFace(nin, selfieFile) {
  // --- MOCK VERSION FOR TESTING UI WITHOUT DB ---
  // Remove this block and uncomment the real fetch below when you have the DB ready.

  await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

  if (nin === "00000000000") {
    // Just to test a failure state
    return { distance: 0.85, threshold: 0.65, verified: false };
  }

  return { distance: 0.35, threshold: 0.65, verified: true };

  /* --- REAL VERSION (Uncomment when backend is ready) ---
  const fd = new FormData();
  fd.append("nin", nin);
  fd.append("selfie", selfieFile);
  
  const res = await fetch(`${BASE}/verify/face`, {
    method: "POST",
    body: fd,
  });
  
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.detail || "Face verification failed");
  }
  return body;
  */
}
