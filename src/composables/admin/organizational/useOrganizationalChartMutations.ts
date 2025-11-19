import type { OrgChartPayload } from "@/models/OrganizationalChart";
import { api } from "@/api/axios";
import { useMutation } from "@tanstack/vue-query";

const saveOrganizationalChart = async (organizationalChart: OrgChartPayload): Promise<any> => {
    const { data } = await api.post('/organization', organizationalChart);
    return data;
}

const updateOrganizationalChart = async (organizationalChart: OrgChartPayload): Promise<any> => {
    const { data } = await api.post('/organization', organizationalChart);
    return data;
}


const useOrganizationalChartMutations = () => {
    const saveOrganizationalChartMutations = useMutation({ mutationFn: saveOrganizationalChart });
    const updateOrganizationalChartMutations = useMutation({ mutationFn: updateOrganizationalChart });
    return {
        saveOrganizationalChartMutations,
        updateOrganizationalChartMutations
    };
};

export default useOrganizationalChartMutations;