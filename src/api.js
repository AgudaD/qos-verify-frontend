const BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export async function verifyFace(idFaceB64, selfieFile) {
  const fd = new FormData();
  fd.append("id_face_b64", idFaceB64);
  fd.append("selfie", selfieFile);
  const res = await fetch(
    `${BASE}/verify/face?ngrok-skip-browser-warning=true`,
    {
      method: "POST",
      body: fd,
    },
  );
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.detail || "Face verification failed");
  return body;
}
