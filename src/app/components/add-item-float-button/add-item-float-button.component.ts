import {Component} from '@angular/core';
import {ItemsService} from '../../items/services/items.service';
import {ItemsModalService} from '../../items/services/items-modal.service';

@Component({
  selector: 'app-add-item-float-button',
  templateUrl: './add-item-float-button.component.html',
  styleUrls: ['./add-item-float-button.component.scss']
})
export class AddItemFloatButtonComponent {
  constructor(private itemsService: ItemsService,
              private itemsModals: ItemsModalService) {
  }

  openAddItemModal(): void {
    this.itemsModals.addItem();
  }
}
