import { Component } from '@angular/core';
import { MDBModalRef } from 'angular-bootstrap-md';
import { Item } from '../../../../entities/item.model';

@Component({
  selector: 'app-item-details-modal',
  templateUrl: './item-details-modal.component.html',
  styleUrls: ['./item-details-modal.component.scss']
})
export class ItemDetailsModalComponent {
  item: Item;

  constructor(public modalRef: MDBModalRef) {
  }

  openOffer(): void {
  }

}
