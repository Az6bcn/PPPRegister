export interface IRegistrant {
    date: string;
    time: string;
    name: string;
    surname: string;
    member: object;
    members: Array<object>;
    emailAddress: string;
    mobile: number;
    isGroupBooking: boolean
  }