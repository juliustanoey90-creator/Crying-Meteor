/** Public static images — edit files in public/assets/images/ */
export const ASSETS = "/assets/images";

export function assetPath(filename: string): string {
  return `${ASSETS}/${filename}`;
}
