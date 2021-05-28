import { TransactionStatus } from "src/app/barter/transaction-status";
import { Item } from "./item.model";
import { User } from "./user.model";

export type TransactionAndUsers = {
    id: string,
    trader: User,
    owner: User,
    traderItem: Item,
    ownerItem: Item,
    status: TransactionStatus
}