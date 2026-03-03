import { type Split } from "@/data/dummySplits";

const STORAGE_KEY = "splits";

export const getSplits = (): Split[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as Split[];
  } catch {
    return [];
  }
};

export const saveSplit = (split: Split): void => {
  const existing = getSplits();
  const updated = [split, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const deleteSplit = (id: string): void => {
  const existing = getSplits();
  const updated = existing.filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const createSplitObject = (
  splitName: string,
  totalAmount: number,
  items: { id: string; name: string; price: number; emoji: string; sharedBy: string[] }[],
  participants: string[]
): Split => {
  const splitItems = items.map((item) => ({
    id: item.id,
    name: item.name,
    amount: item.price,
    sharedBy: item.sharedBy,
  }));

  return {
    id: Date.now().toString(),
    restaurantName: splitName,
    date: new Date().toISOString().split("T")[0],
    totalAmount,
    people: participants,
    items: splitItems,
    settled: true,
  };
};
