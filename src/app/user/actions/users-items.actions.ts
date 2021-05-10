import { createAction, props } from '@ngrx/store';
import { Item } from 'src/entities/item.model';
import { UserItems as UserItems } from 'src/entities/user-items.model';

const usersItemsActionNames = {
  INITIATE_USERS_ITEMS: '[UsersItems] Initiate users items',
  INITIATE_USERS_ITEMS_SUCCESS: '[UsersItems] Initiate users items succeeded',
  INITIATE_USERS_ITEMS_FAIL: '[UsersItems] Initiate users items failed',
  ADD_USER_ITEMS: '[UsersItems] Add user items',
  ADD_USER_ITEMS_SUCCESS: '[UsersItems] Add user items succeeded',
  ADD_USER_ITEMS_FAIL: '[UsersItems] Add user items failed',
  ADD_ITEM_TO_CURRENT_USER: '[UsersItems] Add Item to current user',
  ADD_ITEM_TO_CURRENT_USER_SUCCESS: '[UsersItems] Add Item to current user succeeded',
  ADD_ITEM_TO_CURRENT_USER_FAIL: '[UsersItems] Add Item to current user failed',
  REMOVE_ITEM_FROM_CURRENT_USER: '[UsersItems] Remove Item from current user',
  REMOVE_ITEM_FROM_CURRENT_USER_SUCCESS: '[UsersItems] Remove Item from current user succeeded',
  REMOVE_ITEM_FROM_CURRENT_USER_FAIL: '[UsersItems] Remove Item from current user failed',
  UPDATE_ITEM_AMOUNT: '[UsersItems] Update Item amount',
  UPDATE_ITEM_AMOUNT_SUCCESS: '[UsersItems] Update Item amount succeeded',
  UPDATE_ITEM_AMOUNT_FAIL: '[UsersItems] Update Item amount failed'
};

export const initiateUsersItems = createAction(usersItemsActionNames.INITIATE_USERS_ITEMS);
export const initiateUsersItemsSuccess = createAction(usersItemsActionNames.INITIATE_USERS_ITEMS_SUCCESS, props<{ usersItems: UserItems[] }>());
export const initiateUsersItemsFail = createAction(usersItemsActionNames.INITIATE_USERS_ITEMS_FAIL, props<{ message: string; }>());

export const addUserItem = createAction(usersItemsActionNames.ADD_USER_ITEMS, props<{ UserItemToAdd: UserItems }>());
export const addUserItemSuccess = createAction(usersItemsActionNames.ADD_USER_ITEMS_SUCCESS, props<{ userItems: UserItems }>());
export const addUserItemFail = createAction(usersItemsActionNames.ADD_USER_ITEMS_FAIL, props<{ message: string; }>());

export const addItemToCurrentUser = createAction(usersItemsActionNames.ADD_ITEM_TO_CURRENT_USER, props<{ itemToAdd: Item }>());
export const addItemToCurrentUserSuccess = createAction(usersItemsActionNames.ADD_ITEM_TO_CURRENT_USER_SUCCESS, props<{ updatedUserItems: UserItems }>());
export const addItemToCurrentUserFail = createAction(usersItemsActionNames.ADD_ITEM_TO_CURRENT_USER_FAIL, props<{ message: string; }>());

export const removeItemFromCurrentUser = createAction(usersItemsActionNames.REMOVE_ITEM_FROM_CURRENT_USER, props<{ itemToRemove: UserItems }>());
export const removeItemFromCurrentUserSuccess = createAction(usersItemsActionNames.REMOVE_ITEM_FROM_CURRENT_USER_SUCCESS, props<{ updatedUserItems: UserItems }>());
export const removeItemFromCurrentUserFail = createAction(usersItemsActionNames.REMOVE_ITEM_FROM_CURRENT_USER_FAIL, props<{ message: string; }>());

export const updateItemAmount = createAction(usersItemsActionNames.UPDATE_ITEM_AMOUNT, props<{ userItemsToUpdate: UserItems }>());
export const updateItemAmountSuccess = createAction(usersItemsActionNames.UPDATE_ITEM_AMOUNT_SUCCESS, props<{ userItems: UserItems }>());
export const updateItemAmountFail = createAction(usersItemsActionNames.UPDATE_ITEM_AMOUNT_FAIL, props<{ message: string; }>());
