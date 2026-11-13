const BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export async function verifyDocument(file, docType) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${BASE}/verify/document?doc_type=${docType}`, {
    method: "POST",
    body: fd,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.detail || "Document verification failed");
  }
  return body;
}

export async function verifyFace(idFaceB64, selfieFile) {
  const fd = new FormData();
  fd.append("id_face_b64", idFaceB64);
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
}
