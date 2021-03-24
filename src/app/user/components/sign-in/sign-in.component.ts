import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Store } from '@ngrx/store';
import { UserState } from '../../reducers/user.reducer';
import { login } from '../../actions/user.actions';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup;
  email: string;
  password: string;

  constructor(private store: Store<UserState>) {
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      passwordForm: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      emailForm: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  signIn() {
    this.store.dispatch(login({ email: this.email, password: this.password }));
  }

  get emailForm() {
    return this.loginForm.get('emailForm');
  }

  get passwordForm() {
    return this.loginForm.get('passwordForm');
  }
}
