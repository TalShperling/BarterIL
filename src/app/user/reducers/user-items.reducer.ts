import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { UserItems } from 'src/entities/user-items.model';
import { User } from 'src/entities/user.model';
import { addItemToUserSuccess, initiateUsersItemsSuccess, removeItemFromUserSuccess, updateItemAmountSuccess } from '../actions/users-items.actions';
import { getUser } from './user.reducer';

export const userItemsFeatureKey = 'user_items';

export interface UserItemsState {
    usersItems: UserItems[];
}

export const initialUserItemsState: UserItemsState = {
    usersItems: []
};

export const userReducer = createReducer(
    initialUserItemsState,
    on(initiateUsersItemsSuccess, (state, { usersItems }) => ({ ...state, usersItems })),
    on(addItemToUserSuccess, (state, { userItems }) => ({ ...state, usersItems: [...state.usersItems, userItems] })),
    on(removeItemFromUserSuccess, (state, { userItems }) => ({ ...state, usersItems: state.usersItems.filter(userItem => userItem.id !== userItems.id) })),
    on(updateItemAmountSuccess, (state, { userItems }) => ({
        ...state,
        userItems: state.usersItems.map(userItem => userItem.id === userItems.id ? { ...userItem, ...userItems } : userItem)
    })),
);

const selectUserItemsState = createFeatureSelector<UserItemsState>(userItemsFeatureKey);

export const getCurrentUserItems = createSelector(selectUserItemsState, getUser, (state: UserItemsState, currentUser: User) => {
    if (state && currentUser) {
        return state.usersItems.find(userItem => userItem.id === currentUser.id);
    } else {
        return state;
    }
});

