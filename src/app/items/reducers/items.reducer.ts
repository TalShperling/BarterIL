import {createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
import {Category} from 'src/entities/category.model';
import {Item} from 'src/entities/item.model';
import {
  createItemSuccess,
  deleteItemSuccess,
  initiateCategoriesSuccess,
  initiateItemsAndCategoriesSuccess,
  initiateItemsSuccess,
  updateItemSuccess
} from '../actions/items.actions';

export const itemsFeatureKey = 'items';

export interface ItemsState {
  items: Item[];
  categories: Category[];
}

export const initialItemsState: ItemsState = {
  items: [],
  categories: []
};

const setCategoriesToItem = (item: Item, categories: Category[]): Item => {
  const itemWithCategories: Item = Object.assign({}, item);
  let relevantCategories: Category[] = [];
  relevantCategories = categories.filter(cat => item.categories.map(itemCat => itemCat.id).includes(cat.id));

  itemWithCategories.categories = relevantCategories;

  return itemWithCategories;
};

export const itemsReducer = createReducer(
  initialItemsState,
  on(initiateItemsAndCategoriesSuccess, (state, {items, categories}) => ({
    ...state,
    categories,
    items: items.map(item => setCategoriesToItem(item, categories))

  })),
  on(initiateItemsSuccess, (state, {items}) => ({
    ...state,
    items: items.map(item => state?.categories?.length && setCategoriesToItem(item, state.categories))
  })),
  on(initiateCategoriesSuccess, (state, {categories}) => ({...state, categories})),
  on(deleteItemSuccess, (state, {deletedItemId}) => ({
    ...state,
    items: state.items.filter(item => item.id !== deletedItemId)
  })),
  on(createItemSuccess, (state, {newItem}) => ({...state, items: [...state.items, newItem]})),
  on(updateItemSuccess, (state, {updatedItem}) => ({
    ...state,
    items: state.items.map(item => item.id === updatedItem.id ? {...item, ...updatedItem} : item)
  })),
);

const selectItemsState = createFeatureSelector<ItemsState>(itemsFeatureKey);

export const getItems = createSelector(selectItemsState, (state) => state.items);
export const getCategories = createSelector(selectItemsState, (state) => state.categories);

export const getMyItems = (ownerId) => createSelector(selectItemsState, (state) => state.items.filter(item => item.ownerId === ownerId));
export const getTransactionItems = (ownerItemId, traderItemId) => createSelector(selectItemsState,
  (state) => state.items.filter(item => item.id === ownerItemId || item.id === traderItemId));
