import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import {
  createItem,
  createItemFail,
  createItemSuccess,
  deleteItem,
  deleteItemFail,
  deleteItemSuccess,
  initiateItems,
  initiateItemsFail,
  initiateItemsSuccess,
  updateItem,
  updateItemFail,
  updateItemSuccess
} from 'src/app/items/actions/items.actions';
import { ItemsService } from 'src/app/items/services/items.service';
import { getUser, UserState } from 'src/app/user/reducers/user.reducer';
import { Item } from 'src/entities/item.model';

@Injectable()
export class ItemsEffects {
  initiateItems$ = createEffect(() => this.actions$.pipe(
    ofType(initiateItems),
    switchMap(() => this.itemsService.getAll$()
      .pipe(
        map((items: Item[]) => initiateItemsSuccess({ items })),
        catchError((err) => of(initiateItemsFail({ message: err })))
      ))
  )
  );

  deleteItem$ = createEffect(() => this.actions$.pipe(
    ofType(deleteItem),
    switchMap(({ itemToDelete }) => this.itemsService.delete$(itemToDelete)
      .pipe(
        map(() => deleteItemSuccess({ deletedItemId: itemToDelete.id })),
        catchError((err) => of(deleteItemFail({ message: err })))
      ))
  )
  );

  updateItem$ = createEffect(() => this.actions$.pipe(
    ofType(updateItem),
    withLatestFrom(this.store$.pipe(select(getUser))),
    switchMap(([{ item }, user]) => {
      item.ownerId = user.id;
      
      return this.itemsService.upsert$(item)
        .pipe(
          map(() => updateItemSuccess({ updatedItem: item })),
          catchError((err) => of(updateItemFail({ message: err })))
        )
    })
  )
  );

  createItem$ = createEffect(() => this.actions$.pipe(
    ofType(createItem),
    switchMap(({ item }) => this.itemsService.upsert$(item)
      .pipe(
        map(() => createItemSuccess({ newItem: item })),
        catchError((err) => of(createItemFail({ message: err })))
      ))
  )
  );

  constructor(
    private actions$: Actions,
    private store$: Store<UserState>,
    private itemsService: ItemsService
  ) {
  }
}
