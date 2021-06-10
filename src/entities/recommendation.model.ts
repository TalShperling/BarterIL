export interface Recommendation {
  id: string;
  items: Array<{ itemId: string; rate: number; }>;
}
