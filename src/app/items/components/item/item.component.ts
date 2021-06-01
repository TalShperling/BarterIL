import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Item} from 'src/entities/item.model';
import {User} from 'src/entities/user.model';
import {getUserById, UserState} from '../../../user/reducers/user.reducer';
import {Store} from '@ngrx/store';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  @Input() item: Item;
  @Input() currentUser: User;
  @Input() isEditorMode: boolean;
  @Output() onDeleteItem: EventEmitter<Item>;
  @Output() onEditItem: EventEmitter<Item>;
  @Output() onViewItem: EventEmitter<Item>;
  imageSrc: string;
  ownerName: string;

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
}
