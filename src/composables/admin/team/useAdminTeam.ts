import { api } from "@/api/axios";
import type { TeamWriteModel } from "@/models/Team";
import { useQuery } from "@tanstack/vue-query";
import { ref, watch } from "vue";

const team = ref<TeamWriteModel>({} as TeamWriteModel);

const fetchTeam = async (id: string): Promise<TeamWriteModel> => {
    const { data } = await api.get(`/teams/` + id);
    return data;
}

const useAdminTeam = (id: string) => {
    const { data, isError, isFetching } = useQuery({ 
        queryKey: ['team', id], 
        queryFn: () => fetchTeam(id)
    });
    watch(data, () => {
        if(data.value){
            team.value = JSON.parse(JSON.stringify(data.value));
        }
    });

    return { 
        team,
        isTeamError: isError,
        isTeamLoading: isFetching,
     };
}

export default useAdminTeam;