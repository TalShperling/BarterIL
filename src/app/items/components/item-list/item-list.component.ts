import { Component, OnInit } from '@angular/core';
import { Item } from 'src/entities/item.model';
import { ItemsService } from '../../services/items.service';
import {MDBModalRef, MDBModalService} from 'angular-bootstrap-md';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { MODAL_ACTIONS } from 'src/app/components/modal/modal.actions';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  public items: Item[] = [];
  modalRef: MDBModalRef;
  constructor(private itemsService: ItemsService, private modalService: MDBModalService) { }

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

  subscribeModalActions() {
    this.modalRef.content.action.subscribe( (result: MODAL_ACTIONS) => {
      switch(result) {
        case(MODAL_ACTIONS.CLOSE): 
          this.modalRef.hide();
      }
    });
  }

  viewItem(itemId: string) {
    this.modalRef = this.modalService.show(ModalComponent, {
      animated: true,
      data: {
        heading: "View Item",
        content: {description: "The data", actions: [MODAL_ACTIONS.CLOSE]}
      }
    });

    this.subscribeModalActions();
  }

  editItem(itemId: string) {
    alert(`opening edit dialog for item no.${itemId}`)
  }
}
