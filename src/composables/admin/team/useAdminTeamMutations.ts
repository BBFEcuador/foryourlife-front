import { api } from '@/api/axios';
import type { MinimalEntity } from '@/models/Shared';
import type { TeamWriteModel } from '@/models/Team';
import { useMutation } from '@tanstack/vue-query';

const saveTeam = async (team: TeamWriteModel): Promise<any> => {
  let url = '/teams/save/focus';
  switch (team.lvl) {
    case 'LIFE':
      url = '/teams/save/life';
      break;
    case 'YOUR':
      url = '/teams/save/focus';
      break;
    default:
      url = '/teams/save/focus';
      break;
  }
  const { data } = await api.post('/teams/save/focus', team);
  return data;
};

const removeParticipants = async (req: { teamId: string, users: MinimalEntity[], url: string }): Promise<any> => {
  const { data } = await api.put(`/teams/${req.url}`, req);
  return data;
};

const promoteParticipant = async (req: { teamId: string, users: MinimalEntity[], url: string }): Promise<any> => {
  const { data } = await api.put(`/teams/promote/${req.url}`, req);
  return data;
};

const useAdminTeamMutations = () => {
  const saveTeamMutations = useMutation({ mutationFn: saveTeam });
  const removeParticipantsMutations = useMutation({ mutationFn: removeParticipants });
  const promoteParticipantsMutation = useMutation({ mutationFn: promoteParticipant });
  return {
    saveTeamMutations,
    removeParticipantsMutations,
    promoteParticipantsMutation
  };
};

export default useAdminTeamMutations;
