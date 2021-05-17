import { Category } from "./category.model";

export interface Item {
    id: string;
    name: string;
    amount?: number;
    categoryIds: string[];
    description: string;
    ownerId: string;
    pictureUrls: string[];
}

export interface ItemAndCategories {
    id: string;
    name: string;
    amount?: number;
    categories: Category[];
    description: string;
    ownerId: string;
    pictureUrls: string[];
}

export const itemAndCategoriesFactory = (item: Item, categories: Category[]): ItemAndCategories => {
    let itemWithoutCategories: Item = Object.assign({}, item );
    delete itemWithoutCategories.categoryIds;
    
    let itemAndCategories: ItemAndCategories = { ...itemWithoutCategories, categories: categories };

    return itemAndCategories;
}

export const getItemFromItemAndCategories = (itemAndCategories: ItemAndCategories): Item => {
    let item: Item = {...itemAndCategories, categoryIds: itemAndCategories.categories.map(category => category.id)};

    return item;
}