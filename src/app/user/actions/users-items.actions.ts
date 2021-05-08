import { createAction, props } from '@ngrx/store';
import { UserItems as UserItems } from 'src/entities/user-items.model';

const usersItemsActionNames = {
  INITIATE_USERS_ITEMS: '[UsersItems] Initiate users items',
  INITIATE_USERS_ITEMS_SUCCESS: '[UsersItems] Initiate users items succeeded',
  INITIATE_USERS_ITEMS_FAIL: '[UsersItems] Initiate users items failed',
  ADD_ITEM_TO_USER: '[UsersItems] Add Item to user',
  ADD_ITEM_TO_USER_SUCCESS: '[UsersItems] Add Item to user succeeded',
  ADD_ITEM_TO_USER_FAIL: '[UsersItems] Add Item to user failed',
  REMOVE_ITEM_FROM_USER: '[UsersItems] Remove Item from user',
  REMOVE_ITEM_FROM_USER_SUCCESS: '[UsersItems] Remove Item from user succeeded',
  REMOVE_ITEM_FROM_USER_FAIL: '[UsersItems] Remove Item from user failed',
  UPDATE_ITEM_AMOUNT: '[UsersItems] Update Item amount',
  UPDATE_ITEM_AMOUNT_SUCCESS: '[UsersItems] Update Item amount succeeded',
  UPDATE_ITEM_AMOUNT_FAIL: '[UsersItems] Update Item amount failed'
};

export const initiateUsersItems = createAction(usersItemsActionNames.INITIATE_USERS_ITEMS);
export const initiateUsersItemsSuccess = createAction(usersItemsActionNames.INITIATE_USERS_ITEMS_SUCCESS, props<{ usersItems: UserItems[] }>());
export const initiateUsersItemsFail = createAction(usersItemsActionNames.INITIATE_USERS_ITEMS_FAIL, props<{ message: string; }>());

export const addItemToUser = createAction(usersItemsActionNames.ADD_ITEM_TO_USER, props<{ userItemsToAdd: UserItems }>());
export const addItemToUserSuccess = createAction(usersItemsActionNames.ADD_ITEM_TO_USER_SUCCESS, props<{ userItems: UserItems }>());
export const addItemToUserFail = createAction(usersItemsActionNames.ADD_ITEM_TO_USER_FAIL, props<{ message: string; }>());

export const removeItemFromUser = createAction(usersItemsActionNames.REMOVE_ITEM_FROM_USER, props<{ userItemsToRemove: UserItems }>());
export const removeItemFromUserSuccess = createAction(usersItemsActionNames.REMOVE_ITEM_FROM_USER_SUCCESS, props<{ userItems: UserItems }>());
export const removeItemFromUserFail = createAction(usersItemsActionNames.REMOVE_ITEM_FROM_USER_FAIL, props<{ message: string; }>());

export const updateItemAmount = createAction(usersItemsActionNames.UPDATE_ITEM_AMOUNT, props<{ userItemsToUpdate: UserItems }>());
export const updateItemAmountSuccess = createAction(usersItemsActionNames.UPDATE_ITEM_AMOUNT_SUCCESS, props<{ userItems: UserItems }>());
export const updateItemAmountFail = createAction(usersItemsActionNames.UPDATE_ITEM_AMOUNT_FAIL, props<{ message: string; }>());
