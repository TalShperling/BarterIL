import { User } from '../../../entities/user.model';
import { createReducer, on } from '@ngrx/store';
import { loadUserSuccess, loadUserFail, loginSuccess, logoutSuccess } from '../actions/user.actions';

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
  on(loadUserSuccess, (state, { user }) => ({ ...state, currentUser: user })),
  on(loadUserFail, (state) => ({ ...state, currentUser: null })),
  on(logoutSuccess, (state) => ({ ...state, currentUser: null }))
);
