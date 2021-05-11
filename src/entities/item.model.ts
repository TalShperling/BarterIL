export interface Item {
    id: string;
    name: string;
    amount?: number;
    categoryId: string;
    description: string;
    ownerId: string;
    pictureUrls: string[];
}
