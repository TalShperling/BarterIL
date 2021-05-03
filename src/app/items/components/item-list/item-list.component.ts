import { Component, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MDBModalRef, MDBModalService, ModalOptions } from 'angular-bootstrap-md';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { ObservableListener } from 'src/app/components/observable-listener';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { Item } from 'src/entities/item.model';
import { ModalActions } from 'src/entities/modal.model';
import {
  createItemFail,
  createItemSuccess,
  deleteItem,
  deleteItemFail,
  deleteItemSuccess,
  initiateItems,
  initiateItemsFail,
  updateItem,
  updateItemFail,
  updateItemSuccess
} from '../../actions/items.actions';
import { getItems, ItemsState } from '../../reducers/items.reducer';
import { EditItemModalComponent } from '../edit-item-modal/edit-item-modal.component';

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
    private store$: Store<ItemsState>) {
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
  }

  deleteItem(itemToDelete: Item): void {
    const modalOptions = {
      data: {
        options: {
          heading: `Delete '${itemToDelete.name}'`,
          description: 'Are you sure you want to delete this item?',
          actions: [
            {
              actionName: ModalActions.DELETE,
              callback: () => {
                this.store$.dispatch(deleteItem({itemToDelete}));
              },
              color: 'danger-color'
            },
            {
              actionName: ModalActions.CLOSE,
              callback: () => {
                this.modalRef.hide();
              },
              color: 'info-color'
            }
          ]
        } as ModalOptions
      }
    };

    this.modalRef = this.modalService.show(ModalComponent, modalOptions);
  }

  viewItem(itemId: string): void {
    this.alertsService.showSuccessAlert(`Showing item ${itemId}`);
  }

  editItem(item: Item): void {
    this.modalService.show(EditItemModalComponent, {
      data: {
        itemToEdit: Object.assign({}, item),
        onItemSave: (editedItem: Item) => {
          this.store$.dispatch(updateItem({item: editedItem}));
        }
      },
      class: 'modal-lg'
    });
  }
}
