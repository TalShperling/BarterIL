import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {MDBModalRef} from 'angular-bootstrap-md';
import {Item} from 'src/entities/item.model';

@Component({
  selector: 'app-edit-item-modal',
  templateUrl: './edit-item-modal.component.html',
  styleUrls: ['./edit-item-modal.component.scss']
})
export class EditItemModalComponent implements OnInit {
  editItemForm: FormGroup;
  onItemSave: (itemToEdit: Item) => {};
  itemToEdit: Item;
  isAddingMode = false;
  title: string;

  constructor(public modalRef: MDBModalRef) {
  }

  ngOnInit(): void {
    this.editItemForm = new FormGroup({
      nameForm: new FormControl(null, [Validators.required]),
      categoryIdForm: new FormControl(null, [Validators.required]),
      descriptionForm: new FormControl(null, [Validators.required]),
    });

    this.title = (this.isAddingMode ? 'Add' : 'Edit') + ' Item';

    if (this.isAddingMode) {
      this.itemToEdit = {
        id: null,
        categoryId: null,
        description: '',
        name: '',
        pictureUrls: []
      };
    }
  }

  onSubmit(): void {
    this.onItemSave(this.itemToEdit);
    this.modalRef.hide();
  }
}

