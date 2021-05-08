import {createAction, props} from '@ngrx/store';
import {User} from '../../../entities/user.model';

const userActionNames = {
  INITIATE_USERS: '[Users] Initiate users',
  INITIATE_USERS_SUCCESS: '[Users] Initiate users succeeded',
  INITIATE_USERS_FAIL: '[Users] Initiate users failed',
  LOGIN: '[User] Login',
  LOGIN_SUCCESS: '[User] Login succeeded',
  LOGIN_FAIL: '[User] Login failed',
  LOGOUT: '[User] Logout',
  LOGOUT_SUCCESS: '[User] Logout succeeded',
  LOGOUT_FAIL: '[User] Logout failed',
  REGISTER: '[User] Register',
  REGISTER_SUCCESS: '[User] Register succeeded',
  REGISTER_FAIL: '[User] Register failed',
  UPDATE: '[User] Update',
  UPDATE_WITHOUT_PHONE: '[User] Update without phone',
  UPDATE_SUPERFICIAL_DATA: '[User] Update superficial data',
  UPDATE_SUCCESS: '[User] Update succeeded',
  UPDATE_FAIL: '[User] Update failed',
};

export const initiateUsers = createAction(userActionNames.INITIATE_USERS);
export const initiateUsersSuccess = createAction(userActionNames.INITIATE_USERS_SUCCESS, props<{ users: User[] }>());
export const initiateUsersFail = createAction(userActionNames.INITIATE_USERS_FAIL, props<{ message: string; }>());

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

export const update = createAction(userActionNames.UPDATE, props<{ user: User }>());
export const updateWithoutPhone = createAction(userActionNames.UPDATE_WITHOUT_PHONE, props<{ user: User }>());
export const updateSuperficialData = createAction(userActionNames.UPDATE_SUPERFICIAL_DATA, props<{ user: User }>());
export const updateSuccess = createAction(userActionNames.UPDATE_SUCCESS, props<{ user: User }>());
export const updateFail = createAction(userActionNames.UPDATE_FAIL, props<{ message: string; }>());
