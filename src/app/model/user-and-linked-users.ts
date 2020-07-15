import { CheckedinMember } from './checkedin-member';
export interface UsersAndLinkedUsers {
  mainUser: CheckedinMember;
  linkedUsers: Array<CheckedinMember>;
}
