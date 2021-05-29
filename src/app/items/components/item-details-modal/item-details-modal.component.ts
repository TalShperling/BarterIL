import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MDBModalRef } from 'angular-bootstrap-md';
import { Item } from '../../../../entities/item.model';
import { ItemsState } from '../../reducers/items.reducer';
import { Store } from '@ngrx/store';
import { sendViewDuration } from '../../actions/items.actions';

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
              private router: Router,
              private store: Store<ItemsState>) {
    this.formOpenTime = Date.now();
  }

  ngOnDestroy(): void {
    this.store.dispatch(sendViewDuration({
        duration: (Date.now() - this.formOpenTime) / 1000,
        itemId: this.item.id
      }
    ));
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
