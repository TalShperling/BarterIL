export interface Item {
    id: string;
    name: string;
    amount?: number;
    categoryId: string;
    description: string;
    pictureUrls: string[];
}
