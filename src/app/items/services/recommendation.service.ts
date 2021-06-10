import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { CollectionType } from '../../services/firebase/models/collection-type.model';
import { Recommendation } from '../../../entities/recommendation.model';

@Injectable()
export class RecommendationService {
  collectionName = CollectionType.RECOMMENDATIONS;

  constructor(private firebaseService: FirebaseService) {
  }

  getAll$(): Observable<Recommendation[]> {
    return this.firebaseService.getAllData$<Recommendation>(this.collectionName);
  }

  getById$(id: string): Observable<Recommendation> {
    return this.firebaseService.getDataById$<Recommendation>(this.collectionName, id);
  }
}
