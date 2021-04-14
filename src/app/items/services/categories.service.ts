import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { CollectionType } from '../../services/firebase/models/collection-type.model';
import { IFirebaseService } from '../../services/firebase/models/firebase-service.interface';
import { Category } from '../../../entities/category.model';

@Injectable()
export class CategoriesService implements IFirebaseService<Category>{
  collectionName = CollectionType.CATEGORIES;

  constructor(private firebaseService: FirebaseService) {}

  getAll$(): Observable<Category[]> {
    return this.firebaseService.getAllData$<Category>(this.collectionName);
  }
  getById$(id: string): Observable<Category> {
    return this.firebaseService.getDataById$<Category>(this.collectionName, id);
  }
  upsert$(data: Category): Observable<Category> {
    return this.firebaseService.upsertDocument<Category>(this.collectionName, data);
  }
  delete$(data: Category): Observable<void> {
    return this.firebaseService.deleteDocument<Category>(this.collectionName, data);
  }

}
