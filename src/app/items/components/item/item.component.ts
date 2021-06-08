import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Item} from 'src/entities/item.model';
import {User} from 'src/entities/user.model';
import {getUserById, UserState} from '../../../user/reducers/user.reducer';
import {Store} from '@ngrx/store';
import {first} from 'rxjs/operators';
import {Rating} from '../../../../entities/rating.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  @Input() item: Item;
  @Input() currentUser: User;
  @Input() ratings: Rating[];
  @Input() isEditorMode: boolean;
  @Output() onDeleteItem: EventEmitter<Item>;
  @Output() onEditItem: EventEmitter<Item>;
  @Output() onViewItem: EventEmitter<Item>;
  imageSrc: string;
  ownerName: string;
  ratingText: string;

  constructor(private userStore$: Store<UserState>) {
    this.onDeleteItem = new EventEmitter<Item>();
    this.onEditItem = new EventEmitter<Item>();
    this.onViewItem = new EventEmitter<Item>();
  }

  ngOnInit(): void {
    this.userStore$.select(getUserById(this.item.ownerId)).pipe(first()).subscribe(owner => {
      this.ownerName = owner.firstName + ' ' + owner.lastName;
    });
    this.imageSrc = this.item.pictureUrls[0];
    this.calculateAverageRating();
  }

  deleteItem(): void {
    this.onDeleteItem.emit(this.item);
  }

  viewItem(): void {
    this.onViewItem.emit(this.item);
  }

  editItem(): void {
    this.onEditItem.emit(this.item);
  }

  onImageError(): void {
    this.imageSrc = 'assets/images/no-image-to-show.png';
  }

  changeImageSrc(imageSrc: string): void {
    this.imageSrc = imageSrc;
  }

  private calculateAverageRating(): void {
    if (this.ratings && this.ratings.length) {
      const averageRating = this.ratings && this.ratings.length > 0
        ? this.ratings.reduce((a, b) => a + b.rating, 0) / this.ratings.length : 0;
      this.ratingText = '⭐' + parseFloat(averageRating.toFixed(1));
    } else {
      this.ratingText = '⭐ (No Rating)';
    }
  }
}
