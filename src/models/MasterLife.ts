import type { Team } from './Participants';
import type { User } from './User';

export interface MasterLife {
  id: string;
  user: User;
  teams: Team[];
  active: boolean;
}
