/** Dummy data for split events (Splitwise-style) */
export interface SplitItem {
  id: string;
  name: string;
  amount: number;
  sharedBy: string[];
}

export interface Split {
  id: string;
  groupName: string;
  emoji: string;
  date: string;
  totalAmount: number;
  people: string[];
  items: SplitItem[];
  settled: boolean;
}

export const dummySplits: Split[] = [
  {
    id: "1",
    groupName: "Friday Night Gang",
    emoji: "🍕",
    date: "2026-02-07",
    totalAmount: 78.50,
    people: ["You", "Alex", "Sam"],
    items: [
      { id: "1a", name: "Margherita Pizza", amount: 18.00, sharedBy: ["You", "Alex", "Sam"] },
      { id: "1b", name: "Pasta Carbonara", amount: 22.00, sharedBy: ["Alex"] },
      { id: "1c", name: "Tiramisu", amount: 12.50, sharedBy: ["You", "Sam"] },
      { id: "1d", name: "Drinks", amount: 26.00, sharedBy: ["You", "Alex", "Sam"] },
    ],
    settled: false,
  },
  {
    id: "2",
    groupName: "Sushi Squad",
    emoji: "🍣",
    date: "2026-02-04",
    totalAmount: 124.00,
    people: ["You", "Jordan", "Taylor", "Casey"],
    items: [
      { id: "2a", name: "Sashimi Platter", amount: 45.00, sharedBy: ["You", "Jordan", "Taylor", "Casey"] },
      { id: "2b", name: "Ramen", amount: 16.00, sharedBy: ["Casey"] },
      { id: "2c", name: "Edamame", amount: 8.00, sharedBy: ["You", "Jordan"] },
      { id: "2d", name: "Sake", amount: 55.00, sharedBy: ["You", "Jordan", "Taylor", "Casey"] },
    ],
    settled: true,
  },
  {
    id: "3",
    groupName: "Taco Tuesday",
    emoji: "🌮",
    date: "2026-01-28",
    totalAmount: 52.75,
    people: ["You", "Morgan"],
    items: [
      { id: "3a", name: "Tacos al Pastor", amount: 14.50, sharedBy: ["You"] },
      { id: "3b", name: "Burrito Bowl", amount: 15.25, sharedBy: ["Morgan"] },
      { id: "3c", name: "Nachos Grande", amount: 13.00, sharedBy: ["You", "Morgan"] },
      { id: "3d", name: "Margaritas", amount: 10.00, sharedBy: ["You", "Morgan"] },
    ],
    settled: true,
  },
  {
    id: "4",
    groupName: "Brunch Club",
    emoji: "🥞",
    date: "2026-01-20",
    totalAmount: 96.30,
    people: ["You", "Alex", "Casey", "Jordan"],
    items: [
      { id: "4a", name: "Pancake Stack", amount: 16.00, sharedBy: ["You", "Alex"] },
      { id: "4b", name: "Eggs Benedict", amount: 19.50, sharedBy: ["Casey"] },
      { id: "4c", name: "Mimosa Pitcher", amount: 28.00, sharedBy: ["You", "Alex", "Casey", "Jordan"] },
      { id: "4d", name: "Avocado Toast", amount: 14.80, sharedBy: ["Jordan"] },
      { id: "4e", name: "Coffee Rounds", amount: 18.00, sharedBy: ["You", "Alex", "Casey", "Jordan"] },
    ],
    settled: false,
  },
  {
    id: "5",
    groupName: "Office Lunch",
    emoji: "🥗",
    date: "2026-01-15",
    totalAmount: 67.20,
    people: ["You", "Sam", "Taylor"],
    items: [
      { id: "5a", name: "Caesar Salad", amount: 14.00, sharedBy: ["You"] },
      { id: "5b", name: "Club Sandwich", amount: 16.50, sharedBy: ["Sam"] },
      { id: "5c", name: "Soup & Bread", amount: 12.70, sharedBy: ["Taylor"] },
      { id: "5d", name: "Drinks & Tip", amount: 24.00, sharedBy: ["You", "Sam", "Taylor"] },
    ],
    settled: true,
  },
];
