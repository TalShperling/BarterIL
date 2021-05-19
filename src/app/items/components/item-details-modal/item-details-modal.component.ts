import {Component, OnInit} from '@angular/core';
import {MDBModalRef} from 'angular-bootstrap-md';
import {Item} from '../../../../entities/item.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-item-details-modal',
  templateUrl: './item-details-modal.component.html',
  styleUrls: ['./item-details-modal.component.scss']
})
export class ItemDetailsModalComponent implements OnInit {
  item: Item;
  imageSrc: string;

  constructor(public modalRef: MDBModalRef,
              private router: Router) {
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
