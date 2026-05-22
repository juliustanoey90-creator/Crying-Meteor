
export type Rarity = "COMMON" | "UNCOMMON" | "RARE" | "LEGENDARY";

export interface Character {
  id: string;
  name: string;
  rarity: Rarity;
  description: string;
  quirk: string;
  sprite: string;
  color: string;
  themeId?: string;
}
