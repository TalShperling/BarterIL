import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserItems } from 'src/entities/user-items.model';
import { User } from 'src/entities/user.model';
import { loginSuccess, logoutSuccess } from '../actions/user.actions';
import { addItemToUser, addItemToUserFail, addItemToUserSuccess, initiateUsersItems, initiateUsersItemsFail, initiateUsersItemsSuccess, removeItemFromUser, removeItemFromUserFail, removeItemFromUserSuccess, updateItemAmount, updateItemAmountFail, updateItemAmountSuccess } from '../actions/users-items.actions';
import { UserItemsService } from '../services/user-items-service';

@Injectable()
export class ItemsEffects {
  initiateUsersItems$ = createEffect(() => this.actions$.pipe(
    ofType(initiateUsersItems),
    switchMap(() => this.userItemsService.getAll$()
      .pipe(
        map((usersItems: UserItems[]) => initiateUsersItemsSuccess({ usersItems })),
        catchError((err) => of(initiateUsersItemsFail({ message: err })))
      ))
  )
  );

  removeItemFromUser$ = createEffect(() => this.actions$.pipe(
    ofType(removeItemFromUser),
    switchMap(({ userItemsToRemove }) => this.userItemsService.delete$(userItemsToRemove)
      .pipe(
        map(() => removeItemFromUserSuccess({ userItems: userItemsToRemove })),
        catchError((err) => of(removeItemFromUserFail({ message: err })))
      ))
  )
  );

  addItemToUser$ = createEffect(() => this.actions$.pipe(
    ofType(addItemToUser),
    switchMap(({ userItemsToAdd }) => this.userItemsService.upsert$(userItemsToAdd)
      .pipe(
        map(() => addItemToUserSuccess({ userItems: userItemsToAdd })),
        catchError((err) => of(addItemToUserFail({ message: err })))
      ))
  )
  );

  updateItemAmount$ = createEffect(() => this.actions$.pipe(
    ofType(updateItemAmount),
    switchMap(({ userItemsToUpdate }) => this.userItemsService.upsert$(userItemsToUpdate)
      .pipe(
        map(() => updateItemAmountSuccess({ userItems: userItemsToUpdate })),
        catchError((err) => of(updateItemAmountFail({ message: err })))
      ))
  )
  );

  getCurrentUserItems$ = createEffect(() => this.actions$.pipe(
    ofType(loginSuccess),
    switchMap((data: { user: User }) => this.userItemsService.getById$(data.user.id)
      .pipe(
        map((userItemsToAdd: UserItems) => addItemToUserSuccess({ userItems: userItemsToAdd })),
        catchError((err) => of(addItemToUserFail({ message: err })))
      ))
  )
  );

  removeCurrentUserItems$ = createEffect(() => this.actions$.pipe(
    ofType(logoutSuccess),
    map(() => initiateUsersItemsSuccess({ usersItems: [] }))
  )
  );

  constructor(
    private actions$: Actions,
    private userItemsService: UserItemsService
  ) {
  }
}
