import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticateService} from '../services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  userFullName = 'Oz Zorany';

  constructor(private router: Router,
              private authenticateService: AuthenticateService) {
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.authenticateService.logout();
    this.router.navigateByUrl('/');
  }
}
