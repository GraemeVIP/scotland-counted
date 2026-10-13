/** Read untrusted request bodies with a byte limit even without Content-Length. */
export async function readLimitedBody(request: Request, limit = 64 * 1024): Promise<Uint8Array> {
  const declared = Number(request.headers.get("content-length"));
  if (declared > limit) throw new RangeError("Request is too large");
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) { await reader.cancel(); throw new RangeError("Request is too large"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return bytes;
}
