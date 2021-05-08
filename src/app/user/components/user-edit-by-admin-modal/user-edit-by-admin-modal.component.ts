import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MDBModalRef} from 'angular-bootstrap-md';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../../entities/user.model';
import firebase from 'firebase';

@Component({
  selector: 'app-user-edit-by-admin-modal',
  templateUrl: './user-edit-by-admin-modal.component.html',
  styleUrls: ['./user-edit-by-admin-modal.component.scss']
})
export class UserEditByAdminModalComponent implements OnInit {
  @Output() editUserEmitter: EventEmitter<User> = new EventEmitter<User>();
  editDetailsForm: FormGroup;
  user: User;
  birthday: Date;
  isAdminCheck: boolean;
  isActiveCheck: boolean;


  constructor(public modalRef: MDBModalRef) {
  }

  ngOnInit(): void {
    this.editDetailsForm = new FormGroup({
      firstNameForm: new FormControl(null, [Validators.required]),
      lastNameForm: new FormControl(null, [Validators.required]),
    });

    this.initializeUserDetails();
  }

  initializeUserDetails(): void {
    this.editDetailsForm.patchValue({firstNameForm: this.user.firstName});
    this.editDetailsForm.patchValue({lastNameForm: this.user.lastName});
    this.birthday = this.user.birthday.toDate();
    this.isAdminCheck = this.user.isAdmin;
    this.isActiveCheck = this.user.isActive;
  }

  get firstNameForm(): AbstractControl {
    return this.editDetailsForm.get('firstNameForm');
  }

  get lastNameForm(): AbstractControl {
    return this.editDetailsForm.get('lastNameForm');
  }

  dateChanged(date): void {
    this.birthday = date.value;
  }

  activeChanged(): void {
    this.isActiveCheck = !this.isActiveCheck;
  }

  adminChanged(): void {
    this.isAdminCheck = !this.isAdminCheck;
  }

  onSubmit(): void {
    const userToEdit: User = {...this.user};
    userToEdit.firstName = this.firstNameForm.value;
    userToEdit.lastName = this.lastNameForm.value;
    userToEdit.birthday = firebase.firestore.Timestamp.fromDate(this.birthday);
    userToEdit.isAdmin = this.isAdminCheck;
    userToEdit.isActive = this.isActiveCheck;
    this.editUserEmitter.emit(userToEdit);
  }
}
