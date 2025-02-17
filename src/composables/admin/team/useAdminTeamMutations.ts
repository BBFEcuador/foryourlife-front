import { api } from '@/api/axios';
import type { TeamWriteModel } from '@/models/Team';
import { useMutation } from '@tanstack/vue-query';

const saveTeam = async (team: TeamWriteModel): Promise<any> => {
  const { data } = await api.post('/teams/save1', team);
  return data;
};

const useAdminTeamMutations = () => {
  const saveTeamMutations = useMutation({ mutationFn: saveTeam });

  return {
    saveTeamMutations
  };
};

export default useAdminTeamMutations;
