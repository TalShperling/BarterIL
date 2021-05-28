import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import {
  createItem,
  createItemFail,
  createItemSuccess,
  createItemWithImage,
  createItemWithImageSuccess,
  deleteItem,
  deleteItemFail,
  deleteItemSuccess,
  initiateCategories,
  initiateCategoriesFail,
  initiateCategoriesSuccess,
  initiateItems,
  initiateItemsAndCategories,
  initiateItemsAndCategoriesFail,
  initiateItemsAndCategoriesSuccess,
  initiateItemsFail,
  initiateItemsSuccess,
  sendViewDuration,
  updateItem,
  updateItemFail,
  updateItemSuccess,
  updateItemWithImage,
  updateItemWithImageFail,
  updateItemWithImageSuccess
} from 'src/app/items/actions/items.actions';
import { ItemsService } from 'src/app/items/services/items.service';
import { getUser, UserState } from 'src/app/user/reducers/user.reducer';
import { Category } from 'src/entities/category.model';
import { Item } from 'src/entities/item.model';
import { CategoriesService } from '../services/categories.service';
import { UserViewsService } from '../services/user-views.service';

@Injectable()
export class ItemsEffects {
  initiateItems$ = createEffect(() => this.actions$.pipe(
    ofType(initiateItems),
    switchMap(() => this.itemsService.getAll$()
      .pipe(
        map((items: Item[]) => initiateItemsSuccess({items})),
        catchError((err) => of(initiateItemsFail({message: err})))
      ))
    )
  );

  initiateCategories$ = createEffect(() => this.actions$.pipe(
    ofType(initiateCategories),
    switchMap(() => this.categoriesService.getAll$()
      .pipe(
        map((categories: Category[]) => initiateCategoriesSuccess({categories})),
        catchError((err) => of(initiateCategoriesFail({message: err})))
      ))
    )
  );

  initiateItemsAndCategories$ = createEffect(() => this.actions$.pipe(
    ofType(initiateItemsAndCategories),
    switchMap(() => this.categoriesService.getAll$().pipe(mergeMap((categories: Category[]) =>
      this.itemsService.getAll$()
        .pipe(
          map((items: Item[]) => {
            return initiateItemsAndCategoriesSuccess({categories, items});
          }),
          catchError((err) => of(initiateItemsAndCategoriesFail({message: err})))
        ))
    )))
  );

  deleteItem$ = createEffect(() => this.actions$.pipe(
    ofType(deleteItem),
    switchMap(({itemToDelete}) => this.itemsService.delete$(itemToDelete)
      .pipe(
        map(() => deleteItemSuccess({deletedItemId: itemToDelete.id})),
        catchError((err) => of(deleteItemFail({message: err})))
      ))
    )
  );

  createItem$ = createEffect(() => this.actions$.pipe(
    ofType(createItem),
    withLatestFrom(this.store$.pipe(select(getUser))),
    switchMap(([{item}, user]) => {
      item.ownerId = user.id;

      return this.itemsService.upsert$(item)
        .pipe(
          map(() => createItemSuccess({newItem: item})),
          catchError((err) => of(createItemFail({message: err})))
        );
    })
    )
  );

  updateItem$ = createEffect(() => this.actions$.pipe(
    ofType(updateItem),
    switchMap(({item}) => this.itemsService.upsert$(item)
      .pipe(
        map(() => updateItemSuccess({updatedItem: item})),
        catchError((err) => of(updateItemFail({message: err})))
      ))
    )
  );

  createItemWithImage$ = createEffect(() => this.actions$.pipe(
    ofType(createItemWithImage),
    withLatestFrom(this.store$.pipe(select(getUser))),
    switchMap(([{item, itemImage}, user]) =>
      this.itemsService.upsertWithImage$(Object.assign({ownerId: user.id}, item), itemImage)
        .pipe(
          map(() => createItemWithImageSuccess({newItem: item})),
          catchError((err) => of(updateItemWithImageFail({message: err})))
        )
    ))
  );

  updateItemWithImage$ = createEffect(() => this.actions$.pipe(
    ofType(updateItemWithImage),
    switchMap(({item, itemImage}) => this.itemsService.upsertWithImage$(item, itemImage)
      .pipe(
        map(() => updateItemWithImageSuccess({updatedItem: item})),
        catchError((err) => of(updateItemWithImageFail({message: err})))
      )
    ))
  );

  publishViewDuration$ = createEffect(() => this.actions$.pipe(
    ofType(sendViewDuration),
    withLatestFrom(this.store$.pipe(select(getUser))),
    switchMap(([{duration, itemId}, {id}]) => this.userViewsService.upsert$({duration, itemId, userId: id, id: null}))
  ), {dispatch: false});

  constructor(
    private actions$: Actions,
    private store$: Store<UserState>,
    private itemsService: ItemsService,
    private userViewsService: UserViewsService,
    private categoriesService: CategoriesService
  ) {
  }
}
