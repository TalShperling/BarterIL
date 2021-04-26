import { createAction, props } from "@ngrx/store";
import { Item } from "src/entities/item.model";

const ItemsActionNames = {
  SET_ITEMS: '[Items] Set items',
  SET_ITEMS_SUCCESS: '[Items] Set items succeeded',
  SET_ITEMS_FAIL: '[Items] Set items failed',
  DELETE_ITEM: '[Items] Delete item',
  DELETE_ITEM_SUCCESS: '[Items] Delete item succeeded',
  DELETE_ITEM_FAIL: '[Items] Delete item failed',
  UPDATE_ITEM: '[Items] Update items',
  UPDATE_ITEM_SUCCESS: '[Items] Update item succeeded',
  UPDATE_ITEM_FAIL: '[Items] Update item failed',
  CREATE_ITEM: '[Items] Create item',
  CREATE_ITEM_SUCCESS: '[Items] Create item succeeded',
  CREATE_ITEM_FAIL: '[Items] Create item failed',
};

export const setItems = createAction(ItemsActionNames.SET_ITEMS);
export const setItemsSuccess = createAction(ItemsActionNames.SET_ITEMS_SUCCESS, props<{ items: Item[] }>());
export const setItemsFail = createAction(ItemsActionNames.SET_ITEMS_FAIL, props<{ message: string; }>());

export const deleteItem = createAction(ItemsActionNames.DELETE_ITEM, props<{itemToDelete: Item}>());
export const deleteItemSuccess = createAction(ItemsActionNames.DELETE_ITEM_SUCCESS, props<{ deletedItemId: string }>());
export const deleteItemFail = createAction(ItemsActionNames.DELETE_ITEM_FAIL, props<{ message: string; }>());

export const updateItem = createAction(ItemsActionNames.UPDATE_ITEM, props<{item: Item}>());
export const updateItemSuccess = createAction(ItemsActionNames.UPDATE_ITEM_SUCCESS, props<{ updatedItem: Item }>());
export const updateItemFail = createAction(ItemsActionNames.UPDATE_ITEM_FAIL, props<{ message: string; }>());

export const createItem = createAction(ItemsActionNames.CREATE_ITEM, props<{item: Item}>());
export const createItemSuccess = createAction(ItemsActionNames.CREATE_ITEM_SUCCESS, props<{ newItem: Item }>());
export const createItemFail = createAction(ItemsActionNames.CREATE_ITEM_FAIL, props<{ message: string; }>());
