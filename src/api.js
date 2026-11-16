export async function verifyFace(userId, selfieFile) {
  const fd = new FormData();
  fd.append("user_id", userId); // Send the mocked user ID
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
