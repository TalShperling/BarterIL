import { createAction, props } from '@ngrx/store';
import { User } from '../../../entities/user.model';

const userActionNames = {
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

export const login = createAction(userActionNames.LOGIN, props<{ email: string; password: string; }>());
export const loginSuccess = createAction(userActionNames.LOGIN_SUCCESS, props<{ user: User }>());
export const loginFail = createAction(userActionNames.LOGIN_FAIL, props<{ message: string; }>());

export const logout = createAction(userActionNames.LOGOUT);
export const logoutSuccess = createAction(userActionNames.LOGOUT_SUCCESS);
export const logoutFail = createAction(userActionNames.LOGOUT_FAIL, props<{ message: string; }>());

export const register = createAction(userActionNames.REGISTER,
  props<{ user: Omit<User, 'id'> & { password: string; } }>()
);
export const registerSuccess = createAction(userActionNames.REGISTER_SUCCESS, props<{ user: User }>());
export const registerFail = createAction(userActionNames.REGISTER_FAIL, props<{ message: string; }>());