export function buildPreviewUrl(listingUrl: string): string {
  if (!listingUrl) return "";
  try {
    const u = new URL(listingUrl);
    if (u.protocol !== "http:" && u.protocol !== "https:") return "";
  } catch {
    return "";
  }
  const target = listingUrl.replace(/\/+$/, "") + "/foto/1/";
  return `https://image.thum.io/get/width/800/crop/450/wait/2/${target}`;
}
