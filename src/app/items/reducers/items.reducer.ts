import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { Item } from 'src/entities/item.model';
import { createItemSuccess, deleteItemSuccess, initiateItemsSuccess, updateItemSuccess } from '../actions/items.actions';

export const itemsFeatureKey = 'items';

export interface ItemsState {
  items: Item[];
}

export const initialItemsState: ItemsState = {
  items: []
};

export const itemsReducer = createReducer(
  initialItemsState,
  on(initiateItemsSuccess, (state, { items }) => ({ ...state, items: items })),
  on(deleteItemSuccess, (state, { deletedItemId }) => ({ ...state, items: state.items.filter(item => item.id === deletedItemId) })),
  on(createItemSuccess, (state, { newItem }) => ({ ...state, items: [...state.items, newItem] })),
  on(updateItemSuccess, (state, { updatedItem }) => ({ ...state, items: state.items.map(item => item.id === updatedItem.id ? {...item, ...updatedItem} : item) })),
);

const selectItemsState = createFeatureSelector<ItemsState>(itemsFeatureKey);

export const getItems = createSelector(selectItemsState, (state) => state.items);
