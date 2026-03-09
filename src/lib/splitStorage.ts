import { type Split } from "@/data/dummySplits";

const STORAGE_KEY = "splits";

// New interface for uneven distribution
interface SharedByEntry {
  personId: string;
  quantity: number;
}

export interface SplitItemInput {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
  // Support both old format (string[]) and new format (SharedByEntry[])
  sharedBy: string[] | SharedByEntry[];
}

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
  items: SplitItemInput[],
  participants: string[]
): Split => {
  // Convert items to storage format
  const splitItems = items.map((item) => {
    // Handle both old and new format
    const sharedBy = item.sharedBy;
    const isNewFormat = typeof sharedBy[0] === 'object' && 'personId' in (sharedBy[0] as SharedByEntry);
    
    return {
      id: item.id,
      name: item.name,
      amount: item.price * (item.quantity || 1),
      sharedBy: isNewFormat ? sharedBy : sharedBy.map(personId => ({ personId, quantity: 1 })),
    };
  });

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

