export enum MODAL_ACTIONS {
    CLOSE = "Close",
    SAVE = "Save",
    DELETE = "Delete",
    CANCEL = "Cancel"
}

export interface ModalOptions {
    heading: string;
    description: string;
    actions: {actionName:MODAL_ACTIONS, callback: ()=>{}, color: string}[];
    component: any;
}