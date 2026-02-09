/** Dummy friend data for the app */
export interface Friend {
  id: string;
  name: string;
  avatar?: string;
}

export const dummyFriends: Friend[] = [
  { id: "f1", name: "Alex" },
  { id: "f2", name: "Sam" },
  { id: "f3", name: "Jordan" },
  { id: "f4", name: "Taylor" },
  { id: "f5", name: "Casey" },
  { id: "f6", name: "Morgan" },
];
