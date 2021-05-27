import {createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
import {Transaction} from '../../../entities/transaction.model';
import {
  createTransactionSuccess,
  deleteTransactionSuccess,
  initiateTransactionsSuccess,
  updateTransactionSuccess
} from '../actions/transactions.actions';

export const transactionsFeatureKey = 'transactions';

export interface TransactionsState {
  transactions: Transaction[];
}

export const initialTransactionsState: TransactionsState = {
  transactions: []
};

export const transactionsReducer = createReducer(
  initialTransactionsState,
  on(initiateTransactionsSuccess, (state, {transactions}) => ({...state, transactions})),
  on(deleteTransactionSuccess, (state, {deletedTransactionId}) => ({
    ...state,
    transactions: state.transactions.filter(item => item.id !== deletedTransactionId)
  })),
  on(createTransactionSuccess, (state, {newTransaction}) => ({
    ...state,
    transactions: [...state.transactions, newTransaction]
  })),
  on(updateTransactionSuccess, (state, {updatedTransaction}) => ({
    ...state,
    transactions: state.transactions.map(item => item.id === updatedTransaction.id ? {...item, ...updatedTransaction} : item)
  })),
);

const selectTransactionsState = createFeatureSelector<TransactionsState>(transactionsFeatureKey);

export const getTransactions = createSelector(selectTransactionsState, (state) => state.transactions);
export const getMyTransactions = (ownerId) => createSelector(selectTransactionsState,
  (state) => state.transactions.filter(transaction => transaction.traderId === ownerId));
export const getMyTransactionsAndOffers = (ownerId) => createSelector(selectTransactionsState,
  (state) => state.transactions.filter(transaction => transaction.traderId === ownerId
  || transaction.ownerId === ownerId));
export const getTransaction = (transactionId) => createSelector(selectTransactionsState,
  (state) => state.transactions.find(transaction => transaction.id === transactionId));
