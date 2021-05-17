import { Component, OnInit } from '@angular/core';
import { MDBModalRef } from 'angular-bootstrap-md';
import { Item, ItemAndCategories } from '../../../../entities/item.model';

@Component({
  selector: 'app-item-details-modal',
  templateUrl: './item-details-modal.component.html',
  styleUrls: ['./item-details-modal.component.scss']
})
export class ItemDetailsModalComponent implements OnInit{
  itemAndCategories: ItemAndCategories;
  imageSrc: string;

  constructor(public modalRef: MDBModalRef) {
  }

  ngOnInit(): void {
    if(this.itemAndCategories.pictureUrls.length === 0) {
      this.imageSrc = 'assets/images/no-image-to-show.png';
    } else {
      this.imageSrc = this.itemAndCategories.pictureUrls[0];
    }
  }

  openOffer(): void {
  }

}
