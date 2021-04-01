import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../entities/user.model';
import { Store, select } from '@ngrx/store';
import { getUser, UserState } from '../../user/reducers/user.reducer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { logout } from '../../user/actions/user.actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  signInUser$: Observable<User>;
  userFullName$: Observable<string>;

  constructor(private router: Router, private store: Store<UserState>) {
  }

  ngOnInit(): void {
    this.signInUser$ = this.store.pipe(select(getUser));
    this.userFullName$ = this.signInUser$.pipe(map(user => user ? `${user.firstName} ${user.lastName}` : 'no name'));
  }

  logout(): void {
    this.store.dispatch(logout());
  }
}
