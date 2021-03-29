import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  login,
  loginFail,
  loginSuccess,
  logout,
  logoutFail,
  logoutSuccess,
  register,
  registerFail,
  registerSuccess
} from '../actions/user.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthenticateService } from '../services/authentication.service';
import firebase from 'firebase';
import UserCredential = firebase.auth.UserCredential;
import { UsersService } from '../services/users.service';
import { User } from '../../../entities/user.model';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class UserEffects {
  loginUser$ = createEffect(() => this.actions$.pipe(
    ofType(login),
    switchMap(({email, password}) => this.authService.signIn(email, password)
      .pipe(
        switchMap((userCredential: UserCredential) => this.userService.getUserByID(userCredential.user.uid)),
        map((user: User) => loginSuccess({user})),
        catchError((err) => of(loginFail({message: err})))
      ))
    )
  );

  saveUserToStorage$ = createEffect(() => this.actions$.pipe(
    ofType(loginSuccess),
    tap(({user}) => this.authService.saveUserToLocalStorage(user))
    ), {dispatch: false}
  );

  logoutUser$ = createEffect(() => this.actions$.pipe(
    ofType(logout),
    switchMap(() => this.authService.logout()
      .pipe(
        map(() => logoutSuccess()),
        catchError((err) => of(logoutFail({message: err})))
      ))
    )
  );

  redirectOnLogout$ = createEffect(() => this.actions$.pipe(
    ofType(logoutSuccess),
    tap(() => this.router.navigateByUrl('/'))
    ), {dispatch: false}
  );

  redirectOnLogin$ = createEffect(() => this.actions$.pipe(
    ofType(registerSuccess, loginSuccess),
    tap(() => this.router.navigateByUrl('home'))
    ), {dispatch: false}
  );

  signUp$ = createEffect(() => this.actions$.pipe(
    ofType(register),
    switchMap(({user}) => this.authService.signUp(user.phoneNumber)
      .pipe(
        switchMap(([confirmationResult, code]) =>
          this.authService.verify(confirmationResult, code, user.email, user.password)),
        switchMap(() => this.userService.createNewUser({
          id: this.authService.getFirebaseCurrentUser().uid,
          firstName: user.firstName, lastName: user.lastName, phoneNumber: user.phoneNumber, email: user.email
        })),
        map((createdUser) => registerSuccess({user: createdUser})),
        catchError((err) => of(registerFail({message: err})))
      )),
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthenticateService,
    private userService: UsersService,
    private router: Router
  ) {
  }
}
