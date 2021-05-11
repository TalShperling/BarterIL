import { Component, OnInit } from '@angular/core';
import { MDBModalRef } from 'angular-bootstrap-md';
import { Item } from '../../../../entities/item.model';

@Component({
  selector: 'app-item-details-modal',
  templateUrl: './item-details-modal.component.html',
  styleUrls: ['./item-details-modal.component.scss']
})
export class ItemDetailsModalComponent implements OnInit{
  item: Item;
  imageSrc: string;

  constructor(public modalRef: MDBModalRef) {
  }

  ngOnInit(): void {
    if(this.item.pictureUrls.length === 0) {
      this.imageSrc = 'assets/images/no-image-to-show.png';
    } else {
      this.imageSrc = this.item.pictureUrls[0];
    }
  }

  openOffer(): void {
  }

}
