import { createAction, props } from '@ngrx/store';
import { Category } from 'src/entities/category.model';
import { Item } from 'src/entities/item.model';

const ItemsActionNames = {
  INITIATE_ITEMS_AND_CATEGORIES: '[Items] Initiate items and categories',
  INITIATE_ITEMS_AND_CATEGORIES_SUCCESS: '[Items] Initiate items and categories succeeded',
  INITIATE_ITEMS_AND_CATEGORIES_FAIL: '[Items] Initiate items and categories failed',
  INITIATE_CATEGORIES: '[Items] Initiate categories',
  INITIATE_CATEGORIES_SUCCESS: '[Items] Initiate categories succeeded',
  INITIATE_CATEGORIES_FAIL: '[Items] Initiate categories failed',
  INITIATE_ITEMS: '[Items] Initiate items',
  INITIATE_ITEMS_SUCCESS: '[Items] Initiate items succeeded',
  INITIATE_ITEMS_FAIL: '[Items] Initiate items failed',
  DELETE_ITEM: '[Items] Delete item',
  DELETE_ITEM_SUCCESS: '[Items] Delete item succeeded',
  DELETE_ITEM_FAIL: '[Items] Delete item failed',
  UPDATE_ITEM: '[Items] Update items',
  UPDATE_ITEM_SUCCESS: '[Items] Update item succeeded',
  UPDATE_ITEM_FAIL: '[Items] Update item failed',
  CREATE_ITEM: '[Items] Create item',
  CREATE_ITEM_SUCCESS: '[Items] Create item succeeded',
  CREATE_ITEM_FAIL: '[Items] Create item failed',
  UPDATE_ITEM_WITH_IMAGE: '[Items] Update item with image',
  UPDATE_ITEM_WITH_IMAGE_SUCCESS: '[Items] Update item with image succeeded',
  UPDATE_ITEM_WITH_IMAGE_FAIL: '[Items] Update item with image failed',
  CREATE_ITEM_WITH_IMAGE: '[Items] Create item with image',
  CREATE_ITEM_WITH_IMAGE_SUCCESS: '[Items] Create item with image succeeded',
  CREATE_ITEM_WITH_IMAGE_FAIL: '[Items] Create item with image failed',
  SEND_VIEW_DURATION: '[Items] Send view duration'
};

export const initiateItemsAndCategories = createAction(ItemsActionNames.INITIATE_ITEMS_AND_CATEGORIES);
export const initiateItemsAndCategoriesSuccess = createAction(ItemsActionNames.INITIATE_ITEMS_AND_CATEGORIES_SUCCESS, props<{ categories: Category[], items: Item[] }>());
export const initiateItemsAndCategoriesFail = createAction(ItemsActionNames.INITIATE_ITEMS_AND_CATEGORIES_FAIL, props<{ message: string; }>());

export const initiateCategories = createAction(ItemsActionNames.INITIATE_CATEGORIES);
export const initiateCategoriesSuccess = createAction(ItemsActionNames.INITIATE_CATEGORIES_SUCCESS, props<{ categories: Category[] }>());
export const initiateCategoriesFail = createAction(ItemsActionNames.INITIATE_CATEGORIES_FAIL, props<{ message: string; }>());

export const initiateItems = createAction(ItemsActionNames.INITIATE_ITEMS);
export const initiateItemsSuccess = createAction(ItemsActionNames.INITIATE_ITEMS_SUCCESS, props<{ items: Item[] }>());
export const initiateItemsFail = createAction(ItemsActionNames.INITIATE_ITEMS_FAIL, props<{ message: string; }>());

export const deleteItem = createAction(ItemsActionNames.DELETE_ITEM, props<{ itemToDelete: Item }>());
export const deleteItemSuccess = createAction(ItemsActionNames.DELETE_ITEM_SUCCESS, props<{ deletedItemId: string }>());
export const deleteItemFail = createAction(ItemsActionNames.DELETE_ITEM_FAIL, props<{ message: string; }>());

export const updateItem = createAction(ItemsActionNames.UPDATE_ITEM, props<{ item: Item }>());
export const updateItemSuccess = createAction(ItemsActionNames.UPDATE_ITEM_SUCCESS, props<{ updatedItem: Item }>());
export const updateItemFail = createAction(ItemsActionNames.UPDATE_ITEM_FAIL, props<{ message: string; }>());

export const updateItemWithImage = createAction(ItemsActionNames.UPDATE_ITEM_WITH_IMAGE, props<{ item: Item, itemImage: File }>());
export const updateItemWithImageSuccess = createAction(ItemsActionNames.UPDATE_ITEM_WITH_IMAGE_SUCCESS, props<{ updatedItem: Item }>());
export const updateItemWithImageFail = createAction(ItemsActionNames.UPDATE_ITEM_WITH_IMAGE_FAIL, props<{ message: string }>());

export const createItem = createAction(ItemsActionNames.CREATE_ITEM, props<{ item: Item }>());
export const createItemSuccess = createAction(ItemsActionNames.CREATE_ITEM_SUCCESS, props<{ newItem: Item }>());
export const createItemFail = createAction(ItemsActionNames.CREATE_ITEM_FAIL, props<{ message: string; }>());

export const createItemWithImage = createAction(ItemsActionNames.CREATE_ITEM_WITH_IMAGE, props<{ item: Item, itemImage: File }>());
export const createItemWithImageSuccess = createAction(ItemsActionNames.CREATE_ITEM_WITH_IMAGE_SUCCESS, props<{ newItem: Item }>());
export const createItemWithImageFail = createAction(ItemsActionNames.CREATE_ITEM_WITH_IMAGE_FAIL, props<{ message: string }>());

export const sendViewDuration = createAction(ItemsActionNames.SEND_VIEW_DURATION, props<{ itemId: string, duration: number }>());

