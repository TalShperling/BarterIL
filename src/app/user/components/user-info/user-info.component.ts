import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {getUser, UserState} from '../../reducers/user.reducer';
import {User} from '../../../../entities/user.model';
import {update} from '../../actions/user.actions';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  editDetailsForm: FormGroup;
  birthday: Date;
  user: User = null;

  constructor(private store: Store<UserState>) {
  }

  ngOnInit(): void {
    this.editDetailsForm = new FormGroup({
      firstNameForm: new FormControl(null, [Validators.required, this.noWhitespaceValidator]),
      lastNameForm: new FormControl(null, [Validators.required, this.noWhitespaceValidator]),
      emailForm: new FormControl(null, [Validators.required, Validators.email]),
      phoneNumberForm: new FormControl(null, [Validators.required, Validators.minLength(10)])
    });

    this.initializeUserDetails();
  }

  initializeUserDetails(): void {
    this.store.select(getUser).subscribe(user => {
      this.user = {...user};
      this.editDetailsForm.patchValue({firstNameForm: user.firstName});
      this.editDetailsForm.patchValue({lastNameForm: user.lastName});
      this.editDetailsForm.patchValue({emailForm: user.email});
      this.editDetailsForm.patchValue({phoneNumberForm: user.phoneNumber});
      this.birthday = user.birthday.toDate();
    });
  }

  saveDetails(): void {
    this.user.firstName = this.firstNameForm.value;
    this.user.lastName = this.lastNameForm.value;

    this.store.dispatch(update({user: this.user}));
  }

  get firstNameForm(): AbstractControl {
    return this.editDetailsForm.get('firstNameForm');
  }

  get lastNameForm(): AbstractControl {
    return this.editDetailsForm.get('lastNameForm');
  }

  get emailForm(): AbstractControl {
    return this.editDetailsForm.get('emailForm');
  }

  get phoneNumberForm(): AbstractControl {
    return this.editDetailsForm.get('phoneNumberForm');
  }

  dateChanged(date): void {
    this.birthday = date.value;
  }

  private noWhitespaceValidator(control: FormControl): { whitespace: boolean } {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : {whitespace: true};
  }
}
