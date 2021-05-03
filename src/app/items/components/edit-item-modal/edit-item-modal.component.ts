import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {MDBModalRef} from 'angular-bootstrap-md';
import {Item} from 'src/entities/item.model';
import {FirebaseService} from '../../../services/firebase/firebase.service';
import {finalize, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import * as uuid from 'uuid';
import {AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';

@Component({
  selector: 'app-edit-item-modal',
  templateUrl: './edit-item-modal.component.html',
  styleUrls: ['./edit-item-modal.component.scss']
})
export class EditItemModalComponent implements OnInit {
  private imageUUID: string;
  private isAddingMode = false;
  private onItemSave: (itemToEdit: Item) => {};
  editItemForm: FormGroup;
  itemToEdit: Item;
  title: string;
  uploadPercent = 0;
  isUploadingImage = false;
  isImageUploaded = false;
  imageURL: string;

  constructor(public modalRef: MDBModalRef,
              private firebase: FirebaseService) {
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
    this.editItemForm = new FormGroup({
      nameForm: new FormControl(null, [Validators.required]),
      categoryIdForm: new FormControl(null, [Validators.required]),
      descriptionForm: new FormControl(null, [Validators.required])
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
      this.isImageUploaded = false;
      this.imageURL = 'https://cdn3.iconfinder.com/data/icons/email-51/48/32-512.png';
    } else {
      this.isImageUploaded = true;
      this.imageURL = this.itemToEdit.pictureUrls[0];
    }

    this.initImageUpload();
  }

  private initImageUpload(): void {
    this.uploadPercent = 0;
    this.isUploadingImage = false;
    this.imageUUID = this.imageUUID ? this.imageUUID : uuid.v4();
  }

  onSubmit(): void {
    this.onItemSave(this.itemToEdit);
    this.modalRef.hide();
  }

  uploadFile($event: Event) {
    const file = ($event.target as HTMLInputElement).files[0];
    if (file) {
      this.initImageUpload();
      this.firebase.uploadFile(file, this.imageUUID).subscribe(([task, fileRef]) => {
        this.observeImageUploadPercentages(task);
        this.getImageURLOnUploadFinish(task, fileRef);
      });
    }
  }

  private observeImageUploadPercentages(task: AngularFireUploadTask) {
    task.percentageChanges().pipe(tap(percentage => {
      this.uploadPercent = Math.floor(percentage);
      this.isUploadingImage = this.uploadPercent !== 100;
      return of(this.uploadPercent);
    })).subscribe();
  }

  private getImageURLOnUploadFinish(task: AngularFireUploadTask, fileRef: AngularFireStorageReference) {
    task.snapshotChanges().pipe(
      finalize(() => fileRef.getDownloadURL().subscribe(url => {
        this.imageURL = url;
        this.itemToEdit.pictureUrls = [url];
        this.isImageUploaded = true;
      }))
    ).subscribe();
  }
}

