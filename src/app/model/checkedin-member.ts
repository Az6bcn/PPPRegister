export interface CheckedinMember {
  id: number;
  name: string;
  surname: string;
  mobile: string;
  signedIn: string;
  signedOut: string;
  serviceId: number;
  time: string;
  date: string;
  serviceName: string;
  pickUp: boolean;
  gender: string;
  categoryId: number;
  emailAddress: string;
  includeInBooking: boolean;
  justAddedLinkedUsers: boolean;
}
