import type { Team } from './Participants';
import type { User } from './User';

export interface StaffWriteModel {
  id: string;
  rol: string;
  user: User;
  active: boolean;
  teams: Team[];
}
