import { CheckedinMember } from 'src/app/model/checkedin-member';
export interface IRegistrant {
  serviceId: number;
  date: string;
  time: string;
  name: string;
  surname: string;
  member: object;
  members: Array<CheckedinMember>;
  emailAddress: string;
  mobile: number;
  isGroupBooking: boolean;
}
