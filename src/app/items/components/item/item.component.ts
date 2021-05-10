import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from 'src/entities/item.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {
  @Input() item: Item;
  @Output() onDeleteItem: EventEmitter<Item>;
  @Output() onEditItem: EventEmitter<Item>;
  @Output() onViewItem: EventEmitter<Item>;

  constructor() {
    this.onDeleteItem = new EventEmitter<Item>();
    this.onEditItem = new EventEmitter<Item>();
    this.onViewItem = new EventEmitter<Item>();
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
}
