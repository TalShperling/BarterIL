import {User} from '../../../entities/user.model';
import {createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
import {
  initiateUsersSuccess,
  loginSuccess,
  logoutSuccess,
  registerSuccess,
  updateSuccess,
  updateSuperficialDataSuccess
} from '../actions/user.actions';

export const userFeatureKey = 'user';

export interface UserState {
  currentUser: User;
  users: User[];
}

export const initialUserState: UserState = {
  currentUser: null,
  users: []
};

export const userReducer = createReducer(
  initialUserState,
  on(loginSuccess, (state, {user}) => ({...state, currentUser: user})),
  on(initiateUsersSuccess, (state, {users}) => ({...state, users})),
  on(registerSuccess, (state, {user}) => ({...state, currentUser: user})),
  on(logoutSuccess, (state) => ({...state, currentUser: null})),
  on(updateSuccess, (state, {user}) => ({...state, currentUser: user})),
  on(updateSuperficialDataSuccess, (state, {user}) => ({
    ...state,
    users: state.users.map(currentUser => currentUser.id === user.id ? {...currentUser, ...user} : currentUser)
  }))
);

const selectUserState = createFeatureSelector<UserState>(userFeatureKey);

export const getUser = createSelector(selectUserState, (state) => state.currentUser);
export const getUsers = createSelector(selectUserState, (state) => state.users);
export const isUserLoggedIn = createSelector(getUser, user => user !== null);
