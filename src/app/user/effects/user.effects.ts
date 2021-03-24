import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { login, loginFail, loginSuccess } from '../actions/user.actions';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { AuthenticateService } from '../../services/auth/authentication.service';
import firebase from 'firebase';
import UserCredential = firebase.auth.UserCredential;
import { UsersService } from '../../services/users/users.service';
import { User } from '../../../entities/user.model';

@Injectable()
export class UserEffects {
  loginUser$ = createEffect(() => this.actions$.pipe(
    ofType(login),
    mergeMap(({email, password}) => this.authService.signIn(email, password)
      .pipe(
        switchMap((userCredential: UserCredential) => this.userService.getUserByID(userCredential.user.uid)),
        map((user: User) => loginSuccess({user})),
        catchError(() => loginFail)
      ))
    )
  );

  saveUserToStorage$ = createEffect(() => this.actions$.pipe(
    ofType(loginSuccess),
    tap(({user}) => this.authService.saveUserToLocalStorage(user))
    ), {dispatch: false}
  );

  constructor(
    private actions$: Actions,
    private authService: AuthenticateService,
    private userService: UsersService
  ) {
  }
}
