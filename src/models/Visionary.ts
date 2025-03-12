import type { Team } from './Participants';
import type { User } from './User';

export interface Visionary {
  id: string;
  role: string;
  user: User;
  active: boolean;
  teams: Team[];
}
