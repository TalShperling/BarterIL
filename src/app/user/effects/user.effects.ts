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
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class UserEffects {

  tryLoadingUser$ = createEffect(() => this.afAuth.user.pipe(
    switchMap((user) => this.userService.getById$(user.uid)),
    map((user) => loginSuccess({user})),
    catchError((err) => of(loginFail({message: err})))
  ));

  loginUser$ = createEffect(() => this.actions$.pipe(
    ofType(login),
    switchMap(({email, password}) => this.authService.signIn(email, password)
      .pipe(
        switchMap((userCredential: UserCredential) => this.userService.getById$(userCredential.user.uid)),
        map((user: User) => loginSuccess({user})),
        catchError((err) => of(loginFail({message: err})))
      ))
    )
  );

  saveUserToStorage$ = createEffect(() => this.actions$.pipe(
    ofType(loginSuccess, registerSuccess),
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
    ofType(logoutSuccess, loginFail),
    tap(() => {
      this.router.navigateByUrl('/');
      this.authService.removeUserFromLocalStorage();
    })
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
        switchMap(() => this.authService.getFirebaseCurrentUser$().pipe(
          switchMap(({uid}) => this.userService.upsert$({
          id: uid,
          ...user
        })))),
        map((createdUser) => registerSuccess({user: createdUser})),
        catchError((err) => of(registerFail({message: err})))
      )),
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthenticateService,
    private userService: UsersService,
    private router: Router,
    public afAuth: AngularFireAuth
  ) {
  }
}
