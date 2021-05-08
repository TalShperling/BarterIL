import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Item} from 'src/entities/item.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  @Input() item: Item;
  @Output() onDeleteItem: EventEmitter<Item>;
  @Output() onEditItem: EventEmitter<Item>;
  @Output() onViewItem: EventEmitter<Item>;
  imageSrc: string;

  constructor() {
    this.onDeleteItem = new EventEmitter<Item>();
    this.onEditItem = new EventEmitter<Item>();
    this.onViewItem = new EventEmitter<Item>();
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
