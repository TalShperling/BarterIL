import { Component, OnDestroy, OnInit } from '@angular/core';
import { MDBModalRef } from 'angular-bootstrap-md';
import { Item } from '../../../../entities/item.model';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-item-details-modal',
  templateUrl: './item-details-modal.component.html',
  styleUrls: ['./item-details-modal.component.scss']
})
export class ItemDetailsModalComponent implements OnInit, OnDestroy {
  formOpenTime: number;
  item: Item;
  imageSrc: string;

  constructor(public modalRef: MDBModalRef, private analytics: AngularFireAnalytics) {
    this.formOpenTime = Date.now();
  }

  ngOnDestroy(): void {
    this.analytics.logEvent('item_view', {
      item: this.item,
      duration: Date.now() - this.formOpenTime
    });
  }

  ngOnInit(): void {
    if (this.item.pictureUrls.length === 0) {
      this.imageSrc = 'assets/images/no-image-to-show.png';
    } else {
      this.imageSrc = this.item.pictureUrls[0];
    }
  }

  openOffer(): void {
  }

}
