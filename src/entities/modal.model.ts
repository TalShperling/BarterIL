export enum ModalActions {
  CLOSE = 'Close',
  SAVE = 'Save',
  DELETE = 'Delete',
  CANCEL = 'Cancel'
}

export interface ModalOptions {
  header: string;
  description: string;
  actions: { actionName: ModalActions, callback: () => void, color: string }[];
}
