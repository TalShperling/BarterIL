import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import firebase from 'firebase';
import {AuthenticateService} from '../../../services/auth/authentication.service';
import {MDBModalRef, MDBModalService} from 'angular-bootstrap-md';
import {VerificationModalComponent} from '../verification/verification-modal/verification-modal.component';
import {Router} from '@angular/router';
import {concatMap} from 'rxjs/operators';
import {User} from '../../../../entities/user.model';
import {UsersService} from '../../../services/users/users.service';
import {WindowService} from '../../../services/auth/window.service';
import auth = firebase.auth;


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
  birthday: Date = new Date();
  windowRef: any;
  modalRef: MDBModalRef;

  constructor(private authenticateService: AuthenticateService,
              private windowService: WindowService,
              private modalService: MDBModalService,
              private router: Router,
              private userService: UsersService) {
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

  dateChanged(date): void {
    this.birthday = date.value;
  }

  signUp(): void {
    this.modalRef = this.modalService.show(VerificationModalComponent);

    this.authenticateService.signUp(this.phoneNumber).pipe(
      concatMap(() => this.modalRef.content.verificationEmitter),
      concatMap((value: string) => this.authenticateService.verify(value, this.email, this.password)),
      concatMap(() => this.userService.upsert$({
        id: this.authenticateService.getCurrentUser().uid,
        firstName: this.firstname, lastName: this.lastname, phoneNumber: this.phoneNumber,
        email: this.email, birthday: firebase.firestore.Timestamp.fromDate(this.birthday)
      }))
    ).subscribe((user: User) => {
        this.authenticateService.saveUser(user);
        this.router.navigateByUrl('home');
      },
      error => {
        console.log(error);
      });
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
