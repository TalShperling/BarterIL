import { User } from '../../../entities/user.model';
import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { loadUserSuccess, loadUserFail, loginSuccess, logoutSuccess, registerSuccess } from '../actions/user.actions';

export const userFeatureKey = 'user';

export interface UserState {
  currentUser: User;
}

export const initialUserState: UserState = {
  currentUser: null
};

export const userReducer = createReducer(
  initialUserState,
  on(loginSuccess, (state, { user }) => ({ ...state, currentUser: user })),
  on(registerSuccess, (state, { user }) => ({ ...state, currentUser: user })),
  on(loadUserSuccess, (state, { user }) => ({ ...state, currentUser: user })),
  on(loadUserFail, (state) => ({ ...state, currentUser: null })),
  on(logoutSuccess, (state) => ({ ...state, currentUser: null }))
);

const selectUserState = createFeatureSelector<UserState>(userFeatureKey);

export const getUser = createSelector(selectUserState, (state) => state.currentUser);
export const isUserLoggedIn = createSelector(getUser, user => user !== null);
