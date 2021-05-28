import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { CollectionType } from '../../services/firebase/models/collection-type.model';
import { UserView } from '../../../entities/user-view.model';

@Injectable()
export class UserViewsService {
  collectionName = CollectionType.USERS_VIEWS;

  constructor(private firebaseService: FirebaseService) {
  }

  upsert$(data: UserView): Observable<UserView> {
    return this.firebaseService.upsertDocument<UserView>(this.collectionName, data);
  }
}
