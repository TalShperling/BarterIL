import {createAction, props} from '@ngrx/store';
import {Transaction} from '../../../entities/transaction.model';

const TransactionsActionNames = {
  INITIATE_TRANSACTIONS: '[Transactions] Initiate transactions',
  INITIATE_TRANSACTIONS_SUCCESS: '[Transactions] Initiate transactions succeeded',
  INITIATE_TRANSACTIONS_FAIL: '[Transactions] Initiate transactions failed',
  DELETE_TRANSACTION: '[Transactions] Delete transactions',
  DELETE_TRANSACTION_SUCCESS: '[Transactions] Delete transactions succeeded',
  DELETE_TRANSACTION_FAIL: '[Transactions] Delete transactions failed',
  UPDATE_TRANSACTION: '[Transactions] Update transactions',
  UPDATE_TRANSACTION_SUCCESS: '[Transactions] Update transactions succeeded',
  UPDATE_TRANSACTION_FAIL: '[Transactions] Update transactions failed',
  CREATE_TRANSACTION: '[Transactions] Create transactions',
  CREATE_TRANSACTION_SUCCESS: '[Transactions] Create transactions succeeded',
  CREATE_TRANSACTION_FAIL: '[Transactions] Create transactions failed',
};

export const initiateTransactions = createAction(TransactionsActionNames.INITIATE_TRANSACTIONS);
export const initiateTransactionsSuccess = createAction(TransactionsActionNames.INITIATE_TRANSACTIONS_SUCCESS,
  props<{ transactions: Transaction[] }>());
export const initiateTransactionsFail = createAction(TransactionsActionNames.INITIATE_TRANSACTIONS_FAIL, props<{ message: string; }>());

export const deleteTransaction = createAction(TransactionsActionNames.DELETE_TRANSACTION, props<{ transactionToDelete: Transaction }>());
export const deleteTransactionSuccess = createAction(TransactionsActionNames.DELETE_TRANSACTION_SUCCESS,
  props<{ deletedTransactionId: string }>());
export const deleteTransactionFail = createAction(TransactionsActionNames.DELETE_TRANSACTION_FAIL, props<{ message: string; }>());

export const updateTransaction = createAction(TransactionsActionNames.UPDATE_TRANSACTION, props<{ transaction: Transaction }>());
export const updateTransactionSuccess = createAction(TransactionsActionNames.UPDATE_TRANSACTION_SUCCESS,
  props<{ updatedTransaction: Transaction }>());
export const updateTransactionFail = createAction(TransactionsActionNames.UPDATE_TRANSACTION_FAIL, props<{ message: string; }>());

export const createTransaction = createAction(TransactionsActionNames.CREATE_TRANSACTION, props<{ transaction: Transaction }>());
export const createTransactionSuccess = createAction(TransactionsActionNames.CREATE_TRANSACTION_SUCCESS,
  props<{ newTransaction: Transaction }>());
export const createTransactionFail = createAction(TransactionsActionNames.CREATE_TRANSACTION_FAIL, props<{ message: string; }>());

