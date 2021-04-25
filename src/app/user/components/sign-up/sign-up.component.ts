import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import firebase from 'firebase';
import {AuthenticateService} from '../../services/authentication.service';
import {WindowService} from '../../../services/auth/window.service';
import {Store} from '@ngrx/store';
import {UserState} from '../../reducers/user.reducer';
import {register, registerFail} from '../../actions/user.actions';
import {takeUntil} from 'rxjs/operators';
import {Actions, ofType} from '@ngrx/effects';
import {AlertsService} from '../../../services/alerts/alerts.service';
import {ObservableListener} from '../../../components/observable-listener';
import auth = firebase.auth;


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent extends ObservableListener implements OnInit {
  private invalidDetailsMessage: string = 'Some of the details you entered are incorrect. Try again';
  registerForm: FormGroup;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phoneNumber: string;
  birthday: Date = new Date();
  windowRef: any;

  constructor(private authenticateService: AuthenticateService,
              private windowService: WindowService,
              private store: Store<UserState>,
              private actions$: Actions,
              private alertsService: AlertsService) {
    super();
    this.windowRef = windowService.windowRef;
  }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      firstNameForm: new FormControl(null, [Validators.required, this.noWhitespaceValidator]),
      lastNameForm: new FormControl(null, [Validators.required, this.noWhitespaceValidator]),
      passwordForm: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      repeatPasswordForm: new FormControl(null, [Validators.required,
        Validators.minLength(8), this.passwordRepeatValidation()]),
      emailForm: new FormControl(null, [Validators.required, Validators.email]),
      phoneNumberForm: new FormControl(null, [Validators.required, Validators.minLength(10)])
    });

    this.actions$.pipe(takeUntil(this.unsubscribeOnDestroy), ofType(registerFail))
      .subscribe(() => this.alertsService.showErrorAlert(this.invalidDetailsMessage));

    this.initializeRecaptcha();
  }

  private initializeRecaptcha(): void {
    this.windowRef.recaptchaVerifier = new auth.RecaptchaVerifier('recaptcha-container',
      {
        size: 'invisible'
      });
    this.windowRef.recaptchaVerifier.render();
  }

  private noWhitespaceValidator(control: FormControl): { whitespace: boolean } {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : {whitespace: true};
  }

  passwordRepeatValidation(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return control.value && control.value === this.password
      && this.password
        ? null : {forbiddenName: {value: control.value}};
    };
  }

  dateChanged(date): void {
    this.birthday = date.value;
  }

  signUp(): void {
    this.store.dispatch(register({
      user: {
        firstName: this.firstname,
        lastName: this.lastname,
        email: this.email,
        phoneNumber: this.phoneNumber,
        password: this.password,
        birthday: firebase.firestore.Timestamp.fromDate(this.birthday)
      }
    }));
  }

  get firstNameForm(): AbstractControl {
    return this.registerForm.get('firstNameForm');
  }

  get lastNameForm(): AbstractControl {
    return this.registerForm.get('lastNameForm');
  }

  get emailForm(): AbstractControl {
    return this.registerForm.get('emailForm');
  }

  get passwordForm(): AbstractControl {
    return this.registerForm.get('passwordForm');
  }

  get repeatPasswordForm(): AbstractControl {
    return this.registerForm.get('repeatPasswordForm');
  }

  get phoneNumberForm(): AbstractControl {
    return this.registerForm.get('phoneNumberForm');
  }
}
