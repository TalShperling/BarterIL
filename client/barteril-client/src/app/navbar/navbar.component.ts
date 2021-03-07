import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticateService} from '../services/authentication.service';
import {User} from '../../entities/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  signInUser: User;
  userFullName: string;

  constructor(private router: Router,
              private authenticateService: AuthenticateService) {
  }

  ngOnInit(): void {
    this.signInUser = this.authenticateService.getUser();
    this.userFullName = !!this.signInUser ?
      this.signInUser.firstName.concat(' ', this.signInUser.lastName) : '';
  }

  logout(): void {
    this.authenticateService.logout();
    this.router.navigateByUrl('/');
  }
}
