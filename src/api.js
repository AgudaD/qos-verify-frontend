const BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export async function verifyFace(userId, selfieFile) {
  const fd = new FormData();
  fd.append("user_id", userId);
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
