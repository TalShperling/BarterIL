import {Component} from '@angular/core';
import {ItemsService} from '../../services/items/items.service';
import {MDBModalService} from 'angular-bootstrap-md';
import {EditItemModalComponent} from '../items/edit-item-modal/edit-item-modal.component';

@Component({
  selector: 'app-add-item-float-button',
  templateUrl: './add-item-float-button.component.html',
  styleUrls: ['./add-item-float-button.component.scss']
})
export class AddItemFloatButtonComponent {
  constructor(private itemsService: ItemsService,
              private modalService: MDBModalService) {
  }

  openAddItemModal(): void {
    this.modalService.show(EditItemModalComponent, {
      data: {
        isAddingMode: true,
        onItemSave: () => {
          console.log('Hey zot-ani');
        }
      }
    });
  }
}
