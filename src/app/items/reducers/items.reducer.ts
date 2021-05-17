import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { Category } from 'src/entities/category.model';
import { Item, itemAndCategoriesFactory } from 'src/entities/item.model';
import { createItemSuccess, deleteItemSuccess, initiateCategoriesSuccess, initiateItemsSuccess, updateItemSuccess } from '../actions/items.actions';

export const itemsFeatureKey = 'items';

export interface ItemsState {
  items: Item[];
  categories: Category[];
}

export const initialItemsState: ItemsState = {
  items: [],
  categories: []
};

export const itemsReducer = createReducer(
  initialItemsState,
  on(initiateItemsSuccess, (state, { items }) => ({ ...state, items })),
  on(initiateCategoriesSuccess, (state, { categories }) => ({ ...state, categories })),
  on(deleteItemSuccess, (state, { deletedItemId }) => ({ ...state, items: state.items.filter(item => item.id !== deletedItemId) })),
  on(createItemSuccess, (state, { newItem }) => ({ ...state, items: [...state.items, newItem] })),
  on(updateItemSuccess, (state, { updatedItem }) => ({
    ...state,
    items: state.items.map(item => item.id === updatedItem.id ? { ...item, ...updatedItem } : item)
  })),
);

const selectItemsState = createFeatureSelector<ItemsState>(itemsFeatureKey);

export const getItems = createSelector(selectItemsState, (state) => state.items);
export const getCategories = createSelector(selectItemsState, (state) => state.categories);
export const getItemsAndCategories = createSelector(selectItemsState, (state) => {
  
  let result = state.items.map(item => {
    let relevantCategories = state.categories.filter(category => item.categoryIds?.includes(category.id));
    let resultFactory = itemAndCategoriesFactory(item, relevantCategories);

    return resultFactory;
  }); 
  
  return result;
});
