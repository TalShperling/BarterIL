import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticateService} from '../../services/authentication.service';
import {Router} from "@angular/router";

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
    this.authenticateService.signIn(this.email, this.password).subscribe(res => {
        this.authenticateService.saveUser();
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
