import {Component, OnInit} from '@angular/core';
import {Actions, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {MDBModalRef, MDBModalService} from 'angular-bootstrap-md';
import {Observable} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ObservableListener} from 'src/app/components/observable-listener';
import {AlertsService} from 'src/app/services/alerts/alerts.service';
import {Item} from 'src/entities/item.model';
import {EditItemModalComponent} from '../edit-item-modal/edit-item-modal.component';
import {getItems, ItemsState} from '../../reducers/items.reducer';
import {ItemsModalService} from '../../services/items-modal.service';
import {
  createItemFail,
  createItemSuccess,
  deleteItemFail,
  deleteItemSuccess,
  initiateItems,
  initiateItemsFail,
  updateItem,
  updateItemFail,
  updateItemSuccess,
  updateItemWithImage
} from '../../actions/items.actions';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent extends ObservableListener implements OnInit {
  modalRef: MDBModalRef;
  items$: Observable<Item[]>;
  private deleteFailedMessage: string = 'The item couldn\'t be deleted, please try again later';
  private deleteSuccessMessage: string = 'The item has been deleted successfully';
  private updateFailedMessage: string = 'The item couldn\'t be updated, please try again later';
  private updateSuccessMessage: string = 'The item has been updated successfully';
  private createFailedMessage: string = 'The item couldn\'t be created, please try again later';
  private createSuccessMessage: string = 'The item has been created successfully';
  private initAllFailMessage: string = 'An error occurred while trying to fetching the items from the server';

  constructor(
    private modalService: MDBModalService,
    private alertsService: AlertsService,
    private actions$: Actions,
    private store$: Store<ItemsState>,
    private itemsModalService: ItemsModalService) {
    super();
    this.store$.dispatch(initiateItems());
  }

  ngOnInit(): void {
    this.items$ = this.store$.select(getItems).pipe(takeUntil(this.unsubscribeOnDestroy));

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
    this.modalService.show(EditItemModalComponent, {
      data: {
        itemToEdit: Object.assign({}, item),
        onItemSave: (editedItem: Item) => {
          this.store$.dispatch(updateItem({item: editedItem}));
        },
        onItemSaveWithImageChange: (updatedItem: Item, itemImage: File) =>
          this.store$.dispatch(updateItemWithImage({item: updatedItem, itemImage}))
      },
      class: 'modal-lg'
    });
  }
}
