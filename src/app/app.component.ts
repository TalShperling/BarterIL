import {Component, OnInit} from '@angular/core';
import {AuthenticateService} from './services/auth/authentication.service';
import {Observable} from 'rxjs';
import { Store, select } from '@ngrx/store';
import { isUserLoggedIn, UserState } from './user/reducers/user.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'barteril-client';
  isUserLoggedIn: Observable<boolean>;

  constructor(private authenticationService: AuthenticateService, private store: Store<UserState>) {
  }

  ngOnInit(): void {
    this.isUserLoggedIn = this.store.pipe(select(isUserLoggedIn));
  }
}
