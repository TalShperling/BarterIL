import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../../../entities/user.model';
import {MDBModalRef, MDBModalService} from 'angular-bootstrap-md';
import {Store} from '@ngrx/store';
import {ItemsState} from '../../../../items/reducers/items.reducer';
import {updateSuperficialData} from '../../../actions/user.actions';
import {UserEditByAdminModalComponent} from '../../user-edit-by-admin-modal/user-edit-by-admin-modal.component';
import {ObservableListener} from '../../../../components/observable-listener';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent extends ObservableListener implements OnInit {
  @Input() user: User;
  modalRef: MDBModalRef;

  constructor(private store$: Store<ItemsState>,
              private modalService: MDBModalService) {
    super();
  }

  ngOnInit(): void {
  }

  editUser(user: User): void {
    this.modalRef = this.modalService.show(UserEditByAdminModalComponent, {data: {user}});
    this.modalRef.content.editUserEmitter.pipe(takeUntil(this.unsubscribeOnDestroy))
      .subscribe((editedUser: User) => {
        this.store$.dispatch(updateSuperficialData({user: editedUser}));
        this.modalRef.hide();
      });
  }
}
