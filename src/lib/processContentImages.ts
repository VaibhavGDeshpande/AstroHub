/**
 * processContentImages
 *
 * Finds all base64 data-URI images in an HTML string, uploads each to the
 * server via /api/upload, and replaces the data URIs with the returned
 * permanent URLs. Images that are already regular URLs are left untouched.
 *
 * Call this right before saving a blog post to ensure only images that
 * survive editing actually get stored.
 */
export async function processContentImages(html: string): Promise<string> {
  // Match all <img> tags with base64 src
  const imgRegex = /<img\b([^>]*)\bsrc="(data:[^"]+)"([^>]*)>/gi;

  // Collect all matches first
  const matches: { full: string; before: string; dataUri: string; after: string }[] = [];
  let match: RegExpExecArray | null;
  while ((match = imgRegex.exec(html)) !== null) {
    matches.push({
      full: match[0],
      before: match[1],
      dataUri: match[2],
      after: match[3],
    });
  }

  if (matches.length === 0) return html;

  // Upload all base64 images concurrently
  const uploads = await Promise.allSettled(
    matches.map(async (m) => {
      const blob = dataUriToBlob(m.dataUri);
      const ext = blob.type.split('/')[1] || 'webp';
      const file = new File([blob], `editor-image.${ext}`, { type: blob.type });

      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      const data = await res.json();
      return { match: m, url: data.url as string };
    })
  );

  // Replace data URIs with uploaded URLs
  let result = html;
  for (const outcome of uploads) {
    if (outcome.status === 'fulfilled') {
      const { match: m, url } = outcome.value;
      const newTag = `<img${m.before}src="${url}"${m.after}>`;
      result = result.replace(m.full, newTag);
    }
    // If upload failed, leave the base64 in place as fallback
  }

  return result;
}

/* ── helper: convert data URI to Blob ── */
function dataUriToBlob(dataUri: string): Blob {
  const [header, base64] = dataUri.split(',');
  const mime = header.match(/:(.*?);/)?.[1] || 'image/webp';
  const bytes = atob(base64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mime });
}
