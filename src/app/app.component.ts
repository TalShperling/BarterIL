import {Component, OnInit} from '@angular/core';
import {AuthenticateService} from './services/auth/authentication.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'barteril-client';
  isUserLoggedIn: Observable<boolean>;

  constructor(private authenticationService: AuthenticateService) {
  }

  ngOnInit(): void {
    this.isUserLoggedIn = this.authenticationService.getIsUserLoggedIn$();
  }
}
