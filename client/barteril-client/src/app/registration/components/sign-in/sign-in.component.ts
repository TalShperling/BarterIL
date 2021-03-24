import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticateService} from '../../../services/authentication.service';
import {Router} from '@angular/router';
import {User} from '../../../../entities/user.model';
import firebase from 'firebase';
import UserCredential = firebase.auth.UserCredential;

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup;
  email: string;
  password: string;

  constructor(private authenticateService: AuthenticateService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      passwordForm: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      emailForm: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  signIn(): void {
    /*TODO: after creating server side, bring the real user from firebase*/
    this.authenticateService.signIn(this.email, this.password).subscribe((userCredential: UserCredential) => {
        this.authenticateService.saveUser(new User(userCredential.user.uid,
          'Tal', 'Shmerling', '0555555555', 'tal@shmerling.com'));
        this.router.navigateByUrl('home');
      },
      error => {
        console.log(error);
      });
  }

  get emailForm() {
    return this.loginForm.get('emailForm');
  }

  get passwordForm() {
    return this.loginForm.get('passwordForm');
  }
}
