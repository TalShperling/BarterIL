import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {UserState} from '../../reducers/user.reducer';
import {login, loginFail} from '../../actions/user.actions';
import {AlertsService} from '../../../services/alerts/alerts.service';
import {Actions, ofType} from '@ngrx/effects';
import {takeUntil} from 'rxjs/operators';
import {ObservableListener} from '../../../components/observable-listener';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent extends ObservableListener implements OnInit {
  private invalidInputMessage: string = 'The email or password is incorrect';
  loginForm: FormGroup;
  email: string;
  password: string;

  constructor(private store: Store<UserState>,
              private alertsService: AlertsService,
              private actions$: Actions) {
    super();
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      passwordForm: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      emailForm: new FormControl(null, [Validators.required, Validators.email]),
    });

    this.actions$.pipe(takeUntil(this.unsubscribeOnDestroy), ofType(loginFail))
      .subscribe(() => this.alertsService.showErrorAlert(this.invalidInputMessage));
  }

  signIn(): void {
    this.store.dispatch(login({email: this.email, password: this.password}));
  }

  get emailForm(): AbstractControl {
    return this.loginForm.get('emailForm');
  }

  get passwordForm(): AbstractControl {
    return this.loginForm.get('passwordForm');
  }
}
