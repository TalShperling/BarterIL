import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {
  login,
  loginFail,
  loginSuccess,
  logout,
  logoutFail,
  logoutSuccess,
  register,
  registerFail,
  registerSuccess, update, updateFail, updateSuccess, updateWithoutPhone
} from '../actions/user.actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {AuthenticateService} from '../services/authentication.service';
import firebase from 'firebase';
import UserCredential = firebase.auth.UserCredential;
import {UsersService} from '../services/users.service';
import {User} from '../../../entities/user.model';
import {of} from 'rxjs';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {omit} from 'lodash';

@Injectable()
export class UserEffects {

  tryLoadingUser$ = createEffect(() => this.angularFireAuth.user.pipe(
    switchMap((user) => this.userService.getById$(user.uid)),
    map((user) => loginSuccess({user})),
    catchError((err) => of(loginFail({message: err})))
  ));

  loginUser$ = createEffect(() => this.actions$.pipe(
    ofType(login),
    switchMap(({email, password}) => this.authService.signIn$(email, password)
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
    switchMap(() => this.authService.logout$()
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
    ofType(registerSuccess, loginSuccess, updateSuccess),
    tap(() => this.router.navigateByUrl('home'))
    ), {dispatch: false}
  );

  signUp$ = createEffect(() => this.actions$.pipe(
    ofType(register),
    switchMap(({user}) => this.authService.signUp$(user.phoneNumber)
      .pipe(
        switchMap(([confirmationResult, code]) =>
          this.authService.verify$(confirmationResult, code, user.email, user.password)),
        switchMap(() => this.authService.getFirebaseCurrentUser$().pipe(
          switchMap(({uid}) => this.userService.upsert$({
            id: uid,
            ...omit(user, 'password')
          })))),
        map((createdUser) => registerSuccess({user: createdUser})),
        catchError((err) => of(registerFail({message: err})))
      )),
    )
  );

  updateUserWithoutPhone$ = createEffect(() => this.actions$.pipe(
    ofType(updateWithoutPhone),
    switchMap(({user}) => this.authService.updateUserEmail(user.email)
      .pipe(
        switchMap(() => this.userService.upsert$(user)),
        map((updatedUser: User) => updateSuccess({user: updatedUser})),
        catchError((err) => of(updateFail({message: err})))
      ))
    )
  );

  updateUserWithPhone$ = createEffect(() => this.actions$.pipe(
    ofType(update),
    switchMap(({user}) => this.authService.verifyPhoneNumberAndCode(user.phoneNumber)
      .pipe(switchMap(([confirmationResult, code]) =>
        this.authService.updateUserPhoneNumber(confirmationResult, code)
          .pipe(switchMap(() => this.authService.updateUserEmailWithAuthentication(confirmationResult, code, user.email)))),
        switchMap(() => this.userService.upsert$(user)),
        map((updatedUser: User) => updateSuccess({user: updatedUser})),
        catchError((err) => of(updateFail({message: err})))
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthenticateService,
    private userService: UsersService,
    private router: Router,
    public angularFireAuth: AngularFireAuth
  ) {
  }
}
