import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Item} from 'src/entities/item.model';
import {FirebaseService} from '../../services/firebase/firebase.service';
import {CollectionType} from '../../services/firebase/models/collection-type.model';
import {IFirebaseService} from '../../services/firebase/models/firebase-service.interface';
import {finalize, switchMap} from 'rxjs/operators';
import {Transaction} from '../../../entities/transaction.model';

@Injectable()
export class TransactionsService implements IFirebaseService<Transaction> {
  collectionName = CollectionType.TRANSACTIONS;

  constructor(private firebaseService: FirebaseService) {
  }

  getAll$(): Observable<Transaction[]> {
    return this.firebaseService.getAllData$<Transaction>(this.collectionName);
  }

  getById$(id: string): Observable<Transaction> {
    return this.firebaseService.getDataById$<Transaction>(this.collectionName, id);
  }

  upsert$(data: Transaction): Observable<Transaction> {
    return this.firebaseService.upsertDocument<Transaction>(this.collectionName, data);
  }

  delete$(data: Transaction): Observable<void> {
    return this.firebaseService.deleteDocument<Transaction>(this.collectionName, data);
  }
}
