export class paymentTransactionsDtoCsv {}
export class paymentTransactionsDto {
  id?: string;
  organisation:string;
  
}

//TODO: we can get rid of all these and use prisma param types
export class paymentTransactionsDtoConnected {
  organisation:string;
}
