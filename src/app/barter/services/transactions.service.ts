import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { CollectionType } from '../../services/firebase/models/collection-type.model';
import { IFirebaseService } from '../../services/firebase/models/firebase-service.interface';
import { Transaction } from '../../../entities/transaction.model';
import { getUser, UserState } from '../../user/reducers/user.reducer';
import { User } from '../../../entities/user.model';
import { Store } from '@ngrx/store';

@Injectable()
export class TransactionsService implements IFirebaseService<Transaction> {
  collectionName = CollectionType.TRANSACTIONS;
  newTransaction$: BehaviorSubject<Transaction[]> = new BehaviorSubject<Transaction[]>([]);

  constructor(private firebaseService: FirebaseService,
              private userStore$: Store<UserState>) {
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

  getNewTransactions$(): Observable<Transaction[]> {
    return this.newTransaction$.asObservable();
  }

  clearNewTransactions$(): void {
    this.newTransaction$.next([]);
  }

  alertNewTransaction(transactions: Transaction[]) {
    this.userStore$.select(getUser).subscribe((user: User) => {
      const myNewTransactions: Transaction[] = transactions.filter(transaction =>
        this.shouldFilterTransaction(!!transaction.transactionCompleteDate ? transaction.transactionCompleteDate.toDate() :
          transaction.offerDate.toDate()) &&
        transaction.operatedBy !== user.id &&
        (user.id === transaction.ownerId || user.id === transaction.traderId));

      this.newTransaction$.next(myNewTransactions);
    });
  }

  private shouldFilterTransaction(date: Date): boolean {
    const HALF_MINUTE = 30000;
    return (Date.now() - date.getTime()) < HALF_MINUTE;
  }
}
