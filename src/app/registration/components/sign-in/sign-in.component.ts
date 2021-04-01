import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticateService} from '../../../services/auth/authentication.service';
import {Router} from '@angular/router';
import {User} from '../../../../entities/user.model';
import firebase from 'firebase';
import UserCredential = firebase.auth.UserCredential;
import {mergeMap} from 'rxjs/operators';
import {UsersService} from '../../../services/users/users.service';
import {AlertsService} from '../../../services/alerts/alerts.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  private invalidInputMessage: string = 'The email or password is incorrect';
  loginForm: FormGroup;
  email: string;
  password: string;

  constructor(private authenticateService: AuthenticateService,
              private userService: UsersService,
              private router: Router,
              private alertsService: AlertsService) {
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      passwordForm: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      emailForm: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  signIn(): void {
    this.authenticateService.signIn(this.email, this.password).pipe
    (mergeMap((userCredential: UserCredential) => this.userService.getById$(userCredential.user.uid)))
      .subscribe((user: User) => {
        this.authenticateService.saveUser(user);
        this.router.navigateByUrl('home');
      }, () => {
        this.alertsService.showErrorAlert(this.invalidInputMessage);
      });
  }

  get emailForm() {
    return this.loginForm.get('emailForm');
  }

  get passwordForm() {
    return this.loginForm.get('passwordForm');
  }
}
