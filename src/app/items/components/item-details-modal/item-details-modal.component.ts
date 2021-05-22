import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {Router} from '@angular/router';
import {MDBModalRef} from 'angular-bootstrap-md';
import {Item} from '../../../../entities/item.model';

@Component({
  selector: 'app-item-details-modal',
  templateUrl: './item-details-modal.component.html',
  styleUrls: ['./item-details-modal.component.scss']
})
export class ItemDetailsModalComponent implements OnInit, OnDestroy {
  item: Item;
  formOpenTime: number;
  imageSrc: string;
  isWatchMode: boolean = false;

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
    if (this.item.pictureUrls.length === 0) {
      this.imageSrc = 'assets/images/no-image-to-show.png';
    } else {
      this.imageSrc = this.item.pictureUrls[0];
    }
  }

  openOffer(): void {
    this.modalRef.hide();
    this.router.navigate(['/barter-offer', this.item.id]);
  }
}
