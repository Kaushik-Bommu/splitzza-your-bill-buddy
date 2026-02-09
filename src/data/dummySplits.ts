/** Dummy data for recent bill splits */
export interface SplitItem {
  id: string;
  name: string;
  amount: number;
  sharedBy: string[];
}

export interface Split {
  id: string;
  restaurantName: string;
  date: string;
  totalAmount: number;
  people: string[];
  items: SplitItem[];
  settled: boolean;
}

export const dummySplits: Split[] = [
  {
    id: "1",
    restaurantName: "Mario's Pizzeria",
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
    restaurantName: "Sushi Haven",
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
    restaurantName: "Taco Fiesta",
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
];
