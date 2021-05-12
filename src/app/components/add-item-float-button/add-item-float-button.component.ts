import {Component} from '@angular/core';
import {ItemsService} from '../../items/services/items.service';
import {MDBModalService} from 'angular-bootstrap-md';
import {EditItemModalComponent} from '../../items/components/edit-item-modal/edit-item-modal.component';
import {Item} from '../../../entities/item.model';
import {createItem, updateItemWithImage} from '../../items/actions/items.actions';
import {Store} from '@ngrx/store';
import {ItemsState} from '../../items/reducers/items.reducer';

@Component({
  selector: 'app-add-item-float-button',
  templateUrl: './add-item-float-button.component.html',
  styleUrls: ['./add-item-float-button.component.scss']
})
export class AddItemFloatButtonComponent {
  constructor(private itemsService: ItemsService,
              private modalService: MDBModalService,
              private store$: Store<ItemsState>) {
  }

  openAddItemModal(): void {
    this.modalService.show(EditItemModalComponent, {
      data: {
        isAddingMode: true,
        onItemSave: (addedItem: Item) => {
          this.store$.dispatch(createItem({item: addedItem}));
        },
        onItemSaveWithImageChange: (item: Item, itemImage: File) =>
          this.store$.dispatch(updateItemWithImage({item, itemImage}))
      },
      class: 'modal-lg'
    });
  }
}
