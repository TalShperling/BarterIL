import {Component, OnInit} from '@angular/core';
import {AuthenticateService} from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'barteril-client';
  isUserLoggedIn: boolean = false;

  constructor(private authenticationService: AuthenticateService) {
  }


  ngOnInit(): void {
    this.authenticationService.getIsUserLoggedInSubject().subscribe(isUserLoggedIn => {
      this.isUserLoggedIn = isUserLoggedIn;
    });
  }
}
