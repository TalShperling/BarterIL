import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {FirebaseService} from '../../services/firebase/firebase.service';
import {CollectionType} from '../../services/firebase/models/collection-type.model';
import {IFirebaseService} from '../../services/firebase/models/firebase-service.interface';
import {Rating} from '../../../entities/rating.model';

@Injectable()
export class RatingService implements IFirebaseService<Rating> {
  collectionName = CollectionType.RATINGS;

  constructor(private firebaseService: FirebaseService) {
  }

  getAll$(): Observable<Rating[]> {
    return this.firebaseService.getAllData$<Rating>(this.collectionName);
  }

  getById$(id: string): Observable<Rating> {
    return this.firebaseService.getDataById$<Rating>(this.collectionName, id);
  }

  upsert$(data: Rating): Observable<Rating> {
    return this.firebaseService.upsertDocument<Rating>(this.collectionName, data);
  }

  delete$(data: Rating): Observable<void> {
    return this.firebaseService.deleteDocument<Rating>(this.collectionName, data);
  }
}
