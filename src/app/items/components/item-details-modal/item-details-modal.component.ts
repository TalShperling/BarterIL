import { Component, OnDestroy, OnInit } from '@angular/core';
import { MDBModalRef } from 'angular-bootstrap-md';
import { Item, ItemAndCategories } from '../../../../entities/item.model';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-details-modal',
  templateUrl: './item-details-modal.component.html',
  styleUrls: ['./item-details-modal.component.scss']
})
export class ItemDetailsModalComponent implements OnInit {
  itemAndCategories: ItemAndCategories;
  formOpenTime: number;
  item: Item;
  imageSrc: string;

  constructor(public modalRef: MDBModalRef,
    private analytics: AngularFireAnalytics,
    private router: Router) {
    this.formOpenTime = Date.now();
  }

  ngOnDestroy(): void {
    this.analytics.logEvent('item_view', {
      item: this.item,
      duration: Date.now() - this.formOpenTime
    });
  }

  ngOnInit(): void {
    if (this.itemAndCategories.pictureUrls.length === 0) {
      this.imageSrc = 'assets/images/no-image-to-show.png';
    } else {
      this.imageSrc = this.itemAndCategories.pictureUrls[0];
    }
  }

  openOffer(): void {
    this.modalRef.hide();
    this.router.navigate(['/barter-offer', this.item.id]);
  }
}
