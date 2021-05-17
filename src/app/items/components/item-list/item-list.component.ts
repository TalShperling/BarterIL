import {Component, OnInit} from '@angular/core';
import {Actions, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {MDBModalRef} from 'angular-bootstrap-md';
import {Observable} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ObservableListener} from 'src/app/components/observable-listener';
import {AlertsService} from 'src/app/services/alerts/alerts.service';
import {getUser} from 'src/app/user/reducers/user.reducer';
import {Item, ItemAndCategories} from 'src/entities/item.model';
import {getCategories, getItems, getItemsAndCategories, ItemsState} from '../../reducers/items.reducer';
import {ItemsModalService} from '../../services/items-modal.service';
import {
  createItemFail,
  createItemSuccess,
  deleteItemFail,
  deleteItemSuccess,
  initiateCategories,
  initiateItems,
  initiateItemsFail,
  updateItemFail,
  updateItemSuccess,
  updateItemWithImage
} from '../../actions/items.actions';
import {User} from 'src/entities/user.model';
import { Category } from 'src/entities/category.model';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent extends ObservableListener implements OnInit {
  modalRef: MDBModalRef;
  itemsAndCategories$: Observable<ItemAndCategories[]>;
  currentUser$: Observable<User>;
  private deleteFailedMessage: string = 'The item couldn\'t be deleted, please try again later';
  private deleteSuccessMessage: string = 'The item has been deleted successfully';
  private updateFailedMessage: string = 'The item couldn\'t be updated, please try again later';
  private updateSuccessMessage: string = 'The item has been updated successfully';
  private createFailedMessage: string = 'The item couldn\'t be created, please try again later';
  private createSuccessMessage: string = 'The item has been created successfully';
  private initAllFailMessage: string = 'An error occurred while trying to fetching the items from the server';

  constructor(
    private alertsService: AlertsService,
    private actions$: Actions,
    private store$: Store<ItemsState>,
    private itemsModalService: ItemsModalService) {
    super();
    this.store$.dispatch(initiateItems());
    this.store$.dispatch(initiateCategories());
  }

  ngOnInit(): void {
    this.itemsAndCategories$ = this.store$.select(getItemsAndCategories).pipe(takeUntil(this.unsubscribeOnDestroy));

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

    this.currentUser$ = this.store$.select(getUser).pipe(takeUntil(this.unsubscribeOnDestroy));
  }

  deleteItem(itemToDelete: ItemAndCategories): void {
    this.itemsModalService.deleteItem(itemToDelete);
  }

  viewItem(item: ItemAndCategories): void {
    this.itemsModalService.viewItem(item);
  }

  editItem(item: ItemAndCategories): void {
    this.itemsModalService.editItem(item);
  }
}
