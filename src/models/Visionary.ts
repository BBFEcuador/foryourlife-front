import type { Team } from './Participants';
import type { User } from './User';

export interface Visionary {
  role: string;
  user: User;
  active: boolean;
  teams: Team[];
}

export interface VisionaryActive {
  id: string;
  isActive: boolean;
}