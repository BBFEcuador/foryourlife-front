import { api } from "@/api/axios";
import type { Team } from "@/models/Participants";
import { useQuery } from "@tanstack/vue-query";
import { ref, watch } from "vue";

const team = ref<Team>({} as Team);

const fetchTeam = async (id: string): Promise<Team> => {
    const { data } = await api.get(`/teams/` + id);
    return data;
}

const useAdminTeam = (id: string) => {
    const { data, isError, isFetching, refetch } = useQuery({ 
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
        refetchTeam: refetch
     };
}

export default useAdminTeam;