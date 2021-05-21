import { Category } from "./category.model";

export interface Item {
    id: string;
    name: string;
    amount?: number;
    categories: Category[];
    description: string;
    ownerId: string;
    pictureUrls: string[];
}