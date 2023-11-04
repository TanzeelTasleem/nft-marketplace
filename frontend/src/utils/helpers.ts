export const IS_SERVER = typeof window === "undefined";
export function getProtocol() {
  const isProd = process.env.VERCEL_ENV === "production";
  const isPreview = process.env.VERCEL_ENV === "preview";
  if (isProd || isPreview) return "https://";
  return "http://";
}
export function getAbsoluteUrl() {
  //get absolute url in client/browser
  if (!IS_SERVER) {
    return location.origin;
  }
  //get absolute url in server.
  const protocol = getProtocol();
  const isProd = process.env.VERCEL_ENV === "production";

  if (isProd ) {
    return `${protocol}${process.env.VERCEL_URL_DEPLOYED}`;
  }

  if (process.env.VERCEL_URL) {
    return `${protocol}${process.env.VERCEL_URL}`;
  }
}
export async function delay(delayTime: number) {
  await new Promise((resolve) => { setTimeout(resolve, delayTime) })
}
