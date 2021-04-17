import { Component, OnInit } from '@angular/core';
import { Item } from 'src/entities/item.model';
import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  public items: Item[] = [];
  constructor(private itemsService: ItemsService) { }

  ngOnInit(): void {
    this.itemsService.getAll$().subscribe((itemList: Item[]) => {
      this.items = itemList
    });
  }

  deleteItem(itemId: string) {
    this.itemsService.delete$(this.items.find(item => item.id === itemId)).subscribe(() => {
      alert("item deleted successfully!");
    });
  }

  viewItem(itemId: string) {
    alert("Viewing item");
  }

  editItem(itemId: string) {
    alert(`opening edit dialog for item no.${itemId}`)
  }
}
