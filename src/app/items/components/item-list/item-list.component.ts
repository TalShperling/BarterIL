import {Component, OnInit} from '@angular/core';
import {MDBModalRef, MDBModalService, ModalOptions} from 'angular-bootstrap-md';
import {Observable} from 'rxjs';
import {ModalComponent} from 'src/app/components/modal/modal.component';
import {AlertsService} from 'src/app/services/alerts/alerts.service';
import {Item} from 'src/entities/item.model';
import {ModalActions} from 'src/entities/modal.model';
import {ItemsService} from '../../services/items.service';
import {EditItemModalComponent} from '../edit-item-modal/edit-item-modal.component';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  modalRef: MDBModalRef;
  items$: Observable<Item[]>;

  constructor(private itemsService: ItemsService,
              private modalService: MDBModalService,
              private alertsService: AlertsService) {
  }

  ngOnInit(): void {
    this.items$ = this.itemsService.getAll$();
  }

  deleteItem(item: Item): void {
    const modalOptions = {
      data: {
        options: {
          heading: `Delete '${item.name}'`,
          description: 'Are you sure you want to delete this item?',
          actions: [
            {
              actionName: ModalActions.DELETE,
              callback: () => {
                this.itemsService.delete$(item).subscribe(() => {
                  alert('item deleted successfully!');
                });
              },
              color: 'danger-color'
            },
            {
              actionName: ModalActions.CLOSE,
              callback: () => {
                this.modalRef.hide();
              },
              color: 'info-color'
            }
          ]
        } as ModalOptions
      }
    };

    this.modalRef = this.modalService.show(ModalComponent, modalOptions);
  }

  viewItem(itemId: string): void {
    this.alertsService.showSuccessAlert(`Showing item ${itemId}`);
  }

  editItem(item: Item): void {
    this.modalService.show(EditItemModalComponent, {
      data: {
        itemToEdit: Object.assign({}, item),
        onItemSave: (editedItem: Item) => {
          this.itemsService.upsert$(editedItem).subscribe((savedItem: Item) => {
            this.alertsService.showSuccessAlert('Item was edited successfully');
          });
        }
      }
    });
  }
}
