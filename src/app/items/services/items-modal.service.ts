import {Injectable} from '@angular/core';
import {MDBModalRef, MDBModalService, ModalOptions} from 'angular-bootstrap-md';
import {Store} from '@ngrx/store';
import {ItemsState} from '../reducers/items.reducer';
import {Item} from '../../../entities/item.model';
import {ModalActions} from '../../../entities/modal.model';
import {ModalComponent} from '../../components/modal/modal.component';
import {deleteItem, updateItem} from '../actions/items.actions';
import {EditItemModalComponent} from '../components/edit-item-modal/edit-item-modal.component';
import { ItemDetailsModalComponent } from '../components/item-details-modal/item-details-modal.component';

@Injectable()
export class ItemsModalService {
  modalRef: MDBModalRef;

  constructor(private store$: Store<ItemsState>,
              private modalService: MDBModalService) {
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
                this.modalRef.hide();
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

  viewItem(item: Item): void {
    this.modalRef = this.modalService.show(ItemDetailsModalComponent, {
      data: {
        item
      },
      class: 'modal-lg'
    });
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
