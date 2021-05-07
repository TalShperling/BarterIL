import {Component, OnInit} from '@angular/core';
import {User} from '../../../../entities/user.model';
import {Store} from '@ngrx/store';
import {getUsers, UserState} from '../../reducers/user.reducer';
import {initiateUsers} from '../../actions/user.actions';
import {Observable} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ObservableListener} from '../../../components/observable-listener';

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.scss']
})
export class UsersManagementComponent extends ObservableListener implements OnInit {
  users$: Observable<User[]>;
  searchText = '';

  constructor(private store$: Store<UserState>) {
    super();
  }

  ngOnInit(): void {
    this.store$.dispatch(initiateUsers());
    this.users$ = this.store$.select(getUsers).pipe(takeUntil(this.unsubscribeOnDestroy));
  }
}
