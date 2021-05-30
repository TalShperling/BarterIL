import { Pipe, PipeTransform } from '@angular/core';
import { Transaction } from 'src/entities/transaction.model';

@Pipe({
  name: 'filterTransactions'
})
export class FilterTransactionsPipe implements PipeTransform {
  transform(transactions: Transaction[], searchText: string): Transaction[] {
    if (!transactions) {
      return [];
    }
    if (!searchText) {
      return transactions;
    }
    searchText = searchText.toLocaleLowerCase();

    return transactions.filter(transaction => {
      return (transaction.id.includes(searchText) ||
        transaction.ownerItemId.includes(searchText) ||
        transaction.traderId.includes(searchText) ||
        transaction.traderItemId.includes(searchText) ||
        transaction.ownerId.includes(searchText)
      );
    });
  }
}