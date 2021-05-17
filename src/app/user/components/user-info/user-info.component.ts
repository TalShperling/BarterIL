import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {getUser, UserState} from '../../reducers/user.reducer';
import {User} from '../../../../entities/user.model';
import {update, updateWithoutPhone} from '../../actions/user.actions';
import firebase from 'firebase';
import {AuthenticateService} from '../../services/authentication.service';
import {WindowService} from '../../../services/auth/window.service';
import {ObservableListener} from '../../../components/observable-listener';
import {takeUntil} from 'rxjs/operators';
import auth = firebase.auth;


@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent extends ObservableListener implements OnInit {
  editDetailsForm: FormGroup;
  birthday: Date;
  user: User = null;
  windowRef: any;

  constructor(private store: Store<UserState>,
              private windowService: WindowService) {
    super();
    this.windowRef = this.windowService.windowRef;
  }

  ngOnInit(): void {
    this.editDetailsForm = new FormGroup({
      firstNameForm: new FormControl(null, [Validators.required, this.noWhitespaceValidator]),
      lastNameForm: new FormControl(null, [Validators.required, this.noWhitespaceValidator]),
      emailForm: new FormControl(null, [Validators.required, Validators.email]),
      phoneNumberForm: new FormControl(null, [Validators.required, Validators.minLength(10)])
    });

    this.initializeUserDetails();
    this.initializeRecaptcha();
  }


  initializeUserDetails(): void {
    this.store.select(getUser).pipe(takeUntil(this.unsubscribeOnDestroy))
      .subscribe(user => {
        if (!!user) {
          this.user = {...user};
          this.editDetailsForm.patchValue({firstNameForm: user.firstName});
          this.editDetailsForm.patchValue({lastNameForm: user.lastName});
          this.editDetailsForm.patchValue({emailForm: user.email});
          this.editDetailsForm.patchValue({phoneNumberForm: user.phoneNumber});
          this.birthday = user.birthday.toDate();
        }
      });
  }

  saveDetails(): void {
    this.user.firstName = this.firstNameForm.value;
    this.user.lastName = this.lastNameForm.value;
    this.user.email = this.emailForm.value;
    this.user.birthday = firebase.firestore.Timestamp.fromDate(this.birthday);

    if (this.user.phoneNumber === this.phoneNumberForm.value) {
      this.store.dispatch(updateWithoutPhone({user: {...this.user}}));
    } else {
      this.user.phoneNumber = this.phoneNumberForm.value;
      this.store.dispatch(update({user: {...this.user}}));
    }
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

  private initializeRecaptcha(): void {
    this.windowRef.recaptchaVerifier = new auth.RecaptchaVerifier('info-recaptcha-container',
      {
        size: 'invisible'
      });
    this.windowRef.recaptchaVerifier.render();
  }
}
