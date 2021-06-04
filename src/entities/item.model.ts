import { Category } from './category.model';

export interface Item {
    id: string;
    name: string;
    categories: Category[];
    description: string;
    ownerId: string;
    pictureUrls: string[];
    isLoaned: boolean;
}
