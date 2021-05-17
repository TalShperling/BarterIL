import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItemAndCategories } from 'src/entities/item.model';
import { User } from 'src/entities/user.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  @Input() item: ItemAndCategories;
  @Input() currentUser: User;
  @Output() onDeleteItem: EventEmitter<ItemAndCategories>;
  @Output() onEditItem: EventEmitter<ItemAndCategories>;
  @Output() onViewItem: EventEmitter<ItemAndCategories>;
  imageSrc: string;

  constructor() {
    this.onDeleteItem = new EventEmitter<ItemAndCategories>();
    this.onEditItem = new EventEmitter<ItemAndCategories>();
    this.onViewItem = new EventEmitter<ItemAndCategories>();
  }

  ngOnInit(): void {
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
}
