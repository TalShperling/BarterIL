import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from 'src/entities/item.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  @Input() item: Item;
  @Output() onDeleteItem = new EventEmitter<string>();
  @Output() onEditItem = new EventEmitter<string>();
  @Output() onViewItem = new EventEmitter<string>();
  
  constructor() { }

  ngOnInit(): void {
  }

  deleteItem(): void {
    this.onDeleteItem.emit(this.item.id);
  }

  viewItem(): void {
    this.onViewItem.emit(this.item.id);
  }

  editItem(): void {
    this.onEditItem.emit(this.item.id);
  }
}
