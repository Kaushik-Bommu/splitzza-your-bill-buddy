import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface NormalizedItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
  sharedBy: string[];
}

export function normalizeItems(items: any[]): NormalizedItem[] {
  return items.map(item => ({
    id: item.id ?? "",
    name: item.name ?? "",
    price: Number(item.price ?? item.amount ?? 0),
    quantity: Number(item.quantity ?? 1),
    sharedBy: (item.sharedBy ?? item.sharedWith ?? []) as string[],
    emoji: item.emoji ?? "🍽️",
    ...item
  }));
}
