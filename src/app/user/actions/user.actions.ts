import { createAction, props } from '@ngrx/store';
import { User } from '../../../entities/user.model';

const userActionNames = {
  LOAD_USER: '[User] Load user from storage',
  LOAD_USER_SUCCESS: '[User] Load user succeeded',
  LOAD_USER_FAIL: '[User] Load user failed',
  LOGIN: '[User] Login',
  LOGIN_SUCCESS: '[User] Login succeeded',
  LOGIN_FAIL: '[User] Login failed',
  LOGOUT: '[User] Logout',
  LOGOUT_SUCCESS: '[User] Logout succeeded',
  LOGOUT_FAIL: '[User] Logout failed',
  REGISTER: '[User] Register',
  REGISTER_SUCCESS: '[User] Register succeeded',
  REGISTER_FAIL: '[User] Register failed',
};

export const loadUser = createAction(userActionNames.LOAD_USER);
export const loadUserSuccess = createAction(userActionNames.LOAD_USER_SUCCESS, props<{ user: User }>());
export const loadUserFail = createAction(userActionNames.LOAD_USER_FAIL);

export const login = createAction(userActionNames.LOGIN, props<{ email: string; password: string; }>());
export const loginSuccess = createAction(userActionNames.LOGIN_SUCCESS, props<{ user: User }>());
export const loginFail = createAction(userActionNames.LOGIN_FAIL, props<{ message: string; }>());

export const logout = createAction(userActionNames.LOGOUT);
export const logoutSuccess = createAction(userActionNames.LOGOUT_SUCCESS);
export const logoutFail = createAction(userActionNames.LOGOUT_FAIL, props<{ message: string; }>());

export const register = createAction(userActionNames.REGISTER,
  props<{ user: User & { password: string; } }>()
);
export const registerSuccess = createAction(userActionNames.REGISTER_SUCCESS, props<{ user: User }>());
export const registerFail = createAction(userActionNames.REGISTER_FAIL, props<{ message: string; }>());
