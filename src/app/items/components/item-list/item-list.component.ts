import { Component, OnInit } from '@angular/core';
import { MDBModalRef, MDBModalService, ModalOptions } from 'angular-bootstrap-md';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { Item } from 'src/entities/item.model';
import { MODAL_ACTIONS } from 'src/entities/modal.model';
import { ItemsService } from '../../services/items.service';
import { EditItemModalComponent } from '../edit-item-modal/edit-item-modal.component';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  modalRef: MDBModalRef;
  public items: Item[] = [];
  constructor(private itemsService: ItemsService, private modalService: MDBModalService, private alertsService: AlertsService) { }

  ngOnInit(): void {
    this.itemsService.getAll$().subscribe((itemList: Item[]) => {
      this.items = itemList
    });
  }

  deleteItem(itemId: string): void {
    const modalOptions = {
      data: {
        options: {
          heading: `Delete "${this.findItemById(itemId).name}"`,
          description: "Are you sure you want to delete this item?",
          actions: [
            {
              actionName: MODAL_ACTIONS.DELETE,
              callback: () => {
                this.itemsService.delete$(this.findItemById(itemId)).subscribe(() => {
                  alert("item deleted successfully!");
                });
              },
              color: "danger-color"
            },
            {
              actionName: MODAL_ACTIONS.CLOSE,
              callback: () => {
                this.modalRef.hide();
              },
              color: "info-color"
            }
          ]
        } as ModalOptions
      }
    }

    this.modalRef = this.modalService.show(ModalComponent, modalOptions);
  }

  viewItem(itemId: string): void {
    this.alertsService.showSuccessAlert(`Showing item ${itemId}`);
  }

  editItem(itemId: string): void {
    this.modalService.show(EditItemModalComponent, {
      data: {
        itemToEdit: Object.assign({}, this.findItemById(itemId)),
        onItemSave: (editedItem: Item)=> {this.itemsService.upsert$(editedItem).subscribe((savedItem:Item) =>{
          this.alertsService.showSuccessAlert("Item was edited successfully");
        })}
      }
    });
  }

  findItemById(itemId: string): Item {
    return this.items.find(item => item.id === itemId);
  }
}
