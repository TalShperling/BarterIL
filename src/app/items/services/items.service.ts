import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Item} from 'src/entities/item.model';
import {FirebaseService} from '../../services/firebase/firebase.service';
import {CollectionType} from '../../services/firebase/models/collection-type.model';
import {IFirebaseService} from '../../services/firebase/models/firebase-service.interface';
import {finalize, switchMap} from 'rxjs/operators';

@Injectable()
export class ItemsService implements IFirebaseService<Item> {
  collectionName = CollectionType.ITEMS;

  constructor(private firebaseService: FirebaseService) {
  }

  getAll$(): Observable<Item[]> {
    return this.firebaseService.getAllData$<Item>(this.collectionName);
  }

  getById$(id: string): Observable<Item> {
    return this.firebaseService.getDataById$<Item>(this.collectionName, id);
  }

  upsertWithImage$(data: Item, fileToUpload: File): Observable<Item> {
    return this.firebaseService.uploadFile(fileToUpload).pipe(
      switchMap(({uploadTask$, storageRef$}) => {
        const imageDownloadUrl$ = new Subject<Observable<any>>();
        uploadTask$.snapshotChanges().pipe(finalize(() => imageDownloadUrl$.next(storageRef$.getDownloadURL()))).subscribe();
        return imageDownloadUrl$;
      }),
      switchMap(imageDownloadUrl$ => imageDownloadUrl$),
      switchMap((url: any) => this.upsert$({...data, pictureUrls: [url]}))
    );
  }

  upsert$(data: Item): Observable<Item> {
    return this.firebaseService.upsertDocument<Item>(this.collectionName, data);
  }

  delete$(data: Item): Observable<void> {
    return this.firebaseService.deleteDocument<Item>(this.collectionName, data);
  }
}
