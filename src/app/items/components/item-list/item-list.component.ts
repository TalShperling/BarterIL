import { Component, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MDBModalRef } from 'angular-bootstrap-md';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { ObservableListener } from 'src/app/components/observable-listener';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { getUser, UserState } from 'src/app/user/reducers/user.reducer';
import { Item } from 'src/entities/item.model';
import { User } from 'src/entities/user.model';
import {
  createItemFail,
  createItemSuccess,
  deleteItemFail,
  deleteItemSuccess,
  initiateItemsAndCategories,
  initiateItemsFail,
  updateItemFail,
  updateItemSuccess,
  updateItemWithImage
} from '../../actions/items.actions';
import { getCategories, getOptionalTradeItems, ItemsState } from '../../reducers/items.reducer';
import { ItemsModalService } from '../../services/items-modal.service';
import { Category } from '../../../../entities/category.model';
import { initiateTransactions } from '../../../barter/actions/transactions.actions';
import { TransactionsState } from '../../../barter/reducers/transactions.reducer';
import { initiateUsers } from '../../../user/actions/user.actions';
import { RatingService } from '../../../barter/services/rating.service';
import { Rating } from '../../../../entities/rating.model';
import { RecommendationService } from '../../services/recommendation.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent extends ObservableListener implements OnInit {
  modalRef: MDBModalRef;
  items$: Observable<Item[]>;
  currentUser$: Observable<User>;
  searchText: string;
  selectedCategoryIds: string[];
  categories$: Observable<Category[]>;
  ratings$: Observable<Rating[]>;
  recommendedItems$: Observable<Item[]>;
  private deleteFailedMessage: string = 'The item couldn\'t be deleted, please try again later';
  private deleteSuccessMessage: string = 'The item has been deleted successfully';
  private updateFailedMessage: string = 'The item couldn\'t be updated, please try again later';
  private updateSuccessMessage: string = 'The item has been updated successfully';
  private createFailedMessage: string = 'The item couldn\'t be created, please try again later';
  private createSuccessMessage: string = 'The item has been created successfully';
  private initAllFailMessage: string = 'An error occurred while trying to fetching the items from the server';

  constructor(
    private alertsService: AlertsService,
    private ratingService: RatingService,
    private actions$: Actions,
    private store$: Store<ItemsState>,
    private userStore$: Store<UserState>,
    private transactionsStore$: Store<TransactionsState>,
    private itemsModalService: ItemsModalService,
    private recommendationService: RecommendationService
  ) {
    super();
    this.store$.dispatch(initiateItemsAndCategories());
    this.store$.dispatch(initiateUsers());

  }

  ngOnInit(): void {
    this.ratings$ = this.ratingService.getAll$();
    this.categories$ = this.store$.select(getCategories).pipe(takeUntil(this.unsubscribeOnDestroy));
    this.transactionsStore$.dispatch(initiateTransactions());
    this.currentUser$ = this.store$.select(getUser).pipe(takeUntil(this.unsubscribeOnDestroy));
    this.currentUser$.pipe(filter(user => !!user)).subscribe(user => {
      this.items$ = this.store$.select(getOptionalTradeItems(user.id)).pipe(takeUntil(this.unsubscribeOnDestroy));
      this.recommendedItems$ = combineLatest(
        this.recommendationService.getById$(user.id),
        this.items$
      ).pipe(
        map(([recommendation, items]) =>
          recommendation.items.map(({itemId}) =>
            items.find(i => i.id === itemId)).filter(item => item && item.ownerId !== user.id).slice(0, 5))
      );
    });

    this.actions$.pipe(takeUntil(this.unsubscribeOnDestroy), ofType(deleteItemFail))
      .subscribe(() => this.alertsService.showErrorAlert(this.deleteFailedMessage));

    this.actions$.pipe(takeUntil(this.unsubscribeOnDestroy), ofType(deleteItemSuccess))
      .subscribe(() => this.alertsService.showSuccessAlert(this.deleteSuccessMessage));

    this.actions$.pipe(takeUntil(this.unsubscribeOnDestroy), ofType(updateItemFail))
      .subscribe(() => this.alertsService.showErrorAlert(this.updateFailedMessage));

    this.actions$.pipe(takeUntil(this.unsubscribeOnDestroy), ofType(updateItemSuccess))
      .subscribe(() => this.alertsService.showSuccessAlert(this.updateSuccessMessage));

    this.actions$.pipe(takeUntil(this.unsubscribeOnDestroy), ofType(createItemFail))
      .subscribe(() => this.alertsService.showErrorAlert(this.createFailedMessage));

    this.actions$.pipe(takeUntil(this.unsubscribeOnDestroy), ofType(createItemSuccess))
      .subscribe(() => this.alertsService.showSuccessAlert(this.createSuccessMessage));

    this.actions$.pipe(takeUntil(this.unsubscribeOnDestroy), ofType(createItemFail))
      .subscribe(() => this.alertsService.showErrorAlert(this.createFailedMessage));

    this.actions$.pipe(takeUntil(this.unsubscribeOnDestroy), ofType(createItemSuccess))
      .subscribe(() => this.alertsService.showSuccessAlert(this.createSuccessMessage));

    this.actions$.pipe(takeUntil(this.unsubscribeOnDestroy), ofType(initiateItemsFail))
      .subscribe(() => this.alertsService.showErrorAlert(this.initAllFailMessage));

    this.actions$.pipe(takeUntil(this.unsubscribeOnDestroy), ofType(updateItemWithImage))
      .subscribe(() => this.alertsService.showSuccessAlert(this.updateSuccessMessage));

  }

  deleteItem(itemToDelete: Item): void {
    this.itemsModalService.deleteItem(itemToDelete);
  }

  viewItem(item: Item): void {
    this.itemsModalService.viewItem(item);
  }

  editItem(item: Item): void {
    this.itemsModalService.editItem(item);
  }

  filterRatingsByOwner(ownerId: string, ratings: Rating[]) {
    return ratings && ratings.length ? ratings.filter(rating => rating.ratedUser === ownerId) : [];
  }
}
