import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MDBModalRef } from 'angular-bootstrap-md';
import { Item } from 'src/entities/item.model';

@Component({
  selector: 'app-edit-item-modal',
  templateUrl: './edit-item-modal.component.html',
  styleUrls: ['./edit-item-modal.component.scss']
})
export class EditItemModalComponent implements OnInit {
  editItemForm: FormGroup;
  onItemSave: (itemToEdit:Item) =>{}
  itemToEdit: Item
  constructor(public modalRef: MDBModalRef) {
  }

  ngOnInit(): void {
    this.editItemForm = new FormGroup({
      idForm: new FormControl(null, [Validators.required]),
      nameForm: new FormControl(null, [Validators.required]),
      categoryIdForm: new FormControl(null, [Validators.required]),
      descriptionForm: new FormControl(null, [Validators.required]),
    });
  }
  
  onSubmit(): void {
    this.onItemSave(this.itemToEdit);
    this.modalRef.hide();
  }

  get idForm(): AbstractControl {
    return this.editItemForm.get('idForm');
  }

  get nameForm(): AbstractControl {
    return this.editItemForm.get('nameForm');
  }

  get categoryIdForm(): AbstractControl {
    return this.editItemForm.get('categoryIdForm');
  }

  get descriptionForm(): AbstractControl {
    return this.editItemForm.get('descriptionForm');
  }
}

