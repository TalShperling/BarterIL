import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MDBModalRef } from 'angular-bootstrap-md';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from 'src/entities/category.model';
import { Item } from 'src/entities/item.model';

@Component({
  selector: 'app-edit-item-modal',
  templateUrl: './edit-item-modal.component.html',
  styleUrls: ['./edit-item-modal.component.scss']
})
export class EditItemModalComponent implements OnInit {
  private isAddingMode = false;
  private onItemSave: (itemToEdit: Item) => {};
  private onItemSaveWithImageChange: (itemToEdit: Item, itemImage: File) => {};
  private itemImage: File;
  editItemForm: FormGroup;
  itemToEdit: Item;
  categories$: Observable<Category[]>;
  selectedCategories$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  title: string;
  wasImageChanged = false;
  isDefaultImage = true;
  imageURL: string;

  constructor(public modalRef: MDBModalRef) {
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

  ngOnInit(): void {
    this.categories$.subscribe(categories => {
      if (!this.isAddingMode) {
        this.selectedCategories$.next(this.filterSelectedValues(categories));
      }
    })

    this.editItemForm = new FormGroup({
      nameForm: new FormControl(null, [Validators.required]),
      categoryIdForm: new FormControl(null, [Validators.required]),
      descriptionForm: new FormControl(null, [Validators.required])
    });

    this.title = (this.isAddingMode ? 'Add' : 'Edit') + ' Item';

    if (this.isAddingMode) {
      this.itemToEdit = {
        id: null,
        categoryIds: [],
        ownerId: null,
        description: '',
        name: '',
        pictureUrls: []
      };
      this.imageURL = '/assets/upload-button.png';
      this.isDefaultImage = true;
    } else {
      this.isDefaultImage = false;
      this.imageURL = this.itemToEdit.pictureUrls[0];
    }
  }

  onSubmit(): void {
    this.itemToEdit.categoryIds = this.selectedCategories$.getValue();

    if (this.wasImageChanged) {
      this.onItemSaveWithImageChange(this.itemToEdit, this.itemImage);
    } else {
      this.onItemSave(this.itemToEdit);
    }
    this.modalRef.hide();
  }

  uploadFile($event: Event) {
    this.itemImage = ($event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      this.imageURL = reader.result.toString();
      this.wasImageChanged = true;
    };

    reader.readAsDataURL(this.itemImage);
  }

  filterSelectedValues(categories: Category[]): string[] {
    return categories.filter(category => this.itemToEdit.categoryIds.includes(category.id)).map(cat => cat.id);
  }

  addSelection(categories: MatSelectChange) {
    this.selectedCategories$.next(categories.value);
  }
}

