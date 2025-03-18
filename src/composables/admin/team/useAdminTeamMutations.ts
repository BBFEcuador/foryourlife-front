import { api } from '@/api/axios';
import type { MinimalEntity } from '@/models/Shared';
import type { TeamLifePromotionRequest, TeamWriteModel, TeamYourPromotionRequest } from '@/models/Team';
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

const promoteToYour = async (req: TeamYourPromotionRequest): Promise<any> => {
  const { data } = await api.put(`/teams/promotion/your`, req);
  return data;
};

const promoteToLife = async (req: TeamLifePromotionRequest): Promise<any> => {
  const { data } = await api.put(`/teams/promotion/life`, req);
  return data;
};

const useAdminTeamMutations = () => {
  const saveTeamMutations = useMutation({ mutationFn: saveTeam });
  const removeParticipantsMutations = useMutation({ mutationFn: removeParticipants });
  const promoteParticipantsMutation = useMutation({ mutationFn: promoteParticipant });
  const promoteToYourMutation = useMutation({ mutationFn: promoteToYour });
  const promoteToLifeMutation = useMutation({ mutationFn: promoteToLife });
  return {
    saveTeamMutations,
    removeParticipantsMutations,
    promoteParticipantsMutation,
    promoteToYourMutation,
    promoteToLifeMutation
  };
};

export default useAdminTeamMutations;
