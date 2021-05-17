import { Injectable } from '@angular/core';
import { MDBModalRef, MDBModalService, ModalOptions } from 'angular-bootstrap-md';
import { Store } from '@ngrx/store';
import { getCategories, ItemsState } from '../reducers/items.reducer';
import { getItemFromItemAndCategories, Item, ItemAndCategories } from '../../../entities/item.model';
import { ModalActions } from '../../../entities/modal.model';
import { ModalComponent } from '../../components/modal/modal.component';
import { createItem, createItemWithImage, deleteItem, updateItem, updateItemWithImage } from '../actions/items.actions';
import { EditItemModalComponent } from '../components/edit-item-modal/edit-item-modal.component';
import { ItemDetailsModalComponent } from '../components/item-details-modal/item-details-modal.component';
import { Observable } from 'rxjs';
import { Category } from 'src/entities/category.model';

@Injectable()
export class ItemsModalService {
  modalRef: MDBModalRef;
  allCategories$: Observable<Category[]>;

  constructor(private store$: Store<ItemsState>,
    private modalService: MDBModalService) {
    this.allCategories$ = this.store$.select(getCategories);
  }

  deleteItem(itemAndCategoriesToDelete: ItemAndCategories): void {
    const modalOptions = {
      data: {
        options: {
          heading: `Delete '${itemAndCategoriesToDelete.name}'`,
          description: 'Are you sure you want to delete this item?',
          actions: [
            {
              actionName: ModalActions.DELETE,
              callback: () => {
                let itemToDelete = getItemFromItemAndCategories(itemAndCategoriesToDelete);
                this.store$.dispatch(deleteItem({ itemToDelete }));
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

  viewItem(itemAndCategories: ItemAndCategories): void {
    this.modalRef = this.modalService.show(ItemDetailsModalComponent, {
      data: {
        itemAndCategories
      },
      class: 'modal-lg'
    });
  }

  editItem(item: ItemAndCategories): void {
    this.modalService.show(EditItemModalComponent, {
      data: {
        itemToEdit: Object.assign({}, getItemFromItemAndCategories(item)),
        categories$: this.allCategories$,
        onItemSave: (editedItem: Item) => {
          this.store$.dispatch(updateItem({ item: editedItem }));
        },
        onItemSaveWithImageChange: (updatedItem: Item, itemImage: File) =>
          this.store$.dispatch(updateItemWithImage({ item: updatedItem, itemImage }))
      },
      class: 'modal-lg'
    });
  }

  addItem(): void {
    this.modalService.show(EditItemModalComponent, {
      data: {
        isAddingMode: true,
        categories$: this.allCategories$,
        onItemSave: (addedItem: Item) => {
          this.store$.dispatch(createItem({ item: addedItem }));
        },
        onItemSaveWithImageChange: (item: Item, itemImage: File) =>
          this.store$.dispatch(createItemWithImage({ item, itemImage }))
      },
      class: 'modal-lg'
    });
  }
}
