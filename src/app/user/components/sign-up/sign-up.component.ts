import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import firebase from 'firebase';
import { AuthenticateService } from '../../services/authentication.service';
import { WindowService } from '../../../services/auth/window.service';
import auth = firebase.auth;
import { Store } from '@ngrx/store';
import { UserState } from '../../reducers/user.reducer';
import { register } from '../../actions/user.actions';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  registerForm: FormGroup;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phoneNumber: string;
  windowRef: any;

  constructor(private authenticateService: AuthenticateService,
              private windowService: WindowService,
              private store: Store<UserState>) {
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

    this.initializeRecaptcha();
  }

  private initializeRecaptcha() {
    this.windowRef.recaptchaVerifier = new auth.RecaptchaVerifier('recaptcha-container',
      {
        size: 'invisible'
      });
    this.windowRef.recaptchaVerifier.render();
  }

  private noWhitespaceValidator(control: FormControl) {
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

  signUp(): void {
    this.store.dispatch(register({
      user: {
        firstName: this.firstname,
        lastName: this.lastname,
        email: this.email,
        phoneNumber: this.phoneNumber,
        password: this.password
      }
    }));
  }

  get firstNameForm() {
    return this.registerForm.get('firstNameForm');
  }

  get lastNameForm() {
    return this.registerForm.get('lastNameForm');
  }

  get emailForm() {
    return this.registerForm.get('emailForm');
  }

  get passwordForm() {
    return this.registerForm.get('passwordForm');
  }

  get repeatPasswordForm() {
    return this.registerForm.get('repeatPasswordForm');
  }

  get phoneNumberForm() {
    return this.registerForm.get('phoneNumberForm');
  }
}
